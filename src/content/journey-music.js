// The music of each journey's screens: cozy, playful tracks with a feel of the
// country visited (sources and licences: CREDITS.md; built by tools/music/build.py).

const VOLUME = 0.4; // quiet enough for the guide to speak over it

/** @param {string} journeyId */
const track = (journeyId) => ({ src: `audio/music/${journeyId}.mp3`, volume: VOLUME });

// "Happy Adventure (Loop)" by TinyWorlds, CC0, from OpenGameArt.
export const MENU_TRACK = Object.freeze({ src: "audio/music/happy-adventure.mp3", volume: 0.35, loopStart: 0.042 });

/** @type {Readonly<Record<string, import("../infrastructure/menu-music.js").Track>>} */
export const JOURNEY_MUSIC = Object.freeze(
  Object.fromEntries(
    ["tokyo", "beijing", "moscow", "bogota", "rio", "newyork", "ulaanbaatar", "capetown", "cairo", "nairobi", "kingston", "hobbiton"].map((id) => [
      id,
      track(id),
    ]),
  ),
);
