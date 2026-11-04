// The game's controls, named after an SNES pad. Every input device is turned
// into the set of these buttons it holds down; the input service makes actions
// out of the changes.

export const Button = Object.freeze({
  UP: "up",
  DOWN: "down",
  LEFT: "left",
  RIGHT: "right",
  A: "a", // right face button: confirm, next bubble
  B: "b", // bottom: back
  X: "x", // top: sound on / off
  Y: "y", // left: secondary (delete a save, show the map)
  L: "l",
  R: "r",
  START: "start", // skip the train ride / pause
  SELECT: "select", // pause menu
});

/** Action fired when both shoulder buttons go down together: finish the stop. */
export const FINISH = "finish";

/** Buttons that repeat while held (menu navigation). */
export const REPEATING = Object.freeze(new Set([Button.UP, Button.DOWN, Button.LEFT, Button.RIGHT]));

/**
 * What changed between two snapshots of held buttons: the buttons that went
 * down, plus FINISH when L and R are both down now but weren't before.
 * @param {ReadonlySet<string>} before @param {ReadonlySet<string>} now @returns {string[]}
 */
export function pressedBetween(before, now) {
  const out = [...now].filter((b) => !before.has(b));
  const chord = (/** @type {ReadonlySet<string>} */ s) => s.has(Button.L) && s.has(Button.R);
  if (chord(now) && !chord(before)) out.push(FINISH);
  return out;
}
