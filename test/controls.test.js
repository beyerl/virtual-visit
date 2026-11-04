import { test } from "node:test";
import assert from "node:assert/strict";
import { ControlsService } from "../src/application/controls-service.js";
import { InputService } from "../src/application/input-service.js";
import {
  assign,
  describeBinding,
  isBindingActive,
  newInput,
  normalizeMap,
  SNES_USB_MAP,
  STANDARD_MAP,
  unassigned,
} from "../src/domain/controls.js";
import { Button } from "../src/domain/input.js";
import { GamepadSource } from "../src/infrastructure/button-sources.js";

/** A pad with these buttons pressed and these axes. */
const pad = (pressed = [], axes = [0, 0], { index = 0, mapping = "standard" } = {}) => ({
  index,
  id: "Pad",
  mapping,
  connected: true,
  buttons: Array.from({ length: 16 }, (_, i) => ({ pressed: pressed.includes(i), value: pressed.includes(i) ? 1 : 0 })),
  axes,
});

const memoryStore = (initial = null) => ({
  data: initial,
  load() {
    return this.data;
  },
  save(d) {
    this.data = d;
  },
});

test("controls: assigning starts from the automatic layout and takes the input away from other buttons", () => {
  const m = assign(null, Button.A, { type: "button", index: 0 });
  assert.deepEqual(m[Button.A], { type: "button", index: 0 });
  assert.equal(m[Button.B], null, "B had button 0 and lost it");
  assert.deepEqual(m[Button.X], STANDARD_MAP[Button.X]);
  assert.deepEqual(unassigned(m), [Button.B]);
  assert.deepEqual(unassigned(null), []);
  const usb = assign(null, Button.A, { type: "button", index: 7 }, SNES_USB_MAP);
  assert.deepEqual(usb[Button.UP], { type: "axis", index: 1, dir: -1 });
});

test("controls: describing, matching and checking stored bindings", () => {
  assert.equal(describeBinding({ type: "button", index: 3 }), "Button 3");
  assert.equal(describeBinding({ type: "axis", index: 1, dir: -1 }), "Axis 1 −");
  assert.equal(describeBinding(null), "—");
  assert.equal(isBindingActive({ type: "button", index: 2 }, pad([2])), true);
  assert.equal(isBindingActive({ type: "axis", index: 0, dir: 1 }, pad([], [0.9, 0])), true);
  assert.equal(isBindingActive({ type: "axis", index: 0, dir: -1 }, pad([], [0.9, 0])), false);
  const n = normalizeMap({ a: { type: "button", index: 4 }, b: { type: "axis", index: 1, dir: 3 }, bogus: 1 });
  assert.deepEqual(n.a, { type: "button", index: 4 });
  assert.equal(n.b, null);
  assert.equal("bogus" in n, false);
  assert.equal(normalizeMap("x"), null);
});

test("controls: a new input is a newly pressed button, or an axis moved past halfway from rest", () => {
  assert.deepEqual(newInput(pad([1]), pad([1, 5])), { type: "button", index: 5 });
  assert.equal(newInput(pad([1]), pad([1])), null);
  assert.deepEqual(newInput(pad([], [0, 0]), pad([], [0, -1])), { type: "axis", index: 1, dir: -1 });
  // A trigger resting at −1 counts when pressed, not while resting.
  assert.equal(newInput(pad([], [-1]), pad([], [-1])), null);
  assert.deepEqual(newInput(pad([], [-1]), pad([], [1])), { type: "axis", index: 0, dir: 1 });
});

test("controls service: captures the next input; a button held at the start counts after release; saved", () => {
  let pads = [pad([1])];
  const store = memoryStore();
  const svc = new ControlsService({ store, pads: () => pads });
  const got = [];
  svc.startCapture((b) => got.push(b));
  svc.poll();
  assert.equal(got.length, 0, "A was already down");
  pads = [pad([])];
  svc.poll();
  pads = [pad([1])];
  svc.poll();
  assert.deepEqual(got, [{ type: "button", index: 1 }]);
  assert.equal(svc.capturing, false);
  svc.assign(Button.START, { type: "button", index: 11 });
  assert.deepEqual(store.data[Button.START], { type: "button", index: 11 });
  assert.equal(new ControlsService({ store, pads: () => [] }).map[Button.START].index, 11);
  svc.reset();
  assert.equal(store.data, null);
  assert.equal(svc.automatic, true);
});

test("input service: while capturing, presses go to the capture and not to the screen", () => {
  let pads = [pad([])];
  const controls = new ControlsService({ store: memoryStore(), pads: () => pads });
  const gamepads = new GamepadSource({ getGamepads: () => pads }, () => controls.map);
  const input = new InputService({ sources: [gamepads], now: () => 0, controls });
  const fired = [];
  input.listen((a) => fired.push(a));
  controls.startCapture((b) => controls.assign(Button.A, b));
  pads = [pad([7])];
  input.tick();
  assert.deepEqual(fired, []);
  assert.deepEqual(controls.map[Button.A], { type: "button", index: 7 });
  input.tick(); // still held: no action
  pads = [pad([])];
  input.tick();
  pads = [pad([7])];
  input.tick();
  assert.deepEqual(fired, [Button.A]);
});

test("gamepad source: the custom map replaces the automatic layout", () => {
  const pads = [pad([1, 7])];
  const auto = new GamepadSource({ getGamepads: () => pads });
  assert.deepEqual([...auto.held()].sort(), [Button.A, Button.R]);
  const custom = new GamepadSource({ getGamepads: () => pads }, () => assign(null, Button.START, { type: "button", index: 7 }));
  assert.deepEqual([...custom.held()].sort(), [Button.A, Button.START]);
});
