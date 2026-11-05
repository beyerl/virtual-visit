#!/usr/bin/env python3
"""Voice a guide's speech bubbles with local text-to-speech.

Every line the guide says (tools/voice/lines.mjs) becomes a small mono MP3 in
audio/<guide>/<key>.mp3, where <key> is the FNV-1a hash of the line (the same
as voiceKey() in src/domain/voice.js). Lines that already have audio are
skipped, files of lines that are gone are removed, and src/content/voices.js
lists what there is.

Each guide reads English with the accent of their city; tools/voice/guides.py
says which voice and how. Two engines run on the CPU: Kokoro-82M (kokoro-onnx)
and Piper.

Setup (once):
    python3 -m venv .venv-voice && .venv-voice/bin/pip install kokoro-onnx piper-tts soundfile
    mkdir -p ~/.cache/kokoro && cd ~/.cache/kokoro && for f in kokoro-v1.0.int8.onnx voices-v1.0.bin; do
      curl -LO https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/$f; done
    Piper voices (the models named in guides.py) go to ~/.cache/piper, from
    https://huggingface.co/rhasspy/piper-voices, e.g.
      mkdir -p ~/.cache/piper && cd ~/.cache/piper && for e in .onnx .onnx.json; do
      curl -LO https://huggingface.co/rhasspy/piper-voices/resolve/main/ru/ru_RU/irina/medium/ru_RU-irina-medium$e; done
Needs node and ffmpeg. Run from the repository root:
    .venv-voice/bin/python tools/voice/generate.py --guide katya     (or --all)
"""

import argparse
import json
import re
import subprocess
import sys
import unicodedata
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from guides import ENGLISH_BRACED, GUIDES, Guide, Kokoro, Piper  # noqa: E402
from phonetics import devoice_finals, fit, normalize, pinyin_to_ipa, romaji_phrase, romaji_to_ipa  # noqa: E402

ROOT = Path(__file__).resolve().parents[2]
KOKORO_DIR = Path.home() / ".cache" / "kokoro"
PIPER_DIR = Path.home() / ".cache" / "piper"
JAPANESE_EVERYWHERE = {"Okaeri!"}  # the welcome-back line every guide shares
CYRILLIC = re.compile(r"[Ѐ-ӿ]")


def voice_key(line: str) -> str:
    """FNV-1a, 32 bit, of the UTF-8 bytes: the same as voiceKey() in src/domain/voice.js."""
    h = 0x811C9DC5
    for b in line.encode("utf-8"):
        h = ((h ^ b) * 0x01000193) & 0xFFFFFFFF
    return f"{h:08x}"


# ---------- engines ----------


class KokoroVoice:
    def __init__(self, engine: Kokoro):
        from kokoro_onnx import Kokoro as K

        self.engine = engine
        self.kokoro = K(str(KOKORO_DIR / "kokoro-v1.0.int8.onnx"), str(KOKORO_DIR / "voices-v1.0.bin"))

    def phonemize(self, text: str, lang: str) -> str:
        return self.kokoro.tokenizer.phonemize(text, lang)

    def synthesize(self, ipa: str):
        ipa = "".join(c for c in ipa if c in self.kokoro.tokenizer.vocab)
        return self.kokoro.create(ipa, voice=self.engine.voice, speed=self.engine.speed, is_phonemes=True)


