#!/usr/bin/env python3
"""Download and prepare the journeys' music (audio/music/<journey>.mp3).

Every track is shortened to at most three minutes, normalised to the same
loudness and faded at both ends so that it loops softly. Sources and licences:
CREDITS.md. Needs ffmpeg.

    python3 tools/music/build.py [journey ...]
"""
import pathlib
import subprocess
import sys
import tempfile
import urllib.parse
import urllib.request

COMMONS = "https://commons.wikimedia.org/wiki/Special:FilePath/"
ARCHIVE = "https://archive.org/download/"
HEADERS = {"User-Agent": "virtual-visit-music-build/1.0"}
OUT = pathlib.Path(__file__).resolve().parents[2] / "audio" / "music"
MAX_SECONDS = 180

TRACKS = {
    "tokyo": COMMONS + "Kojonotsuki.ogg",
    "beijing": COMMONS + "雨打芭蕉.ogg",
    "moscow": COMMONS + "Kalinka.ogg",
    "bogota": COMMONS + "Cuando la vida se va-fragmento.ogg",
    "rio": COMMONS + "Agradeco e dou respeito.ogg",
    "newyork": ARCHIVE + "TinaEAndrusSmokyMountainFiddle/SMOKYMTN.mp3",
    "ulaanbaatar": ARCHIVE + "aporee_8216_9989/MusiciansfromMongoliainfrontofCentrePompidou.mp3",
    "capetown": ARCHIVE + "traditionalsongsfromsouthafrica/limpopo.mp3",
    "cairo": COMMONS + "Egyptian singer of the Band Asyad El Zar فرقه اسياد الزار.webm",
    "kingston": COMMONS + "Endless Dub.ogg",
}

# Seconds of silence to skip at the start of a source.
START = {"kingston": 3.7}


def duration(path):
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)],
        capture_output=True, text=True, check=True)
    return float(out.stdout)


def build(journey, url, tmp):
    quoted = urllib.parse.quote(url, safe=":/")
    with urllib.request.urlopen(urllib.request.Request(quoted, headers=HEADERS), timeout=120) as r:
        source = tmp / f"{journey}.source"
        source.write_bytes(r.read())
    start = START.get(journey, 0)
    length = min(duration(source) - start, MAX_SECONDS)
    fades = f"afade=t=in:d=0.4,afade=t=out:st={length - 2.5:.2f}:d=2.5"
    subprocess.run(
        ["ffmpeg", "-y", "-loglevel", "error", "-ss", f"{start}", "-i", str(source), "-vn", "-t", f"{length:.2f}",
         "-af", f"{fades},loudnorm=I=-20:TP=-2:LRA=11", "-ar", "44100", "-ac", "2",
         "-codec:a", "libmp3lame", "-b:a", "128k", "-id3v2_version", "0", str(OUT / f"{journey}.mp3")],
        check=True)
    print(f"{journey}: {length:.0f} s")


def main():
    with tempfile.TemporaryDirectory() as d:
        for journey, url in TRACKS.items():
            if not sys.argv[1:] or journey in sys.argv[1:]:
                build(journey, url, pathlib.Path(d))


if __name__ == "__main__":
    main()
