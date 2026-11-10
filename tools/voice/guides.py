"""Who speaks for each guide, and how they say the words of their home town.

Every guide reads English with the accent of their city, in a voice of their
gender, young where there is a choice:

- Kokoro voices of the guide's language read English (Tokyo, Beijing, Rio,
  Bogotá): the voice brings the accent. Maya (New York) is a native American voice, Kemar
  (Kingston) reads espeak's Caribbean English with a young American voice.
- Piper voices trained on real accented English: an L2-ARCTIC speaker whose
  first language is Arabic for Cairo, and VCTK's speaker from Cape Town.
- Piper's Russian voices for Moscow and Ulaanbaatar: English is fitted into
  the sounds of Russian (phonetics.fit), as a learner would say it. Amani
  (Nairobi) gets the same with Swahili sounds, in a Kokoro voice.
- Tama (Hobbiton) is a Kokoro British voice with New Zealand's vowels: the
  short front vowels move one step on ("fish" towards "fush", "bed" towards
  "bid", "cat" towards "ket"), and "air" sounds like "ear".

Words in {braces} are in the guide's language unless listed in `english`; the
`say` table respells them (in Cyrillic for Russian and Mongolian, so espeak
reads them right). Plain-text words with accents (Bogotá, Lǐ Wěi) and the
`names` are also said the local way.
"""

from dataclasses import dataclass, field


@dataclass(frozen=True)
class Kokoro:
    voice: str
    speed: float = 1.0

    def label(self) -> str:
        return f"Kokoro {self.voice}"


@dataclass(frozen=True)
class Piper:
    model: str
    speaker: str | None = None
    length_scale: float | None = None

    def label(self) -> str:
        return f"Piper {self.model}" + (f" ({self.speaker})" if self.speaker else "")


@dataclass(frozen=True)
class Guide:
    engine: Kokoro | Piper
    english: str = "en-us"  # espeak dialect for the English text
    local: str = "en-us"  # how the guide's own words are read: an espeak language, "romaji" or "pinyin"
    target: str | None = None  # phonetics.INVENTORY key: the sounds the voice knows (None: Kokoro knows them all)
    accent: dict = field(default_factory=dict)  # the accent's own choices for English sounds (phonetics.fit overrides)
    devoice: bool = False  # voiceless final consonants (Russian, Mongolian)
    english_words: frozenset = frozenset()  # braced phrases or single words said in English
    say: dict = field(default_factory=dict)  # respellings for the local reader
    names: frozenset = frozenset()  # plain-text words said the local way (beyond those with accents)
    cyrillic: bool = False  # `say` is in Cyrillic: Latin parts of it are English


def words(s: str) -> frozenset:
    return frozenset(s.split("|"))


# Braced words every guide says in English, and how.
ENGLISH_BRACED = {"L + R": "L and R", "G09": "G zero nine", "S2": "S two", "MCC": "M C C", "KICC": "K I C C", "DUMBO": "Dumbo"}

# Russian: English with only Russian sounds; "h" becomes the rougher "kh".
RUSSIAN_ACCENT = {"ɾ": "t", "ŋ": "nɡ", "ə": "ʌ", "ɚ": "ɛr", "ɝ": "ɵr", "ɜ": "ɵ", "æ": "ɛ", "ʊ": "u", "w": "v", "l": "ɭ"}