class PiperVoice:
    def __init__(self, engine: Piper):
        from piper import PiperVoice as P, SynthesisConfig

        self.engine = engine
        self.voice = P.load(str(PIPER_DIR / f"{engine.model}.onnx"))
        speaker = self.voice.config.speaker_id_map.get(engine.speaker) if engine.speaker else None
        if engine.speaker and speaker is None:
            raise SystemExit(f"{engine.model} has no speaker {engine.speaker}")
        self.config = SynthesisConfig(speaker_id=speaker, length_scale=engine.length_scale)

    def phonemize(self, text: str, lang: str) -> str:
        from piper import espeakbridge
        from piper.phonemize_espeak import ESPEAK_DATA_DIR

        espeakbridge.initialize(str(ESPEAK_DATA_DIR))
        espeakbridge.set_voice(lang)
        clauses = espeakbridge.get_phonemes(text)
        return " ".join(re.sub(r"\([^)]+\)", "", ph) + term for ph, term, _ in clauses)

    def synthesize(self, ipa: str):
        import numpy as np

        rate = self.voice.config.sample_rate
        pause = np.zeros(int(rate * 0.18), dtype=np.float32)
        parts = []
        # One sentence at a time: the model was trained on sentences.
        for sentence in re.findall(r"[^.!?]+[.!?]*", ipa):
            if not sentence.strip(" .!?,"):
                continue
            ids = self.voice.phonemes_to_ids(list(unicodedata.normalize("NFD", sentence.strip())))
            audio = self.voice.phoneme_ids_to_audio(ids, self.config)
            parts += [audio.astype(np.float32), pause]
        audio = np.concatenate(parts[:-1]) if parts else np.zeros(1, dtype=np.float32)
        peak = float(np.max(np.abs(audio))) or 1.0
        return audio / peak * 0.9, rate


def load_voice(guide: Guide):
    return KokoroVoice(guide.engine) if isinstance(guide.engine, Kokoro) else PiperVoice(guide.engine)


# ---------- lines -> phonemes ----------


def segments(guide: Guide, line: str) -> list[tuple[str, str]]:
    """Split a line into ("en" | "local" | "ja", text) parts."""
    out: list[tuple[str, str]] = []

    def add(kind: str, text: str):
        if out and out[-1][0] == kind:
            out[-1] = (kind, out[-1][1] + " " + text)
        else:
            out.append((kind, text))

    def add_local(text: str):
        said = guide.say.get(text, text)
        if said.startswith("af:"):  # another language than the guide's, e.g. Afrikaans in Cape Town
            add("local:af", said[3:])
        elif guide.cyrillic:
            for run in re.findall(r"[Ѐ-ӿ][Ѐ-ӿ\s\-'!?.,]*|[^Ѐ-ӿ]+", said):
                if run.strip():
                    add("local" if CYRILLIC.search(run) else "en", run.strip())
        else:
            add("local", said)

    for m in re.finditer(r"\{([^}]*)\}|([^{]+)", unicodedata.normalize("NFC", line)):
        braced, plain = m.group(1), m.group(2)
        if braced is not None:
            word = braced.strip()
            if word in JAPANESE_EVERYWHERE and guide.local != "romaji":
                add("ja", word)
            elif word in ENGLISH_BRACED:
                add("en", ENGLISH_BRACED[word])
            elif word in guide.english_words or guide.local == guide.english:
                add("en", word)
            elif word in guide.say or guide.cyrillic:
                add_local(word)
            else:
                # Word by word: some braced names are half English ("Tahrir Square").
                for w in word.split():
                    bare = w.strip("!?.,")
                    if bare in guide.english_words or bare in ENGLISH_BRACED:
                        add("en", ENGLISH_BRACED.get(bare, w))
                    else:
                        add_local(w) if w in guide.say else add("local", w)
            continue
        # Plain English, with local names (accented, or listed) said the local way.
        for chunk in re.split(r"(\s+)", normalize(plain)):
            if not chunk.strip():
                continue
            m2 = re.match(r"^([\"'(‘“]*)(.*?)(['’]s)?([\"'),.!?;:’”]*)$", chunk)
            lead, core, poss, trail = m2.groups()
            local = core in guide.names or core in guide.say or any(c.isalpha() and ord(c) > 127 for c in core)
            if core and local and re.search(r"\w", core) and guide.local != guide.english:
                if lead:
                    add("en", lead)
                add_local(core)
                tail = ("z" if poss else "") + trail
                if tail:
                    out.append(("ipa", tail))
            else:
                add("en", chunk)
    return out


