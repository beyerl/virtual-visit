import { test } from "node:test";
import assert from "node:assert/strict";
import { GameService } from "../src/application/game-service.js";
import { InputService, REPEAT_DELAY, REPEAT_INTERVAL } from "../src/application/input-service.js";
import { JOURNEYS } from "../src/content/journeys.js";
import { Button, FINISH } from "../src/domain/input.js";
import { StepType } from "../src/domain/journey.js";

class MemorySaves {
  constructor() {
    this.map = new Map();
  }
  list() {
    return [...this.map.values()].sort((a, b) => b.updatedAt - a.updatedAt);
  }
  get(id) {
    return this.map.get(id) ?? null;
  }
  save(s) {
    this.map.set(s.id, s);
  }
  remove(id) {
    this.map.delete(id);
  }
}

function fakeLink({ present = true } = {}) {
  return {
    started: [],
    cleared: 0,
    ticket: null,
    listeners: [],
    async detect() {
      return present;
    },
    get pending() {
      return this.ticket;
    },
    async start(t) {
      this.started.push(t);
    },
    clear() {
      this.cleared++;
      this.ticket = null;
    },
    onUpdate(fn) {
      this.listeners.push(fn);
    },
    emit(t) {
      this.listeners.forEach((fn) => fn(t));
    },
  };
}

function fakeNavigator(hash = "") {
  return {
    hash,
    went: [],
    go(url) {
      this.went.push(url);
    },
    ownUrl(h) {
      return `https://example.org/game/${h ? `#${h}` : ""}`;
    },
    setHash(h) {
      this.hash = h;
    },
  };
}

function setup({ present = true, hash = "" } = {}) {
  let t = 1000;
  const saves = new MemorySaves();
  const link = fakeLink({ present });
  const navigator = fakeNavigator(hash);
  const game = new GameService({ journeys: JOURNEYS, saves, link, navigator, now: () => ++t, newId: () => "g1" });
  return { game, saves, link, navigator };
}

const toFirstVisit = (game) => {
  while (game.step.type !== StepType.VISIT) game.advance();
};

test("new game is saved at once and advances with autosave", () => {
  const { game, saves } = setup();
  game.newGame("tokyo");
  assert.equal(saves.get("g1").stepIndex, 0);
  game.advance();
  assert.equal(saves.get("g1").stepIndex, 1);
  assert.throws(() => game.newGame("paris"), /not available/);
});

test("opening a visit hands it to the extension and goes to the route", async () => {
  const { game, link, navigator } = setup();
  game.newGame("tokyo");
  toFirstVisit(game);
  await game.openVisit();
  assert.equal(link.started.length, 1);
  assert.equal(link.started[0].slot, "g1");
  assert.equal(link.started[0].returnUrl, "https://example.org/game/#visit=g1");
  assert.match(navigator.went[0], /\/maps\/dir\/35\.6812,139\.7649\/35\.6815,139\.7640\//);
  assert.equal(navigator.hash, "visit=g1");
  assert.equal(game.state.visiting, true);
});

test("without the extension, Street View opens with Google's pano URL", async () => {
  const { game, link, navigator } = setup({ present: false });
  game.newGame("tokyo");
  toFirstVisit(game);
  await game.openVisit();
  assert.equal(link.started.length, 0);
  assert.match(navigator.went[0], /map_action=pano/);
});

test("every reported move is saved; resuming opens the last position", async () => {
  const { game, saves, link, navigator } = setup();
  game.newGame("tokyo");
  toFirstVisit(game);
  link.emit({ slot: "g1", position: { lat: 35.1, lng: 139.2, url: "https://www.google.com/maps/@35.1,139.2,3a" } });
  assert.equal(saves.get("g1").position.lat, 35.1);
  link.emit({ slot: "other", position: { lat: 1, lng: 1 } });
  assert.equal(saves.get("g1").position.lat, 35.1);
  await game.openVisit();
  assert.equal(navigator.went[0], "https://www.google.com/maps/@35.1,139.2,3a");
  assert.equal(link.started[0].resumeUrl, "https://www.google.com/maps/@35.1,139.2,3a");
});

test("coming back finished (L + R in Street View) advances past the stop", async () => {
  const { game, saves, link } = setup({ hash: "visit=g1" });
  // A game in the middle of its first visit, as saved before leaving.
  const first = setup();
  first.game.newGame("tokyo");
  toFirstVisit(first.game);
  saves.save(first.game.state.openVisit(5));
  link.ticket = { slot: "g1", finished: true, position: { lat: 2, lng: 3 } };
  const visitIndex = first.game.state.stepIndex;
  assert.equal(await game.returnFromVisit(), "finished");
  assert.equal(game.state.stepIndex, visitIndex + 1);
  assert.equal(game.state.visiting, false);
  assert.equal(link.cleared, 1);
});

test("coming back without finishing keeps the stop and its position", async () => {
  const { game, saves, link } = setup({ hash: "visit=g1" });
  const first = setup();
  first.game.newGame("tokyo");
  toFirstVisit(first.game);
  saves.save(first.game.state.openVisit(5));
  link.ticket = { slot: "g1", finished: false, position: { lat: 2, lng: 3 } };
  assert.equal(await game.returnFromVisit(), "returned");
  assert.equal(game.step.type, StepType.VISIT);
  assert.deepEqual(game.state.position, { lat: 2, lng: 3 });
});

test("input service: edges, repeats for directions, FINISH chord", () => {
  let now = 0;
  const held = new Set();
  const fired = [];
  const input = new InputService({ sources: [{ held: () => new Set(held) }], now: () => now });
  input.listen((a) => fired.push(a));
  held.add(Button.DOWN);
  input.tick();
  now += REPEAT_DELAY - 1;
  input.tick();
  now += 1;
  input.tick();
  now += REPEAT_INTERVAL;
  input.tick();
  assert.deepEqual(fired, [Button.DOWN, Button.DOWN, Button.DOWN]);
  fired.length = 0;
  held.clear();
  held.add(Button.L);
  input.tick();
  held.add(Button.R);
  input.tick();
  assert.deepEqual(fired, [Button.L, Button.R, FINISH]);
});