GUIDES: dict[str, Guide] = {
    # Tokyo: Kokoro's Japanese women read English; Japanese words in romaji.
    "hana": Guide(
        engine=Kokoro("jf_alpha"),
        local="romaji",
        english_words=words("Tokyo Skytree|scramble|Tokyo Metropolitan Government Building|Rainbow Bridge|Odaiba Seaside Park|Fuji TV|Tokyo Tower"),
        say={"Tokyo": "Tōkyō", "Hokkaido": "Hokkaidō", "Shimbashi": "Shinbashi"},
        names=words(
            "Akiba|Akihabara|Akita|Asakusa|Chūō|Daimon|Edo|Fushimi|Fuji|Ginza|Gyōkō-dōri|Hachikō|Hana|Hanzōmon|Harajuku|Kenzō|"
            "Marunouchi|Meiji|Mori|Nemuro|Ochanomizu|Odaiba|Sensō-ji|Shibuya|Shinagawa|Shinjuku|Shinkansen|Solamachi|Sumida|"
            "Takeshita|Tange|Tokugawa|Yamanote|Yotsuya|Yurikamome|Ōtemachi|KITTE|Tokyo|Hokkaido|Shimbashi"
        ),
    ),
    # Beijing: Kokoro's young Chinese man Yunxi reads English; pinyin without its tones.
    "wei": Guide(
        engine=Kokoro("zm_yunxi"),
        local="pinyin",
        english_words=words("Bird's|Nest|Street|Meridian|Gate|Olympic|Park|Peking|duck|Silver|Ingot|Bridge|Temple|of|Heaven|Square|Water|Cube|central|axis"),
        names=words("Wei"),
    ),
    # Bogotá: Kokoro's Spanish woman Dora reads English; Spanish read the Latin American way.
    "vale": Guide(engine=Kokoro("ef_dora"), local="es-419", names=words("Vale|Valentina")),
    # Cairo: L2-ARCTIC speaker ABA, a young man whose first language is Arabic. Arabic in Latin letters
    # reads well with Swahili spelling rules (kh, gh, th, dh).
    "omar": Guide(
        engine=Piper("en_US-l2arctic-medium", "ABA"),
        local="sw",
        target="en",
        english_words=words("Cairo|Tower|Great|Sphinx|Islamic|Nile|Café|Bridge|Square|felucca|pyramids"),
    ),
    # Cape Town: VCTK speaker p314, a woman of 26 from Cape Town. Xhosa read with Swahili rules, Afrikaans with Afrikaans.
    "thandi": Guide(
        engine=Piper("en_GB-vctk-medium", "p314"),
        english="en-gb-x-rp",
        local="sw",
        target="en",
        english_words=words("Boulders|Beach|False|Bay|Kalk|Kalky's|Muizenberg|MyCiTi|Simon's|Town|Table|Mountain|V&A|Waterfront|bobotie"),
        say={"Lekker!": "af:Lekker!", "Bo-Kaap Kombuis": "af:Bo-Kaap Kombuis", "Bo-Kaap": "af:Bo-Kaap", "Kombuis": "af:Kombuis"},
    ),
    # Kingston: espeak's Caribbean English (no "th", non-rhotic) in a young man's voice.
    "kemar": Guide(engine=Kokoro("am_puck"), english="en-029", local="en-029"),
    # Moscow: Piper's Russian woman (Irina); English fitted into Russian sounds.
    "katya": Guide(
        engine=Piper("ru_RU-irina-medium"),
        local="ru",
        target="ru",
        accent=RUSSIAN_ACCENT,
        devoice=True,
        cyrillic=True,
        say={
            "Privet!": "Привет!", "Dobro pozhalovat'!": "Добро пожаловать!", "Dobroye utro!": "Доброе утро!",
            "Do svidaniya!": "До свидания!", "Spokoynoy nochi!": "Спокойной ночи!", "Poyekhali!": "Поехали!",
            "Vkusno!": "Вкусно!", "Molodets": "Молодец", "Molodets!": "Молодец!", "Grustno": "Грустно",
            "krasnaya": "красная", "borshch": "борщ", "kompot": "компот", "pelmeni": "пельмени", "plombir": "пломбир",
            "syrniki": "сырники", "vareniki": "вареники", "Lastochka": "Ласточка", "Sapsan": "Сапсан", "Arbat": "Арбат",
            "GUM": "ГУМ", "Kropotkinskaya": "Кропоткинская", "Ploshchad Revolyutsii": "Площадь Революции",
            "Vorobyovy Gory": "Воробьёвы горы", "Moskva-City": "Москва-Сити", "Varenichnaya No. 1": "Вареничная номер один",
            "VDNKh": "вэдээнха", "Neskuchny Garden": "Нескучный Garden", "Café Pushkin": "Café Пушкин",
            "Zaryadye Park": "Зарядье Park", "Patriarshy Bridge": "Патриарший Bridge", "Dr. Zhivago": "Doctor Живаго",
            "Smolensky metro bridge": "Смоленский metro bridge", "Gorky Park": "Горький Park",
            "Katya": "Катя", "Moskva": "Москва", "Volkova": "Волкова",
        },
        english_words=words(
            "Cathedral of Christ the Saviour|Friendship of Nations|Kremlin|Red Square|Resurrection Gate|Sparrow Hills|St Basil's Cathedral|Worker and Kolkhoz Woman"
        ),
        names=words("Katya|Moskva|Volkova"),
    ),
    # Ulaanbaatar: Piper's Russian man Denis (no Mongolian voice exists); Mongolian words read by espeak's
    # Mongolian, English fitted into the same sounds.
    "bat": Guide(
        engine=Piper("ru_RU-denis-medium"),
        english="en-us",
        local="mn",
        target="ru",
        accent=RUSSIAN_ACCENT | {"h": "x"},
        devoice=True,
        cyrillic=True,
        say={
            "Bayarlalaa": "Баярлалаа", "Bayarlalaa!": "Баярлалаа!", "Bayartai": "Баяртай", "Bayartai!": "Баяртай!",
            "Bogd Khan Uul": "Богд Хан Уул", "Chinggis Khaan": "Чингис Хаан", "Choijin Lama": "Чойжин лам",
            "Enkh Taivny Örgön Chölöö": "Энх тайвны өргөн чөлөө", "Gobi": "Говь", "Gorkhi-Terelj National Park": "Горхи-Тэрэлж National Park",
            "Melkhii Khad": "Мэлхий хад", "Sain amraarai!": "Сайн амраарай!", "Sain baina uu!": "Сайн байна уу!",
            "Sükhbaatar Square": "Сүхбаатар Square", "Tavtai morilno uu!": "Тавтай морилно уу!", "Tsam": "Цам", "Yavya!": "Явъя!",
            "Zaisan": "Зайсан", "buuz": "бууз", "ger": "гэр", "khuushuur": "хуушуур", "morin khuur": "морин хуур",
            "suutei tsai": "сүүтэй цай", "Öglöönii mend!": "Өглөөний мэнд!",
            "Batbayar": "Батбаяр", "Dorj": "Дорж", "Ulaanbaatar": "Улаанбаатар", "Sükhbaatar": "Сүхбаатар", "Chinggis": "Чингис",
            "Terelj": "Тэрэлж", "Bat": "Бат",
        },
        english_words=words("Modern Nomads"),
        names=words("Batbayar|Dorj|Ulaanbaatar|Sükhbaatar|Chinggis|Terelj|Bat"),
    ),
    # Nairobi: Kokoro's young British woman Emma (Piper's only Swahili voice is a man), with English and
    # Swahili fitted into Swahili's sounds: five vowels, non-rhotic, "ng" with a g.
    "amani": Guide(
        engine=Kokoro("bf_emma"),
        english="en-gb-x-rp",
        local="sw",
        target="sw",
        accent={"ə": "a", "ɐ": "a", "ʌ": "a", "æ": "a", "ɜ": "a", "ɪ": "i", "ʊ": "u", "ɒ": "o", "ɔ": "o", "əʊ": "o", "eɪ": "e", "eə": "ea", "ŋ": "nɡ", "ɹ": "r"},
        english_words=words("Carnivore|Expressway|Giraffe|Centre|Ivory|Burning|Site|National|Park|Railway|Museum|Thorn|Tree|Café|Karen"),
    ),
    # Hobbiton: Kokoro's young British man Fable (there is no New Zealand voice), non-rhotic as in New
    # Zealand, with the New Zealand vowel shift: KIT is central, DRESS and TRAP are raised, SQUARE merges
    # into NEAR. Māori words are read by espeak's Māori.
    "tama": Guide(
        engine=Kokoro("bm_fable"),
        english="en-gb",
        local="mi",
        target="en",
        accent={"ɪ": "ə", "ᵻ": "ə", "ɛ": "e", "a": "ɛ", "æ": "ɛ", "eə": "iə"},
        english_words=words("Hobbiton|Alexander|The Shire's Rest|Gandalf's Cutting|Bagshot Row|Bag End|Party Field|Party Tree|Mill|Green Dragon"),
        names=words("Tama|Matamata|Waikato|Kaimai|Aotearoa"),
    ),
    # New York: Kokoro's American woman Heart.
    "maya": Guide(engine=Kokoro("af_heart")),
    # Rio: Kokoro's Brazilian man reads English.
    "thiago": Guide(engine=Kokoro("pm_alex"), local="pt-br"),
}
