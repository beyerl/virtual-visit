// Composition root: creates the real adapters, wires them into the services
// and starts the app. The only module that touches browser globals directly.

import { ControlsService } from "./application/controls-service.js";
import { GameService } from "./application/game-service.js";
import { InputService } from "./application/input-service.js";
import { JOURNEYS } from "./content/journeys.js";
import { BrowserNavigator } from "./infrastructure/browser-navigator.js";
import { GamepadSource, KeyboardSource, PointerSource } from "./infrastructure/button-sources.js";
import { ExtensionVisitLink } from "./infrastructure/extension-visit-link.js";
import { LocalStorageSaves } from "./infrastructure/local-storage-saves.js";
import { LocalStorageValue } from "./infrastructure/local-storage-value.js";
import { MenuMusic } from "./infrastructure/menu-music.js";
import "./presentation/components/app.js";

export const VERSION = "0.12.1";

const link = new ExtensionVisitLink(window);
const game = new GameService({
  journeys: JOURNEYS,
  saves: new LocalStorageSaves(() => window.localStorage),
  link,
  navigator: new BrowserNavigator(window.location, window.history),
  now: () => Date.now(),
  newId: () => (crypto.randomUUID?.() ?? `g${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`),
});
const gamepads = new GamepadSource(window.navigator, () => controls.map);
const controls = new ControlsService({
  store: new LocalStorageValue(() => window.localStorage, "virtual-visit.controls.v1"),
  pads: () => gamepads.pads(),
});
const input = new InputService({
  sources: [gamepads, new KeyboardSource(window), new PointerSource(document)],
  now: () => performance.now(),
  controls,
});

// A timer rather than requestAnimationFrame: rAF stops while the YouTube
// iframe has focus in some browsers, and it isn't needed for 60 polls a second.
setInterval(() => input.tick(), 16);

const app = /** @type {import("./presentation/components/app.js").VvApp} */ (document.querySelector("vv-app"));
// "Happy Adventure (Loop)" by TinyWorlds, CC0, from OpenGameArt (see CREDITS.md).
const music = new MenuMusic(
  window,
  { src: "audio/music/happy-adventure.mp3", volume: 0.35, loopStart: 0.042 },
  new LocalStorageValue(() => window.localStorage, "virtual-visit.music.v1"),
);
app.start({ game, link, input, controls, version: VERSION, music });
