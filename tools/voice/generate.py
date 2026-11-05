#!/usr/bin/env python3
"""Voice a guide's speech bubbles with local text-to-speech.

Every line the guide says (tools/voice/lines.mjs) becomes a small mono MP3 in
audio/<guide>/<key>.mp3, where <key> is the FNV-1a hash of the line (the same
as voiceKey() in src/domain/voice.js). Lines that already have audio are
skipped, files of lines that are gone are removed, and src/content/voices.js
lists what there is.

The voice is Kokoro-82M (kokoro-onnx, runs on the CPU) with one of its
Japanese female voices reading English: a young woman's voice with a Japanese
accent. The Japanese words in {braces} are written in romaji; they are turned
into Japanese phonemes here, so they sound Japanese rather than read as
English.

Setup (once):
    python3 -m venv .venv-voice && .venv-voice/bin/pip install kokoro-onnx soundfile
    mkdir -p ~/.cache/kokoro && cd ~/.cache/kokoro && for f in kokoro-v1.0.int8.onnx voices-v1.0.bin; do
      curl -LO https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/$f; done
Needs node and ffmpeg. Run from the repository root:
    .venv-voice/bin/python tools/voice/generate.py --guide hana
"""

import argparse
import json
import re
import subprocess
import sys
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
MODEL_DIR = Path.home() / ".cache" / "kokoro"

# Braced words that are English (or names said the English way), and how to say some of them.
ENGLISH = {
    "L + R": "L and R",
    "G09": "G zero nine",
    "Tokyo Skytree": None,
    "scramble": None,
    "Tokyo Metropolitan Government Building": None,
    "Rainbow Bridge": None,
    "Odaiba Seaside Park": None,
    "Fuji TV": None,
    "Tokyo Tower": None,
}


# Japanese names in the plain English text: said the Japanese way. Value: the romaji to say (None: as written).
JAPANESE = {
    w: None
    for w in "Akiba Akihabara Akita Asakusa Chūō Daimon Edo Fushimi Fuji Ginza Gyōkō-dōri Hachikō Hana Hanzōmon Harajuku "
    "Kenzō Marunouchi Meiji Mori Nemuro Ochanomizu Odaiba Sensō-ji Shibuya Shinagawa Shinjuku Shinkansen Solamachi "
    "Sumida Takeshita Tange Tokugawa Yamanote Yotsuya Yurikamome Ōtemachi KITTE".split()
} | {"Tokyo": "Tōkyō", "Hokkaido": "Hokkaidō", "Shimbashi": "Shinbashi"}

ONES = "zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen".split()
TENS = "_ _ twenty thirty forty fifty sixty seventy eighty ninety".split()


