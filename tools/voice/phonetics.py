"""Sound conversions for the guide voices: numbers in words, romaji and pinyin
to IPA, and fitting IPA from one language into the sounds a voice knows.

Fitting is what gives most guides their accent: English IPA is rewritten with
only the sounds of the guide's language (a Russian voice has no "th" or "w",
so "the weather" becomes "ze vezer"), the way a learner fills in the sounds
their own language lacks. It also makes local words safe for English voices.
"""

import re
import unicodedata

# ---------- numbers ----------

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


def romaji_phrase(text: str) -> str:
    """A romaji phrase, punctuation kept: "Mata ne!" -> "mata ne!"."""
    punct = re.search(r"[!?.,]+$", text)
    core = text[: punct.start()] if punct else text
    return " ".join(romaji_to_ipa(w) for w in core.split()) + (punct.group(0) if punct else "")


# ---------- pinyin -> IPA (tones dropped) ----------

# Unaspirated b, d, g, z, j sound voiced to English ears, so they are written voiced.

PINYIN_INITIALS = [
    ("zh", "dʒ"), ("ch", "tʃ"), ("sh", "ʃ"), ("b", "b"), ("p", "p"), ("m", "m"), ("f", "f"), ("d", "d"), ("t", "t"),
    ("n", "n"), ("l", "l"), ("g", "ɡ"), ("k", "k"), ("h", "x"), ("j", "dʑ"), ("q", "tɕ"), ("x", "ɕ"), ("r", "ʐ"),
    ("z", "dz"), ("c", "ts"), ("s", "s"), ("y", ""), ("w", ""),
]
PINYIN_FINALS = {
    "iang": "jɑŋ", "iong": "jʊŋ", "uang": "wɑŋ", "ueng": "wəŋ", "ang": "ɑŋ", "eng": "əŋ", "ing": "iŋ", "ong": "ʊŋ",
    "iao": "jaʊ", "ian": "jɛn", "uai": "waɪ", "uan": "wan", "üan": "ɥɛn", "van": "ɥɛn",
    "ai": "aɪ", "ei": "eɪ", "ao": "aʊ", "ou": "oʊ", "an": "an", "en": "ən", "er": "ɑɻ", "ia": "jɑ", "ie": "jɛ", "iu": "joʊ",
    "in": "in", "ua": "wɑ", "uo": "wɔ", "ui": "weɪ", "un": "wən", "üe": "ɥɛ", "ve": "ɥɛ", "ün": "yn", "vn": "yn",
    "a": "ɑ", "o": "ɔ", "e": "ɤ", "i": "i", "u": "u", "ü": "y", "v": "y",
}
TONE_MARKS = str.maketrans("āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ", "aaaaeeeeiiiioooouuuuüüüü")


def pinyin_to_ipa(text: str) -> str:
    """Pinyin with tone marks to IPA, one syllable at a time; the tones are dropped (English voices can't sing them)."""
    out = []
    for token in re.findall(r"[A-Za-zāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜüÜ']+|[^A-Za-zāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜüÜ']+", text):
        if not re.match(r"[A-Za-zā-ǜüÜ']", token):
            out.append(token)
            continue
        s = unicodedata.normalize("NFC", token.lower()).translate(TONE_MARKS)
        syllables = []
        i = 0
        while i < len(s):
            if s[i] == "'":
                i += 1
                continue
            for rom, ipa in PINYIN_INITIALS:
                if s.startswith(rom, i):
                    init, iipa = rom, ipa
                    break
            else:
                init, iipa = "", ""
            j = i + len(init)
            for fin in sorted(PINYIN_FINALS, key=len, reverse=True):
                if not s.startswith(fin, j):
                    continue
                rest = s[j + len(fin) :]
                # "n"/"ng" finals: don't swallow the next syllable's initial ("Tiānānmén" is tian-an-men).
                if fin.endswith("n") and rest[:1] in "aeiouüv":
                    continue
                if fin.endswith("ng") and rest[:1] in "aeiouüv" and fin[:-1] in PINYIN_FINALS:
                    continue
                break
            else:
                fin = ""
            if not init and not fin:
                i += 1
                continue
            f = PINYIN_FINALS.get(fin, "")
            if init in ("j", "q", "x", "y") and fin.startswith("u"):  # ju, que, xun, yuan: u is ü
                f = PINYIN_FINALS.get("ü" + fin[1:], f)
            if init in ("zh", "ch", "sh", "r", "z", "c", "s") and fin == "i":
                f = "ɻ" if init in ("zh", "ch", "sh", "r") else "ɯ"  # zhi, si: buzzing vowel
            if init == "y":
                f = {"i": "i", "in": "in", "ing": "iŋ"}.get(fin, "j" + f if not f.startswith("j") else f)
            if init == "w":
                f = {"u": "u"}.get(fin, "w" + f if not f.startswith("w") else f)
            syllables.append(iipa + f)
            i = j + len(fin)
        out.append("ˈ" + "".join(syllables) if syllables else "")
    return "".join(out)


# ---------- fitting IPA into a voice's sounds ----------

# Sounds each target knows (besides stress marks, spaces and punctuation, which always pass).
INVENTORY = {
    "en": set("abdefhijklmnopstuvwzðŋɐɑɒɔəɚɛɜɡɪɹɾʃʊʌʒθæᵻːʔ") | {"aɪ", "aʊ", "eɪ", "oʊ", "ɔɪ", "əʊ", "eə", "ɪə", "ʊə", "tʃ", "dʒ"},
    "ru": set("abdefijkmnoprstuvxzɑɕɛɡɪɭɵʃʌʑʒʲɨ") | {"tʃ", "ts"},
    "sw": set("abdefhijklmnoprstuvwzðɟɡɣɲʃθ") | {"tʃ"},
}

