// Composition root: creates the real adapters, wires them into the services
// and starts the app. The only module that touches browser globals directly.

import { GameService } from "./application/game-service.js";
import { InputService } from "./application/input-service.js";
import { JOURNEYS } from "./content/journeys.js";
import { BrowserNavigator } from "./infrastructure/browser-navigator.js";
import { GamepadSource, KeyboardSource, PointerSource } from "./infrastructure/button-sources.js";
import { ExtensionVisitLink } from "./infrastructure/extension-visit-link.js";
import { LocalStorageSaves } from "./infrastructure/local-storage-saves.js";
import "./presentation/components/app.js";

export const VERSION = "0.1.0";

const link = new ExtensionVisitLink(window);
const game = new GameService({
  journeys: JOURNEYS,
  saves: new LocalStorageSaves(() => window.localStorage),
  link,
  navigator: new BrowserNavigator(window.location, window.history),
  now: () => Date.now(),
  newId: () => (crypto.randomUUID?.() ?? `g${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`),
});
const input = new InputService({
  sources: [new GamepadSource(window.navigator), new KeyboardSource(window), new PointerSource(document)],
  now: () => performance.now(),
});

// A timer rather than requestAnimationFrame: rAF stops while the YouTube
// iframe has focus in some browsers, and it isn't needed for 60 polls a second.
setInterval(() => input.tick(), 16);

const app = /** @type {import("./presentation/components/app.js").VvApp} */ (document.querySelector("vv-app"));
app.start({ game, link, input, version: VERSION });
