// Gamepads and the keyboard, as sets of held SNES buttons.

import { isBindingActive } from "../domain/controls.js";
import { Button } from "../domain/input.js";
import { ButtonSource } from "../application/ports.js";

/** Chrome's "standard" mapping: buttons by position, as on an Xbox pad. */
const STANDARD = {
  0: Button.B, // bottom
  1: Button.A, // right
  2: Button.Y, // left
  3: Button.X, // top
  4: Button.L,
  5: Button.R,
  6: Button.L, // triggers count as shoulders too
  7: Button.R,
  8: Button.SELECT,
  9: Button.START,
  12: Button.UP,
  13: Button.DOWN,
  14: Button.LEFT,
  15: Button.RIGHT,
};

/** Most USB SNES replicas without a standard mapping (DragonRise and alike):
 * the D-pad is axes 0/1, buttons are X A B Y L R … Select Start. */
const SNES_USB = {
  0: Button.X,
  1: Button.A,
  2: Button.B,
  3: Button.Y,
  4: Button.L,
  5: Button.R,
  8: Button.SELECT,
  9: Button.START,
};

const AXIS = 0.5;

export class GamepadSource extends ButtonSource {
  /**
   * @param {Navigator} navigator
   * @param {() => import("../domain/controls.js").ControlMapData | null} [customMap] the player's controls, if set
   */
  constructor(navigator, customMap = () => null) {
    super();
    this.navigator = navigator;
    this.customMap = customMap;
  }

  /** Connected pads, for setting controls. */
  pads() {
    return [...(this.navigator.getGamepads?.() ?? [])].filter((p) => !!p?.connected).map((p) => /** @type {Gamepad} */ (p));
  }

  held() {
    const out = new Set();
    const custom = this.customMap();
    for (const pad of this.navigator.getGamepads?.() ?? []) {
      if (!pad?.connected) continue;
      if (custom) {
        for (const [button, b] of Object.entries(custom)) if (b && isBindingActive(b, pad)) out.add(button);
        continue;
      }
      const map = pad.mapping === "standard" ? STANDARD : SNES_USB;
      pad.buttons.forEach((b, i) => {
        const name = map[/** @type {keyof typeof map} */ (i)];
        if (name && (b.pressed || b.value > AXIS)) out.add(name);
      });
      const [x = 0, y = 0] = pad.axes;
      if (x < -AXIS) out.add(Button.LEFT);
      if (x > AXIS) out.add(Button.RIGHT);
      if (y < -AXIS) out.add(Button.UP);
      if (y > AXIS) out.add(Button.DOWN);
    }
    return out;
  }

  get connected() {
    return [...(this.navigator.getGamepads?.() ?? [])].some((p) => p?.connected);
  }
}

const KEYS = {
  ArrowUp: Button.UP,
  ArrowDown: Button.DOWN,
  ArrowLeft: Button.LEFT,
  ArrowRight: Button.RIGHT,
  Enter: Button.A,
  " ": Button.A,
  Escape: Button.B,
  Backspace: Button.B,
  x: Button.X,
  m: Button.X,
  y: Button.Y,
  Delete: Button.Y,
  q: Button.L,
  e: Button.R,
  PageUp: Button.L,
  PageDown: Button.R,
  s: Button.START,
  p: Button.SELECT,
  Tab: Button.SELECT,
};

export class KeyboardSource extends ButtonSource {
  /** @param {Window} window */
  constructor(window) {
    super();
    /** @type {Set<string>} */
    this.down = new Set();
    window.addEventListener("keydown", (e) => {
      const b = KEYS[/** @type {keyof typeof KEYS} */ (e.key.length === 1 ? e.key.toLowerCase() : e.key)];
      if (!b || e.altKey || e.ctrlKey || e.metaKey) return;
      e.preventDefault();
      this.down.add(b);
    });
    window.addEventListener("keyup", (e) => {
      const b = KEYS[/** @type {keyof typeof KEYS} */ (e.key.length === 1 ? e.key.toLowerCase() : e.key)];
      if (b) this.down.delete(b);
    });
    window.addEventListener("blur", () => this.down.clear());
  }

  held() {
    return new Set(this.down);
  }
}

/** Clicks and taps on elements with data-button="a" etc. press that button for one frame. */
export class PointerSource extends ButtonSource {
  /** @param {Document} document */
  constructor(document) {
    super();
    /** @type {Set<string>} */
    this.queued = new Set();
    document.addEventListener("click", (e) => {
      const el = /** @type {Element} */ (e.target).closest?.("[data-button]");
      if (el) this.queued.add(/** @type {string} */ (el.getAttribute("data-button")));
    });
  }

  held() {
    const out = this.queued;
    this.queued = new Set();
    return out;
  }
}