# What to use for a sound a voice doesn't know: the first option it does know (or nothing).
FALLBACK = {
    # vowels and diphthongs
    "aɪ": ["aj", "ai"], "aʊ": ["au"], "eɪ": ["ej", "e"], "oʊ": ["o"], "əʊ": ["oʊ", "o"], "ɔɪ": ["oj", "oi"],
    "eə": ["ɛə", "ɛ", "e"], "ɪə": ["iə", "ia"], "ʊə": ["ua"],
    "ɚ": ["əɹ", "ɛr", "a"], "ɝ": ["ɜː", "ɵr", "ɛr", "a"],
    "æ": ["ɛ", "e", "a"], "ɐ": ["ʌ", "a"], "ʌ": ["a"], "ə": ["ʌ", "a"], "ɜ": ["ɵ", "ə", "e"], "ɑ": ["a"],
    "ɒ": ["ɔ", "o"], "ɔ": ["o"], "ɪ": ["i"], "ᵻ": ["ɪ", "i"], "ʊ": ["u"], "ɛ": ["e"], "e": ["eɪ", "ɛ"], "o": ["oʊ", "ɔ"],
    "y": ["ju", "u", "i"], "ø": ["ɜ", "e"], "ɵ": ["ʊ", "o"], "ɨ": ["ɪ", "i"], "ɤ": ["ə", "ʌ", "a"], "ɯ": ["u"], "œ": ["ɜ", "e"],
    "ɥ": ["j", "w"], "ɻ": ["ɚ", "ɹ", "r"],
    # consonants
    "θ": ["s", "t"], "ð": ["z", "d"], "w": ["v", "u"], "ɹ": ["r", "ɾ"], "r": ["ɹ", "ɾ"], "ɾ": ["t", "ɹ", "r"],
    "h": ["x", "ɦ"], "x": ["h", "k"], "χ": ["x", "h"], "ħ": ["h", "x"], "ɦ": ["h", "x"], "ɣ": ["ɡ"], "β": ["b", "v"],
    "ŋ": ["nɡ", "n"], "ɲ": ["nj", "n"], "ʎ": ["lj", "l"], "l": ["ɭ"], "ɫ": ["l", "ɭ"], "ɭ": ["l"], "ɮ": ["l", "ɭ"],
    "ɕ": ["ʃ"], "ʑ": ["ʒ"], "ʂ": ["ʃ"], "ʐ": ["ʒ"], "ʨ": ["tɕ", "tʃ"], "ʥ": ["dʑ", "dʒ"], "ʦ": ["ts"], "ʣ": ["dz"],
    "ɟ": ["dʒ", "dj"], "c": ["tʃ", "k"], "q": ["k"], "ɸ": ["f"], "ɴ": ["n"], "ç": ["h", "x"], "ʁ": ["r", "ɹ"], "ʀ": ["r", "ɹ"],
    "dʒ": ["dʒ"], "tʃ": ["tʃ"], "ts": ["ts"], "tɕ": ["tʃ"], "dʑ": ["dʒ"],
    "ʰ": [""], "ʔ": [""], "ʕ": [""], "ʲ": ["j", ""], "ː": [""], "ʼ": [""],
}
# Two-letter sounds, tried before single letters.
CLUSTERS = sorted((k for k in set(FALLBACK) | {s for inv in INVENTORY.values() for s in inv} if len(k) > 1), key=len, reverse=True)
ALWAYS = set(" ˈˌ.,!?;:'\"-—–…()")
VOWEL_CHARS = set("aeiouyɐɑɒɔəɚɛɜɪʊʌæᵻøɵɨɤɯœ")


def fit(ipa: str, target: str, overrides: dict | None = None) -> str:
    """Rewrite IPA with only the sounds of `target` (a key of INVENTORY), using
    `overrides` first (an accent's own choices, e.g. Kenyan "ə" -> "a") and then FALLBACK."""
    inv = INVENTORY[target]
    overrides = overrides or {}
    ipa = unicodedata.normalize("NFD", ipa)
    ipa = "".join(c for c in ipa if not unicodedata.combining(c) or c in inv)  # nasal tildes, syllabic marks...
    out = []
    i = 0
    while i < len(ipa):
        unit = next((c for c in CLUSTERS if ipa.startswith(c, i)), ipa[i])
        i += len(unit)
        if unit in overrides:
            out.append(overrides[unit])
        elif unit in ALWAYS or unit in inv:
            out.append(unit)
        elif len(unit) > 1 and unit not in FALLBACK:
            i -= len(unit) - 1  # a cluster this target knows only letter by letter: go on with its first letter
            out.append(fit_one(unit[0], inv))
        else:
            out.append(fit_one(unit, inv))
    return re.sub(r"(r|ɹ)\1+", r"\1", "".join(out))


def fit_one(unit: str, inv: set) -> str:
    for option in FALLBACK.get(unit, []):
        if option == "" or option in inv or all(c in inv for c in option):
            return option
        # One step further: "æ" -> "ɛ" -> "e" for a target without "ɛ".
        deeper = FALLBACK.get(option, [])
        for o2 in deeper:
            if o2 == "" or o2 in inv or all(c in inv for c in o2):
                return o2
    return ""


def devoice_finals(ipa: str) -> str:
    """Voiced consonants at the end of a word turn voiceless, as in Russian: "dog" -> "dok"."""
    pairs = {"b": "p", "d": "t", "ɡ": "k", "v": "f", "z": "s", "ʒ": "ʃ"}
    return re.sub(r"([bdɡvzʒ])(?=$|[\s.,!?;:])", lambda m: pairs[m.group(1)], ipa)
