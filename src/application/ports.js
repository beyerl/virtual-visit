// Interfaces the application layer depends on. Infrastructure implements them;
// tests pass fakes. Plain abstract classes so implementations are easy to spot.

/* eslint-disable no-unused-vars */

export class SaveRepository {
  /** @returns {import("../domain/game-state.js").GameState[]} newest first */
  list() {
    throw new Error("abstract");
  }
  /** @param {string} id @returns {import("../domain/game-state.js").GameState | null} */
  get(id) {
    throw new Error("abstract");
  }
  /** @param {import("../domain/game-state.js").GameState} state */
  save(state) {
    throw new Error("abstract");
  }
  /** @param {string} id */
  remove(id) {
    throw new Error("abstract");
  }
}

/** A source of held buttons (gamepads, keyboard). */
export class ButtonSource {
  /** @returns {Set<string>} the Button values held right now */
  held() {
    throw new Error("abstract");
  }
}

/**
 * The link to the Street View Gamepad extension, which enters Street View for
 * us, reports every move, and brings the player back.
 * @typedef {{ slot: string, returnUrl: string, origin: string, destination: string, resumeUrl?: string,
 *             position?: import("../domain/game-state.js").Position | null, finished?: boolean }} VisitTicket
 */
export class VisitLink {
  /** Resolves once we know whether the extension is there. @returns {Promise<boolean>} */
  async detect() {
    throw new Error("abstract");
  }
  /** The visit the extension holds (from an earlier hand-over), if any. @returns {VisitTicket | null} */
  get pending() {
    throw new Error("abstract");
  }
  /** Hand a visit over before going to Google Maps. @param {VisitTicket} ticket @returns {Promise<void>} */
  async start(ticket) {
    throw new Error("abstract");
  }
  /** Forget the visit (it was taken over by the game). */
  clear() {
    throw new Error("abstract");
  }
  /** @param {(ticket: VisitTicket) => void} fn called when the extension reports a move */
  onUpdate(fn) {
    throw new Error("abstract");
  }
  /** @param {(remote: { settings: unknown, updatedAt: number }) => void} fn called with the extension's settings */
  onSettings(fn) {
    throw new Error("abstract");
  }
  /** Tell the extension the settings. @param {unknown} settings @param {number} updatedAt */
  pushSettings(settings, updatedAt) {
    throw new Error("abstract");
  }
}

export class Navigator {
  /** Leave the game for another page. @param {string} url */
  go(url) {
    throw new Error("abstract");
  }
  /** The game's own URL, to come back to. @param {string} hash */
  ownUrl(hash) {
    throw new Error("abstract");
  }
  /** @returns {string} the hash the game was opened with, without "#" */
  get hash() {
    throw new Error("abstract");
  }
  /** Replace the hash without reloading. @param {string} hash */
  setHash(hash) {
    throw new Error("abstract");
  }
}
