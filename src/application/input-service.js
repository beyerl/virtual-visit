// Polls every button source each frame and hands actions (Button values and
// FINISH) to whoever is listening, which is the screen on top. Directions
// repeat while held, so long menus can be scrolled.

import { pressedBetween, REPEATING } from "../domain/input.js";

export const REPEAT_DELAY = 380;
export const REPEAT_INTERVAL = 140;

export class InputService {
  /** @param {{ sources: import("./ports.js").ButtonSource[], now: () => number }} deps */
  constructor({ sources, now }) {
    this.sources = sources;
    this.now = now;
    /** @type {Set<string>} */
    this.before = new Set();
    /** @type {Map<string, number>} held repeating button -> when it fires next */
    this.repeatAt = new Map();
    /** @type {((action: string) => void) | null} */
    this.listener = null;
  }

  /** @param {(action: string) => void} fn */
  listen(fn) {
    this.listener = fn;
  }

  held() {
    const all = new Set();
    for (const s of this.sources) for (const b of s.held()) all.add(b);
    return all;
  }

  tick() {
    const now = this.now();
    const held = this.held();
    const fired = pressedBetween(this.before, held);
    for (const b of fired) if (REPEATING.has(b)) this.repeatAt.set(b, now + REPEAT_DELAY);
    for (const [b, at] of this.repeatAt) {
      if (!held.has(b)) this.repeatAt.delete(b);
      else if (now >= at) {
        fired.push(b);
        this.repeatAt.set(b, now + REPEAT_INTERVAL);
      }
    }
    this.before = held;
    for (const a of fired) this.listener?.(a);
  }
}
