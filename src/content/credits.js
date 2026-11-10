// The credits shown in the game (main menu → Credits): who made the music,
// the voices, the map data, the ride videos, the fonts and every stop photo.
// The same as CREDITS.md, built from the content's own data where it has it.

import { TRACK_TITLES } from "./journey-music.js";

/**
 * @typedef {{ text: string, by?: string, license?: string, url?: string }} CreditEntry  what, by whom, under which licence
 * @typedef {{ title: string, note?: string, entries: CreditEntry[] }} CreditSection
 */

const CC_BY_4 = "CC BY 4.0";

/** Ride videos' channels named in the README (Tokyo); the other rides' channels are behind each video. */
const TOKYO_CHANNELS = [
  ["めんどくさがらないで【サブチャン】", "Yamanote Line"],
  ["PSTLSTS", "Tōkaidō Shinkansen"],
  ["きままトラベル", "Marunouchi Line"],
  ["yoman7206", "Ginza, Asakusa, Hanzōmon lines"],
  ["乗り物車窓ch", "Chūō Line"],
  ["大人のひとり歩き, 日本最大!車窓YouTuber!", "Yurikamome"],
  ["乗り物でどうでしょうチャンネル", "Keihin-Tōhoku Line"],
];

/**
 * @param {readonly { id: string, title: string, steps: readonly unknown[], days: { legs: { stop: { name: string, image?: { file: string, author: string, license: string, page: string } } }[] }[] }[]} journeys
 * @returns {CreditSection[]}
 */
export function creditSections(journeys) {
  const available = journeys.filter((j) => j.steps.length);
  return [
    {
      title: "Music",
      note: "The journeys' tracks were shortened, faded at both ends and normalised in loudness.",
      entries: [
        { text: "Menus: Happy Adventure (Loop)", by: "TinyWorlds", license: "CC0", url: "https://opengameart.org/content/happy-adventure-loop" },
        ...available
          .filter((j) => TRACK_TITLES[j.id])
          .map((j) => ({ text: `${j.title}: ${TRACK_TITLES[j.id]}`, by: "Kevin MacLeod", license: CC_BY_4, url: "https://incompetech.com" })),
      ],
    },
    {
      title: "Guide voices",
      note: "Recorded with local text-to-speech.",
      entries: [
        { text: "Kokoro-82M: Hana, Wei, Valentina, Thiago, Maya, Kemar, Amani, Tama", by: "hexgrad", license: "Apache 2.0", url: "https://huggingface.co/hexgrad/Kokoro-82M" },
        { text: "Piper en_US-l2arctic-medium: Omar", by: "L2-ARCTIC corpus", license: "CC BY-NC 4.0", url: "https://psi.engr.tamu.edu/l2-arctic-corpus/" },
        { text: "Piper en_GB-vctk-medium: Thandi", by: "VCTK corpus, CSTR, University of Edinburgh", license: CC_BY_4, url: "https://datashare.ed.ac.uk/handle/10283/3443" },
        { text: "Piper ru_RU-irina-medium: Katya", by: "RHVoice's Irina voice data", url: "https://github.com/RHVoice/RHVoice" },
        { text: "Piper ru_RU-denis-medium: Batbayar", by: "rhasspy/piper-voices", license: "CC0", url: "https://huggingface.co/rhasspy/piper-voices" },
        { text: "Pronunciations", by: "espeak-ng", url: "https://github.com/espeak-ng/espeak-ng" },
      ],
    },
    {
      title: "Ride videos",
      note: "Window-seat, front-window and dashcam recordings by many YouTube channels, embedded with the YouTube player. Each video names its channel.",
      entries: TOKYO_CHANNELS.map(([by, text]) => ({ text: `Tokyo: ${text}`, by })),
    },
    {
      title: "Maps and Street View",
      entries: [
        { text: "Ride maps: stations and roads", by: "© OpenStreetMap contributors", license: "ODbL", url: "https://www.openstreetmap.org/copyright" },
        { text: "Road routes", by: "OSRM", url: "https://project-osrm.org/" },
        { text: "Street View", by: "Google Maps and its contributors" },
      ],
    },
    {
      title: "Fonts",
      entries: [{ text: "Pixelify Sans, Zen Maru Gothic, Zen Kaku Gothic New", by: "Google Fonts", license: "SIL OFL 1.1", url: "https://fonts.google.com" }],
    },
    ...available.map((j) => ({
      title: `Photos: ${j.title}`,
      note: "From Wikimedia Commons, cropped and scaled.",
      entries: j.days.flatMap((d) =>
        d.legs.filter((l) => l.stop.image).map((l) => {
          const image = /** @type {NonNullable<typeof l.stop.image>} */ (l.stop.image);
          return { text: l.stop.name, by: image.author, license: image.license, url: image.page };
        }),
      ),
    })),
  ];
}