def two_digits(n: int) -> str:
    return ONES[n] if n < 20 else TENS[n // 10] + ("-" + ONES[n % 10] if n % 10 else "")


def year_words(m: re.Match) -> str:
    """1603 -> sixteen oh three, 1868 -> eighteen sixty-eight, 1600s -> sixteen hundreds."""
    y, plural = int(m.group(1)), m.group(2)
    hi, lo = divmod(y, 100)
    if lo == 0:
        words = two_digits(hi) + " hundred"
    elif lo < 10:
        words = two_digits(hi) + " oh " + ONES[lo]
    else:
        words = two_digits(hi) + " " + two_digits(lo)
    if plural:
        words = words[:-1] + "ies" if words.endswith("y") else words + "s"
    return words


def normalize(plain: str) -> str:
    """Years and digit-by-digit numbers the way they are said."""
    plain = re.sub(r"\b(1[0-9]{3})(s)?\b", year_words, plain)
    plain = re.sub(r"\b\d(?:-\d)+\b", lambda m: ", ".join(ONES[int(d)] for d in m.group(0).split("-")), plain)
    return plain


def voice_key(line: str) -> str:
    """FNV-1a, 32 bit, of the UTF-8 bytes: the same as voiceKey() in src/domain/voice.js."""
    h = 0x811C9DC5
    for b in line.encode("utf-8"):
        h = ((h ^ b) * 0x01000193) & 0xFFFFFFFF
    return f"{h:08x}"


# ---------- romaji -> IPA (Kokoro's Japanese phoneme set) ----------

VOWELS = {"a": "a", "i": "i", "u": "ɯ", "e": "e", "o": "o"}
LONG = {"ā": "a", "ī": "i", "ū": "u", "ē": "e", "ō": "o", "â": "a", "î": "i", "û": "u", "ê": "e", "ô": "o"}
# Longest first. Each maps a consonant (cluster) to its IPA before a vowel.
CONSONANTS = [
    ("sh", "ɕ"), ("ch", "ʨ"), ("ts", "ʦ"), ("ky", "kj"), ("gy", "ɡj"), ("ny", "ɲ"), ("hy", "ç"), ("by", "bj"),
    ("py", "pj"), ("my", "mj"), ("ry", "ɾj"), ("j", "ʥ"), ("f", "ɸ"), ("k", "k"), ("g", "ɡ"), ("s", "s"),
    ("z", "z"), ("t", "t"), ("d", "d"), ("n", "n"), ("h", "h"), ("b", "b"), ("p", "p"), ("m", "m"),
    ("y", "j"), ("r", "ɾ"), ("w", "w"), ("v", "b"), ("l", "ɾ"),
]
SPECIAL = {("s", "i"): "ɕ", ("z", "i"): "ʥ", ("t", "i"): "ʨ", ("t", "u"): "ʦ", ("h", "u"): "ɸ", ("d", "i"): "ʥ"}


def romaji_to_ipa(word: str) -> str:
    """Hepburn romaji (with macrons for long vowels) to IPA. Unknown letters are dropped."""
    s = word.lower().replace("-", "")
    out = []
    i = 0
    while i < len(s):
        c = s[i]
        if c in LONG:
            out.append(VOWELS[LONG[c]] + "ː")
            i += 1
            continue
        if c in VOWELS:
            out.append(VOWELS[c])
            i += 1
            continue
        if c == "n" and (i + 1 >= len(s) or (s[i + 1] not in VOWELS and s[i + 1] not in LONG and s[i + 1] != "y")):
            out.append("ɴ")  # syllabic n
            i += 1
            continue
        if c == "'":
            i += 1
            continue
        # Doubled consonant (small tsu): kk, ss, tt, pp, and tch.
        if c != "n" and i + 1 < len(s) and (s[i + 1] == c or (c == "t" and s[i + 1 : i + 3] == "ch")):
            out.append("ʔ")
            i += 1
            continue
        for rom, ipa in CONSONANTS:
            if s.startswith(rom, i):
                nxt = s[i + len(rom) : i + len(rom) + 1]
                vowel = LONG.get(nxt, nxt)
                out.append(SPECIAL.get((rom, vowel), ipa))
                i += len(rom)
                break
        else:
            i += 1  # not a romaji letter
    return "".join(out)


def phonemes(kokoro, line: str) -> str:
    """The line as Kokoro phonemes: English parts through its English G2P, braced Japanese words through romaji_to_ipa."""
    parts = []
    for m in re.finditer(r"\{([^}]*)\}|([^{]+)", line):
        braced, plain = m.group(1), m.group(2)
        if plain is not None:
            # Japanese names inside the English: split them out and say them in Japanese.
            names = "|".join(map(re.escape, sorted(JAPANESE, key=len, reverse=True)))
            for chunk in re.split(r"(?<![\w-])((?:" + names + r")(?:['’]s)?)(?![\w-])", normalize(plain)):
                name = re.sub(r"['’]s$", "", chunk)
                if name in JAPANESE:
                    parts.append(romaji_to_ipa(JAPANESE[name] or name) + ("z" if name != chunk else ""))
                elif chunk.strip():
                    parts.append(kokoro.tokenizer.phonemize(chunk, "en-us"))
            continue
        word = braced.strip()
        if word in ENGLISH:
            parts.append(kokoro.tokenizer.phonemize(ENGLISH[word] or word, "en-us"))
            continue
        punct = re.search(r"[!?.,]+$", word)
        core = word[: punct.start()] if punct else word
        ipa = " ".join(romaji_to_ipa(w) for w in core.split())
        parts.append(ipa + (punct.group(0) if punct else ""))
    text = " ".join(p.strip() for p in parts if p.strip())
    return re.sub(r"\s+([!?.,;:])", r"\1", text)


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--guide", default="hana")
    ap.add_argument("--voice", default="jf_alpha", help="Kokoro voice (jf_alpha, jf_gongitsune, jf_nezumi, jf_tebukuro)")
    ap.add_argument("--speed", type=float, default=1.0)
    ap.add_argument("--bitrate", default="32k", help="MP3 bitrate (mono, 24 kHz)")
    ap.add_argument("--dry-run", action="store_true", help="only print the phonemes")
    args = ap.parse_args()

    from kokoro_onnx import Kokoro
    import soundfile as sf

    data = json.loads(subprocess.run(["node", "tools/voice/lines.mjs", args.guide], cwd=ROOT, check=True, capture_output=True, text=True).stdout)
    lines = data["lines"]
    out_dir = ROOT / "audio" / args.guide
    out_dir.mkdir(parents=True, exist_ok=True)
    kokoro = Kokoro(str(MODEL_DIR / "kokoro-v1.0.int8.onnx"), str(MODEL_DIR / "voices-v1.0.bin"))

    keys = []
    for n, line in enumerate(lines, 1):
        key = voice_key(line)
        keys.append(key)
        mp3 = out_dir / f"{key}.mp3"
        ph = phonemes(kokoro, unicodedata.normalize("NFC", line))
        if args.dry_run:
            print(f"{key} {ph}")
            continue
        if mp3.exists():
            continue
        samples, rate = kokoro.create(ph, voice=args.voice, speed=args.speed, is_phonemes=True)
        wav = out_dir / f"{key}.wav"
        sf.write(wav, samples, rate)
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", wav, "-ac", "1", "-ar", "24000", "-codec:a", "libmp3lame", "-b:a", args.bitrate, mp3], check=True)
        wav.unlink()
        print(f"[{n}/{len(lines)}] {key} {len(samples) / rate:.1f}s {mp3.stat().st_size // 1024} KB  {line[:60]}", flush=True)
    if args.dry_run:
        return

    for f in out_dir.glob("*.mp3"):
        if f.stem not in keys:
            f.unlink()
            print("removed", f.name)
    manifest = ROOT / "src" / "content" / "voices.js"
    voices = {}
    if manifest.exists():
        voices = json.loads(re.search(r"VOICE_DATA = (\{.*\});", manifest.read_text(), re.S).group(1))
    voices[args.guide] = {"dir": f"audio/{args.guide}", "voice": f"Kokoro {args.voice}", "keys": sorted(set(keys))}
    manifest.write_text(
        "// Guides with a recorded voice: which lines have audio (audio/<guide>/<key>.mp3).\n"
        "// Generated by tools/voice/generate.py; do not edit.\n\n"
        f"const VOICE_DATA = {json.dumps(voices, indent=1)};\n\n"
        "/** @type {Record<string, { dir: string, keys: ReadonlySet<string> }>} */\n"
        "export const VOICES = Object.fromEntries(\n"
        "  Object.entries(VOICE_DATA).map(([guide, v]) => [guide, { dir: v.dir, keys: new Set(v.keys) }]),\n"
        ");\n"
    )
    total = sum(f.stat().st_size for f in out_dir.glob("*.mp3"))
    print(f"{len(keys)} lines, {total / 1024:.0f} KB in {out_dir.relative_to(ROOT)}; wrote {manifest.relative_to(ROOT)}")


if __name__ == "__main__":
    sys.exit(main())
