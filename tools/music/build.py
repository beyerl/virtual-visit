#!/usr/bin/env python3
"""Download and prepare the journeys' music (audio/music/<journey>.mp3).

Every track is shortened to at most three minutes, normalised to the same
loudness and faded at both ends so that it loops softly. Sources and licences:
CREDITS.md. Needs ffmpeg.

    python3 tools/music/build.py
"""
import pathlib
import subprocess
import tempfile
import urllib.parse
import urllib.request

BASE = "https://incompetech.com/music/royalty-free/mp3-royaltyfree/"
HEADERS = {"User-Agent": "virtual-visit-music-build/1.0"}
OUT = pathlib.Path(__file__).resolve().parents[2] / "audio" / "music"
MAX_SECONDS = 180

TRACKS = {
    "tokyo": "Ishikari Lore.mp3",
    "beijing": "Shenyang.mp3",
    "moscow": "Padanaya Blokov.mp3",
    "bogota": "Del Rio Bravo.mp3",
    "rio": "Casa Bossa Nova.mp3",
    "newyork": "Mister Exposition.mp3",
    "ulaanbaatar": "Cattails.mp3",
    "capetown": "Allada.mp3",
    "cairo": "Desert City.mp3",
    "nairobi": "Savannah Sketch.mp3",
    "kingston": "Beach Party.mp3",
}


def duration(path):
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)],
        capture_output=True, text=True, check=True)
    return float(out.stdout)


def build(journey, filename, tmp):
    quoted = BASE + urllib.parse.quote(filename)
    with urllib.request.urlopen(urllib.request.Request(quoted, headers=HEADERS), timeout=120) as r:
        source = tmp / f"{journey}.source"
        source.write_bytes(r.read())
    length = min(duration(source), MAX_SECONDS)
    fades = f"afade=t=in:d=0.4,afade=t=out:st={length - 2.5:.2f}:d=2.5"
    subprocess.run(
        ["ffmpeg", "-y", "-loglevel", "error", "-i", str(source), "-vn", "-t", f"{length:.2f}",
         "-af", f"{fades},loudnorm=I=-20:TP=-2:LRA=11", "-ar", "44100", "-ac", "2",
         "-codec:a", "libmp3lame", "-b:a", "128k", "-id3v2_version", "0", str(OUT / f"{journey}.mp3")],
        check=True)
    print(f"{journey}: {length:.0f} s")


def main():
    with tempfile.TemporaryDirectory() as d:
        for journey, filename in TRACKS.items():
            build(journey, filename, pathlib.Path(d))


if __name__ == "__main__":
    main()