def phonemes(voice, guide: Guide, line: str) -> str:
    parts = []
    for kind, text in segments(guide, line):
        if kind == "ipa":
            ipa = text
        elif kind == "en":
            ipa = voice.phonemize(text, guide.english).replace("ʲ", "")  # espeak's linking glide ("we_y_arrive")
            if guide.target:
                ipa = fit(ipa, guide.target, guide.accent)
        elif kind == "ja" or guide.local == "romaji":
            ipa = romaji_phrase(text)
        elif guide.local == "pinyin":
            ipa = pinyin_to_ipa(text)
        else:
            ipa = voice.phonemize(text, kind.split(":")[1] if ":" in kind else guide.local)
        if kind != "en" and guide.target:
            ipa = fit(ipa, guide.target)
        if guide.devoice:
            ipa = devoice_finals(ipa)
        if kind == "ipa" and parts:
            parts[-1] += ipa
        else:
            parts.append(ipa.strip())
    text = " ".join(p for p in parts if p)
    return re.sub(r"\s+([!?.,;:])", r"\1", text).strip()


# ---------- main ----------


def voice_guide(name: str, args) -> None:
    import soundfile as sf

    guide = GUIDES[name]
    data = json.loads(subprocess.run(["node", "tools/voice/lines.mjs", name], cwd=ROOT, check=True, capture_output=True, text=True).stdout)
    lines = data["lines"][: args.limit] if args.limit else data["lines"]
    out_dir = Path(args.out) / name if args.out else ROOT / "audio" / name
    out_dir.mkdir(parents=True, exist_ok=True)
    voice = load_voice(guide)

    keys = []
    for n, line in enumerate(lines, 1):
        key = voice_key(line)
        keys.append(key)
        mp3 = out_dir / f"{key}.mp3"
        ph = phonemes(voice, guide, line)
        if args.dry_run:
            print(f"{key} {ph}")
            continue
        if mp3.exists():
            continue
        samples, rate = voice.synthesize(ph)
        wav = out_dir / f"{key}.wav"
        sf.write(wav, samples, rate)
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", wav, "-ac", "1", "-ar", "24000", "-codec:a", "libmp3lame", "-b:a", args.bitrate, mp3], check=True)
        wav.unlink()
        print(f"[{name} {n}/{len(lines)}] {key} {len(samples) / rate:.1f}s {mp3.stat().st_size // 1024} KB  {line[:60]}", flush=True)
    if args.dry_run or args.out or args.limit:
        return

    for f in out_dir.glob("*.mp3"):
        if f.stem not in keys:
            f.unlink()
            print("removed", f.name)
    manifest = ROOT / "src" / "content" / "voices.js"
    voices = {}
    if manifest.exists():
        voices = json.loads(re.search(r"VOICE_DATA = (\{.*\});", manifest.read_text(), re.S).group(1))
    voices[name] = {"dir": f"audio/{name}", "voice": guide.engine.label(), "keys": sorted(set(keys))}
    voices = dict(sorted(voices.items()))
    manifest.write_text(
        "// Guides with a recorded voice: which lines have audio (audio/<guide>/<key>.mp3).\n"
        "// Generated by tools/voice/generate.py; do not edit.\n\n"
        f"const VOICE_DATA = {json.dumps(voices, indent=1, ensure_ascii=False)};\n\n"
        "/** @type {Record<string, { dir: string, keys: ReadonlySet<string> }>} */\n"
        "export const VOICES = Object.fromEntries(\n"
        "  Object.entries(VOICE_DATA).map(([guide, v]) => [guide, { dir: v.dir, keys: new Set(v.keys) }]),\n"
        ");\n"
    )
    total = sum(f.stat().st_size for f in out_dir.glob("*.mp3"))
    print(f"{name}: {len(keys)} lines, {total / 1024:.0f} KB in {out_dir.relative_to(ROOT)}; wrote {manifest.relative_to(ROOT)}")


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--guide", action="append", choices=sorted(GUIDES), help="guide id (repeatable)")
    ap.add_argument("--all", action="store_true", help="every guide")
    ap.add_argument("--bitrate", default="32k", help="MP3 bitrate (mono, 24 kHz)")
    ap.add_argument("--dry-run", action="store_true", help="only print the phonemes")
    ap.add_argument("--limit", type=int, help="only the first N lines (for trying a voice; no manifest)")
    ap.add_argument("--out", help="write to OUT/<guide> instead of audio/ (for trying a voice; no manifest)")
    args = ap.parse_args()
    names = sorted(GUIDES) if args.all else (args.guide or [])
    if not names:
        ap.error("name a --guide or use --all")
    for name in names:
        voice_guide(name, args)


if __name__ == "__main__":
    sys.exit(main())
