// Gamepad controls: which pad input means which SNES button. A binding is a
// pad button or an axis direction; each input belongs to one button only.
// No custom map means "automatic": Chrome's standard mapping, or the usual
// layout of USB SNES replicas (see infrastructure/button-sources.js).

import { Button } from "./input.js";

/** @typedef {{ type: "button", index: number } | { type: "axis", index: number, dir: 1 | -1 }} Binding */
/** @typedef {Partial<Record<string, Binding | null>>} ControlMapData  SNES button -> binding (null: unassigned) */

/** The order controls are listed and set up in. */
export const CONTROL_ORDER = Object.freeze([
  Button.UP,
  Button.DOWN,
  Button.LEFT,
  Button.RIGHT,
  Button.A,
  Button.B,
  Button.X,
  Button.Y,
  Button.L,
  Button.R,
  Button.START,
  Button.SELECT,
]);

/** What each button is called and does in the game. */
export const CONTROL_INFO = Object.freeze({
  [Button.UP]: { name: "D-pad ↑", does: "Choose; in a ride: play faster" },
  [Button.DOWN]: { name: "D-pad ↓", does: "Choose; in a ride: play slower" },
  [Button.LEFT]: { name: "D-pad ←", does: "Choose; in a ride: 30 s back" },
  [Button.RIGHT]: { name: "D-pad →", does: "Choose; in a ride: 30 s forward" },
  [Button.A]: { name: "A", does: "OK, next bubble" },
  [Button.B]: { name: "B", does: "Back" },
  [Button.X]: { name: "X", does: "Sound on / off (ride), music (menus)" },
  [Button.Y]: { name: "Y", does: "Map, delete a save" },
  [Button.L]: { name: "L", does: "With R: finish the stop" },
  [Button.R]: { name: "R", does: "With L: finish the stop" },
  [Button.START]: { name: "Start", does: "Skip the ride" },
  [Button.SELECT]: { name: "Select", does: "Pause" },
});

/** Chrome's standard mapping, by position as on an Xbox pad (= SNES positions). */
export const STANDARD_MAP = Object.freeze({
  [Button.UP]: { type: "button", index: 12 },
  [Button.DOWN]: { type: "button", index: 13 },
  [Button.LEFT]: { type: "button", index: 14 },
  [Button.RIGHT]: { type: "button", index: 15 },
  [Button.A]: { type: "button", index: 1 },
  [Button.B]: { type: "button", index: 0 },
  [Button.X]: { type: "button", index: 3 },
  [Button.Y]: { type: "button", index: 2 },
  [Button.L]: { type: "button", index: 4 },
  [Button.R]: { type: "button", index: 5 },
  [Button.START]: { type: "button", index: 9 },
  [Button.SELECT]: { type: "button", index: 8 },
});

/** USB SNES replicas without a standard mapping: D-pad on axes 0/1, buttons X A B Y L R … Select Start. */
export const SNES_USB_MAP = Object.freeze({
  [Button.UP]: { type: "axis", index: 1, dir: -1 },
  [Button.DOWN]: { type: "axis", index: 1, dir: 1 },
  [Button.LEFT]: { type: "axis", index: 0, dir: -1 },
  [Button.RIGHT]: { type: "axis", index: 0, dir: 1 },
  [Button.A]: { type: "button", index: 1 },
  [Button.B]: { type: "button", index: 2 },
  [Button.X]: { type: "button", index: 0 },
  [Button.Y]: { type: "button", index: 3 },
  [Button.L]: { type: "button", index: 4 },
  [Button.R]: { type: "button", index: 5 },
  [Button.START]: { type: "button", index: 9 },
  [Button.SELECT]: { type: "button", index: 8 },
});

/** The automatic layout for a pad's mapping. @param {string | undefined} mapping @returns {ControlMapData} */
export const automaticMap = (mapping) => /** @type {ControlMapData} */ (mapping === "standard" || mapping == null ? STANDARD_MAP : SNES_USB_MAP);

export const AXIS_THRESHOLD = 0.5;

/** @param {Binding | null | undefined} a @param {Binding | null | undefined} b */
export const sameBinding = (a, b) =>
  !!a && !!b && a.type === b.type && a.index === b.index && (a.type !== "axis" || a.dir === /** @type {any} */ (b).dir);

/** "Button 3", "Axis 1 −", or "—" for nothing. @param {Binding | null | undefined} b */
export function describeBinding(b) {
  if (!b) return "—";
  return b.type === "button" ? `Button ${b.index}` : `Axis ${b.index} ${b.dir > 0 ? "+" : "−"}`;
}

/** @typedef {{ buttons: readonly { pressed: boolean, value?: number }[], axes: readonly number[] }} PadState */

/** @param {Binding} b @param {PadState} pad */
export function isBindingActive(b, pad) {
  if (b.type === "button") {
    const btn = pad.buttons[b.index];
    return !!btn && (btn.pressed || (btn.value ?? 0) > AXIS_THRESHOLD);
  }
  const v = pad.axes[b.index] ?? 0;
  return b.dir > 0 ? v > AXIS_THRESHOLD : v < -AXIS_THRESHOLD;
}

/** A complete, checked map from stored data (unknown keys and bad bindings dropped). @param {unknown} data @returns {ControlMapData | null} */
export function normalizeMap(data) {
  if (!data || typeof data !== "object") return null;
  /** @type {ControlMapData} */
  const out = {};
  for (const button of CONTROL_ORDER) {
    const b = /** @type {any} */ (data)[button];
    const ok =
      b &&
      Number.isInteger(b.index) &&
      b.index >= 0 &&
      (b.type === "button" || (b.type === "axis" && (b.dir === 1 || b.dir === -1)));
    out[button] = ok ? (b.type === "button" ? { type: "button", index: b.index } : { type: "axis", index: b.index, dir: b.dir }) : null;
  }
  return out;
}

/**
 * Assign a binding to a button. Starting from the automatic layout when there
 * is no custom map yet; any other button that had the same input loses it.
 * @param {ControlMapData | null} map @param {string} button @param {Binding} binding
 * @param {ControlMapData} [base] the automatic layout to start from @returns {ControlMapData}
 */
export function assign(map, button, binding, base = STANDARD_MAP) {
  const out = { ...(map ?? base) };
  for (const k of CONTROL_ORDER) if (sameBinding(out[k], binding)) out[k] = null;
  out[button] = binding;
  return out;
}

/** Buttons without any binding, which the pad can't press. @param {ControlMapData | null} map */
export const unassigned = (map) => (map ? CONTROL_ORDER.filter((b) => !map[b]) : []);

/**
 * The input that went down between a resting snapshot and now: a button
 * newly pressed, or an axis moved past halfway from where it rested.
 * @param {PadState} rest @param {PadState} now @returns {Binding | null}
 */
export function newInput(rest, now) {
  for (let i = 0; i < now.buttons.length; i++) {
    const was = rest.buttons[i];
    const btn = now.buttons[i];
    const down = btn.pressed || (btn.value ?? 0) > AXIS_THRESHOLD;
    const wasDown = !!was && (was.pressed || (was.value ?? 0) > AXIS_THRESHOLD);
    if (down && !wasDown) return { type: "button", index: i };
  }
  for (let i = 0; i < now.axes.length; i++) {
    const d = now.axes[i] - (rest.axes[i] ?? 0);
    if (Math.abs(d) > AXIS_THRESHOLD && Math.abs(now.axes[i]) > AXIS_THRESHOLD) return { type: "axis", index: i, dir: d > 0 ? 1 : -1 };
  }
  return null;
}
