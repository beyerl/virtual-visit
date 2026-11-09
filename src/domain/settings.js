// The settings shared with the Street View Gamepad extension (src/domain/settings.js and
// actions.js there hold the same list). The game stores them; see application/settings-service.js.

/** @typedef {number | string | null} ActionBinding  a button index, "a1+" / "a1-" (axis direction), "a9=-1.00" (hat position), or unassigned */
/**
 * @typedef {{ lookSpeedX: number, lookSpeedY: number, soundEnabled: boolean, masterVolume: number,
 *             volume: number, commentaryVolume: number, logLevel: string,
 *             buttonMap: Record<string, ActionBinding> }} Settings
 */

/** What the settings menu lists, in order. `step` is one press of ← / →.
 * @type {readonly ({ key: "lookSpeedX" | "lookSpeedY" | "masterVolume" | "volume" | "commentaryVolume", label: string, type: "range", min: number, max: number, step: number }
 *   | { key: "soundEnabled", label: string, type: "toggle" }
 *   | { key: "logLevel", label: string, type: "select", options: readonly { value: string, label: string }[] })[]} */
export const SETTING_DEFS = Object.freeze([
  { key: "lookSpeedX", label: "Look speed, horizontal", type: "range", min: 100, max: 2400, step: 100 },
  { key: "lookSpeedY", label: "Look speed, vertical", type: "range", min: 100, max: 2400, step: 100 },
  { key: "soundEnabled", label: "Ambient sound from nearby recordings", type: "toggle" },
  { key: "masterVolume", label: "Master volume", type: "range", min: 0, max: 100, step: 5 },
  { key: "volume", label: "Soundscape volume", type: "range", min: 0, max: 100, step: 5 },
  { key: "commentaryVolume", label: "Commentary volume", type: "range", min: 0, max: 100, step: 5 },
  {
    key: "logLevel",
    label: "Console log level",
    type: "select",
    options: [
      { value: "off", label: "Off" },
      { value: "info", label: "Info" },
      { value: "debug", label: "Debug" },
    ],
  },
]);

/** What can be assigned to a pad input in Street View, in the extension's order. */
export const STREET_VIEW_ACTIONS = Object.freeze([
  { id: "forward", label: "Walk forward / pan north" },
  { id: "back", label: "Walk backward / pan south" },
  { id: "strafeLeft", label: "Step left" },
  { id: "strafeRight", label: "Step right" },
  { id: "lookUp", label: "Look up" },
  { id: "lookDown", label: "Look down" },
  { id: "lookLeft", label: "Look left / pan left" },
  { id: "lookRight", label: "Look right / pan right" },
  { id: "zoomIn", label: "Zoom in" },
  { id: "zoomOut", label: "Zoom out" },
  { id: "mode", label: "Select mode" },
  { id: "mode1", label: "Mode button 1" },
  { id: "mode2", label: "Mode button 2" },
  { id: "mode3", label: "Mode button 3" },
]);

const XBOX = Object.freeze({
  forward: 4,
  back: 0,
  strafeLeft: 3,
  strafeRight: 1,
  lookUp: "a1-",
  lookDown: "a1+",
  lookLeft: "a0-",
  lookRight: "a0+",
  zoomIn: 6,
  zoomOut: 7,
  mode: 14,
  mode1: 12,
  mode2: 15,
  mode3: 13,
});

const SNES = Object.freeze({
  forward: 3,
  back: 0,
  strafeLeft: null,
  strafeRight: null,
  lookUp: 12,
  lookDown: 13,
  lookLeft: 14,
  lookRight: 15,
  zoomIn: 2,
  zoomOut: 1,
  mode: 8,
  mode1: 9,
  mode2: 4,
  mode3: 5,
});

/** @type {readonly { id: string, label: string, image: string, map: Readonly<Record<string, ActionBinding>> }[]} */
export const PRESETS = Object.freeze([
  { id: "xbox", label: "Xbox Classic", image: "images/controllers/xbox-classic.svg", map: XBOX },
  { id: "snes", label: "SNES", image: "images/controllers/snes.svg", map: SNES },
]);

export const NEUTRAL_PAD_IMAGE = "images/controllers/neutral.svg";

/** @returns {Settings} */
export const defaultSettings = () => ({
  lookSpeedX: 720,
  lookSpeedY: 480,
  soundEnabled: true,
  masterVolume: 100,
  volume: 50,
  commentaryVolume: 100,
  logLevel: "info",
  buttonMap: { ...XBOX },
});

const BINDING = /^a\d+(?:[+-]|=-?\d+(?:\.\d+)?)$/;

/** @param {unknown} b @returns {b is ActionBinding} */
const isBinding = (b) => b === null || (Number.isInteger(b) && /** @type {number} */ (b) >= 0) || (typeof b === "string" && BINDING.test(b));

/** Stored or received data, completed with the defaults; anything invalid is dropped. @param {any} data @returns {Settings} */
export function normalizeSettings(data) {
  const out = defaultSettings();
  if (!data || typeof data !== "object") return out;
  for (const def of SETTING_DEFS) {
    const v = data[def.key];
    if (def.type === "range" && typeof v === "number" && v >= def.min && v <= def.max) out[def.key] = v;
    else if (def.type === "toggle" && typeof v === "boolean") out[def.key] = v;
    else if (def.type === "select" && def.options.some((o) => o.value === v)) out[def.key] = v;
  }
  for (const { id } of STREET_VIEW_ACTIONS) if (isBinding(data.buttonMap?.[id])) out.buttonMap[id] = data.buttonMap[id];
  return out;
}

/** The preset a map is exactly, or null for a custom one. @param {Record<string, ActionBinding>} map */
export const presetOf = (map) => PRESETS.find((p) => STREET_VIEW_ACTIONS.every((a) => map[a.id] === p.map[a.id])) ?? null;

/** The extension's form of a captured input. @param {import("./controls.js").Binding} b @returns {ActionBinding} */
export const actionBinding = (b) => (b.type === "button" ? b.index : `a${b.index}${b.dir > 0 ? "+" : "-"}`);

/** "Button 3", "Axis 1 +", "Axis 9 = -1.00", or "—" for nothing. @param {ActionBinding} b */
export function describeActionBinding(b) {
  if (b === null) return "—";
  if (typeof b === "number") return `Button ${b}`;
  const [, axis, rest] = /** @type {RegExpMatchArray} */ (b.match(/^a(\d+)(.*)$/));
  return `Axis ${axis} ${rest.startsWith("=") ? `= ${rest.slice(1)}` : rest}`;
}

/** Assign an input to an action; any other action with that input loses it.
 * @param {Record<string, ActionBinding>} map @param {string} action @param {ActionBinding} binding */
export function assignAction(map, action, binding) {
  const out = { ...map };
  for (const k of Object.keys(out)) if (out[k] === binding) out[k] = null;
  out[action] = binding;
  return out;
}
