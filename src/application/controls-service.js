// Setting the gamepad controls: the custom map (saved), and capturing the
// next pad input for a button. While capturing, the input service hands no
// actions to the screens, so the press only sets the control.

import { assign, automaticMap, AXIS_THRESHOLD, newInput, normalizeMap, unassigned } from "../domain/controls.js";

const AXIS_RELEASE = 0.3; // an axis held when capturing started is let go below this

/** @typedef {import("../domain/controls.js").PadState & { index: number }} RawPad */

export class ControlsService {
  /**
   * @param {{ store: { load(): unknown, save(data: unknown): void }, pads: () => (RawPad & { mapping?: string })[] }} deps
   */
  constructor({ store, pads }) {
    this.store = store;
    this.pads = pads;
    /** @type {import("../domain/controls.js").ControlMapData | null} */
    this.map = normalizeMap(store.load());
    /** @type {{ rest: Map<number, import("../domain/controls.js").PadState>, done: (b: import("../domain/controls.js").Binding) => void } | null} */
    this.capture = null;
  }

  get automatic() {
    return !this.map;
  }

  /** The controls in effect: the custom map, or the automatic one of the first pad. */
  get effective() {
    return this.map ?? automaticMap(this.pads()[0]?.mapping);
  }

  /** Buttons the pad can't press with the current map. */
  get missing() {
    return unassigned(this.map);
  }

  /** @param {string} button @param {import("../domain/controls.js").Binding} binding */
  assign(button, binding) {
    this.map = assign(this.map, button, binding, automaticMap(this.pads()[0]?.mapping));
    this.store.save(this.map);
  }

  /** Back to the automatic layout. */
  reset() {
    this.map = null;
    this.store.save(null);
  }

  get capturing() {
    return !!this.capture;
  }

  /** Wait for the next pad input. @param {(b: import("../domain/controls.js").Binding) => void} done */
  startCapture(done) {
    this.capture = { rest: new Map(this.pads().map((p) => [p.index, snapshot(p)])), done };
  }

  cancelCapture() {
    this.capture = null;
  }

  /** Called every frame while capturing. */
  poll() {
    if (!this.capture) return;
    for (const pad of this.pads()) {
      const rest = this.capture.rest.get(pad.index) ?? { buttons: [], axes: pad.axes.map(() => 0) };
      const b = newInput(rest, pad);
      // A button held when capturing started counts once it was let go.
      const now = snapshot(pad);
      rest.buttons = rest.buttons.map((was, i) => (was.pressed && !now.buttons[i]?.pressed ? now.buttons[i] : was));
      rest.axes = rest.axes.map((r, i) => (Math.abs(r) > AXIS_THRESHOLD && Math.abs(now.axes[i] ?? 0) < AXIS_RELEASE ? now.axes[i] : r));
      this.capture.rest.set(pad.index, rest);
      if (b) {
        const { done } = this.capture;
        this.capture = null;
        done(b);
        return;
      }
    }
  }
}

/** @param {import("../domain/controls.js").PadState} pad @returns {import("../domain/controls.js").PadState} */
const snapshot = (pad) => ({
  buttons: pad.buttons.map((b) => ({ pressed: b.pressed, value: b.value ?? 0 })),
  axes: [...pad.axes],
});
