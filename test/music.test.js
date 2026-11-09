import { test } from "node:test";
import assert from "node:assert/strict";
import { JOURNEY_MUSIC, MENU_TRACK } from "../src/content/journey-music.js";
import { JOURNEYS } from "../src/content/journeys.js";
import { existsSync } from "node:fs";
import { MenuMusic } from "../src/infrastructure/menu-music.js";

function fakeWindow(state = "running") {
  const started = [];
  const stopped = [];
  const timers = [];
  class AudioContext {
    state = state;
    currentTime = 5;
    destination = {};
    createGain() {
      const param = { value: 0, cancelScheduledValues() {}, setValueAtTime() {}, linearRampToValueAtTime() {} };
      return { gain: param, connect() {}, disconnect() {} };
    }
    createBufferSource() {
      return {
        connect() {},
        start() {
          started.push(this.buffer.src);
        },
        stop() {
          stopped.push(this.buffer.src);
        },
      };
    }
    decodeAudioData(data) {
      return Promise.resolve({ src: data.src, duration: 10 });
    }
  }
  return {
    AudioContext,
    addEventListener() {},
    fetch: (src) => Promise.resolve({ ok: true, arrayBuffer: () => Promise.resolve({ src }) }),
    setTimeout: (fn) => timers.push(fn),
    started,
    stopped,
    timers,
  };
}

const store = (data = null) => ({ load: () => data, save() {} });
const settle = () => new Promise((r) => setTimeout(r));
const A = { src: "a.mp3" };
const B = { src: "b.mp3" };

test("music: the same track plays on across screens, another one replaces it", async () => {
  const w = fakeWindow();
  const music = new MenuMusic(w, store());
  music.play(A);
  await settle();
  music.play({ ...A });
  await settle();
  assert.deepEqual(w.started, ["a.mp3"]);
  music.play(B);
  await settle();
  assert.deepEqual(w.started, ["a.mp3", "b.mp3"]);
  assert.deepEqual(w.stopped, ["a.mp3"]);
});

test("music: a screen change while loading only starts the last track", async () => {
  const w = fakeWindow();
  const music = new MenuMusic(w, store());
  music.play(A);
  music.play(B);
  await settle();
  assert.deepEqual(w.started, ["b.mp3"]);
});

test("music: fading out stops the track and resolves after the fade", async () => {
  const w = fakeWindow();
  const music = new MenuMusic(w, store());
  music.play(A);
  await settle();
  let done = false;
  const fading = music.fadeOut().then(() => (done = true));
  await settle();
  assert.deepEqual(w.stopped, ["a.mp3"]);
  assert.equal(done, false);
  w.timers[0]();
  await fading;
  assert.equal(done, true);
});

test("music: with nothing audible there is nothing to wait for", async () => {
  const w = fakeWindow("suspended");
  const music = new MenuMusic(w, store());
  music.play(A);
  await settle();
  await music.fadeOut();
  assert.equal(w.timers.length, 0);
});

test("music: off stays off, on starts the screen's track again", async () => {
  const w = fakeWindow();
  const music = new MenuMusic(w, store(false));
  music.play(A);
  await settle();
  assert.deepEqual(w.started, []);
  music.toggle();
  await settle();
  assert.deepEqual(w.started, ["a.mp3"]);
});

test("music: every journey's track belongs to a journey and exists", () => {
  const ids = new Set(JOURNEYS.map((j) => j.id));
  for (const [id, track] of Object.entries(JOURNEY_MUSIC)) {
    assert.ok(ids.has(id), id);
    assert.ok(existsSync(track.src), track.src);
  }
  assert.ok(existsSync(MENU_TRACK.src));
});
