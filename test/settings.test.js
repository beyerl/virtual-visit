import { test } from "node:test";
import assert from "node:assert/strict";
import { SettingsService } from "../src/application/settings-service.js";
import {
  actionBinding,
  assignAction,
  defaultSettings,
  describeActionBinding,
  normalizeSettings,
  PRESETS,
  presetOf,
} from "../src/domain/settings.js";

function setup(stored = null, time = 1000) {
  const store = {
    data: stored,
    load() {
      return this.data;
    },
    save(d) {
      this.data = d;
    },
  };
  const link = {
    pushed: [],
    detected: 0,
    onSettings(fn) {
      this.fromExtension = fn;
    },
    detect() {
      this.detected++;
    },
    pushSettings(settings, updatedAt) {
      this.pushed.push({ settings, updatedAt });
    },
  };
  const deferred = [];
  const service = new SettingsService({ store, link, now: () => time, defer: (fn) => deferred.push(fn) });
  service.connect();
  return { service, store, link, flush: () => deferred.splice(0).forEach((fn) => fn()) };
}

test("settings: invalid values fall back to the defaults, valid ones stay", () => {
  const s = normalizeSettings({
    lookSpeedX: 1000,
    lookSpeedY: 99999,
    volume: "loud",
    soundEnabled: false,
    logLevel: "shout",
    buttonMap: { forward: 7, back: "a1+", zoomIn: "bad", mode: null, hacked: 1 },
  });
  assert.equal(s.lookSpeedX, 1000);
  assert.equal(s.lookSpeedY, defaultSettings().lookSpeedY);
  assert.equal(s.volume, defaultSettings().volume);
  assert.equal(s.soundEnabled, false);
  assert.equal(s.logLevel, "info");
  assert.equal(s.buttonMap.forward, 7);
  assert.equal(s.buttonMap.back, "a1+");
  assert.equal(s.buttonMap.zoomIn, defaultSettings().buttonMap.zoomIn);
  assert.equal(s.buttonMap.mode, null);
  assert.equal("hacked" in s.buttonMap, false);
});

test("settings: presets are recognised and a changed map is custom", () => {
  assert.equal(presetOf(defaultSettings().buttonMap)?.id, "xbox");
  const snes = PRESETS[1];
  assert.equal(presetOf({ ...snes.map })?.id, "snes");
  assert.equal(presetOf(assignAction(defaultSettings().buttonMap, "forward", 11)), null);
});

test("settings: bindings convert to the extension's form and each input has one action", () => {
  assert.equal(actionBinding({ type: "button", index: 3 }), 3);
  assert.equal(actionBinding({ type: "axis", index: 1, dir: -1 }), "a1-");
  assert.equal(describeActionBinding(3), "Button 3");
  assert.equal(describeActionBinding("a1+"), "Axis 1 +");
  assert.equal(describeActionBinding("a9=-1.00"), "Axis 9 = -1.00");
  assert.equal(describeActionBinding(null), "—");
  const map = assignAction({ forward: 4, back: 0 }, "back", 4);
  assert.deepEqual(map, { forward: null, back: 4 });
});

test("settings sync: the first run takes over the extension's settings, even unstamped", () => {
  const { service, store, link } = setup();
  assert.equal(link.detected, 1);
  link.fromExtension({ settings: { lookSpeedX: 1500 }, updatedAt: 0 });
  assert.equal(service.values.lookSpeedX, 1500);
  assert.equal(store.data.settings.lookSpeedX, 1500);
  assert.equal(link.pushed.length, 0);
});

test("settings sync: a change here is saved, stamped and told to the extension once", () => {
  const { service, store, link, flush } = setup();
  let changes = 0;
  service.onChange = () => changes++;
  service.change({ volume: 10 });
  service.change({ volume: 15 });
  assert.equal(store.data.settings.volume, 15);
  assert.equal(store.data.updatedAt, 1001, "stamps always increase");
  assert.equal(changes, 2);
  flush();
  assert.equal(link.pushed.length, 1);
  assert.equal(link.pushed[0].settings.volume, 15);
  assert.equal(link.pushed[0].updatedAt, 1001);
});

test("settings sync: the newer side wins, and an echo changes nothing", () => {
  const { service, link, flush } = setup({ settings: { volume: 20 }, updatedAt: 500 });
  link.fromExtension({ settings: { volume: 30 }, updatedAt: 400 });
  assert.equal(service.values.volume, 20, "older than localStorage");
  flush();
  assert.equal(link.pushed.length, 1, "so the extension gets ours");

  link.fromExtension({ settings: { volume: 20 }, updatedAt: 500 });
  flush();
  assert.equal(link.pushed.length, 1, "the same stamp is an echo");

  link.fromExtension({ settings: { volume: 40 }, updatedAt: 600 });
  assert.equal(service.values.volume, 40, "changed in the popup while the game was closed");
  assert.equal(service.updatedAt, 600);
});

test("settings: presets and reset replace the map", () => {
  const { service } = setup();
  service.applyPreset("snes");
  assert.equal(presetOf(service.values.buttonMap)?.id, "snes");
  service.assign("forward", 11);
  assert.equal(presetOf(service.values.buttonMap), null);
  service.reset();
  assert.deepEqual(service.values, defaultSettings());
});
