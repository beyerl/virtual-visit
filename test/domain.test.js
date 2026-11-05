import { test } from "node:test";
import assert from "node:assert/strict";
import { Dialogue, lineParts } from "../src/domain/dialogue.js";
import { GameState } from "../src/domain/game-state.js";
import { bearing } from "../src/domain/geo.js";
import { Button, FINISH, pressedBetween } from "../src/domain/input.js";
import { seekTarget, StepType } from "../src/domain/journey.js";
import { panoramaUrl, routeUrl } from "../src/domain/maps-links.js";
import { JOURNEYS } from "../src/content/journeys.js";

const tokyo = JOURNEYS[0];

test("itinerary: each day opens, every leg is a transit then a visit, wrap-ups close days and the journey", () => {
  const types = tokyo.steps.map((s) => s.type);
  assert.equal(types[0], StepType.DAY_INTRO);
  assert.equal(types.at(-1), StepType.JOURNEY_WRAP_UP);
  assert.equal(types.filter((t) => t === StepType.DAY_WRAP_UP).length, 3);
  assert.equal(types.filter((t) => t === StepType.VISIT).length, 18);
  tokyo.steps.forEach((s, i) => {
    if (s.type === StepType.VISIT) assert.ok([StepType.RIDE, StepType.WALK].includes(types[i - 1]), s.id);
  });
  assert.equal(new Set(tokyo.steps.map((s) => s.id)).size, tokyo.steps.length, "step ids are unique");
  assert.equal(tokyo.step(1).rides[0].video.id, "kgBAVQmAJRA", "the journey starts on the Shinkansen");
});

test("content: every journey has a guide; every ride a video and a known line; every stop walk points", () => {
  const available = JOURNEYS.filter((j) => j.steps.length);
  assert.deepEqual(available.map((j) => j.id), [
    "tokyo", "beijing", "moscow", "bogota", "rio", "newyork", "ulaanbaatar", "capetown", "cairo", "nairobi", "kingston",
  ]);
  assert.deepEqual(available.map((j) => j.guide.id), [
    "hana", "wei", "katya", "vale", "thiago", "maya", "bat", "thandi", "omar", "amani", "kemar",
  ]);
  assert.ok(!JOURNEYS.some((j) => j.id === "paris"), "Paris is gone");
  for (const j of available) for (const d of j.days) {
    for (const r of d.legs.flatMap((l) => l.rides ?? []).concat(d.home?.rides ?? [])) {
      assert.match(r.video.id, /^[\w-]{11}$/, r.name);
      assert.ok(j.lines[r.line], `${j.id} ${r.line}`);
      if (r.video.end) assert.ok(r.video.end > (r.video.start ?? 0));
    }
    for (const l of d.legs) {
      assert.ok(l.hana.length > 0, l.id);
      assert.doesNotThrow(() => bearing(l.stop.o, l.stop.d));
    }
  }
});

test("dialogue: goes through lines, then is done; skip ends it", () => {
  const d = new Dialogue(["a", "b"]);
  assert.equal(d.current, "a");
  assert.equal(d.next(), true);
  assert.equal(d.isLast, true);
  assert.equal(d.next(), false);
  assert.equal(d.done, true);
  const e = new Dialogue(["a", "b"]);
  e.skip();
  assert.equal(e.current, null);
});

test("lineParts: braces mark Japanese", () => {
  assert.deepEqual(lineParts("{Konnichiwa!} I'm Hana"), [
    { text: "Konnichiwa!", jp: true },
    { text: " I'm Hana", jp: false },
  ]);
});

test("game state: advancing clears the visit; the last step finishes", () => {
  let s = GameState.start("g1", "tokyo", 1);
  s = s.openVisit(2).moveTo({ lat: 1, lng: 2 }, 3);
  assert.equal(s.visiting, true);
  assert.deepEqual(s.position, { lat: 1, lng: 2 });
  s = s.advance(3, 4);
  assert.equal(s.stepIndex, 1);
  assert.equal(s.visiting, false);
  assert.equal(s.position, null);
  s = s.advance(3, 5).advance(3, 6);
  assert.equal(s.stepIndex, 2);
  assert.equal(s.finished, true);
  assert.equal(s.updatedAt, 6);
  assert.deepEqual(new GameState(JSON.parse(JSON.stringify(s))).toJSON(), s.toJSON());
});

test("input: presses are the buttons that went down; L + R together is FINISH", () => {
  assert.deepEqual(pressedBetween(new Set(), new Set([Button.A])), [Button.A]);
  assert.deepEqual(pressedBetween(new Set([Button.A]), new Set([Button.A])), []);
  assert.deepEqual(pressedBetween(new Set([Button.L]), new Set([Button.L, Button.R])), [Button.R, FINISH]);
  assert.deepEqual(pressedBetween(new Set([Button.L, Button.R]), new Set([Button.L, Button.R])), []);
});

test("maps links: the route URL draws walking directions; the panorama URL faces the destination", () => {
  assert.equal(
    routeUrl("35.6812,139.7649", "35.6797,139.7546"),
    "https://www.google.com/maps/dir/35.6812,139.7649/35.6797,139.7546/@35.6812,139.7649,18z/data=!4m2!4m1!3e2",
  );
  assert.match(panoramaUrl("35.6812,139.7649", "35.6797,139.7546"), /map_action=pano&viewpoint=35.6812,139.7649&heading=2\d\d$/);
  assert.equal(bearing("0,0", "1,0"), 0);
  assert.equal(bearing("0,0", "0,1"), 90);
});

test("content: taglines count the rides and stops", () => {
  for (const j of JOURNEYS.filter((x) => x.steps.length)) {
    const rides = j.days.reduce((n, _, i) => n + j.ridesOf(i).length, 0);
    const stops = j.steps.filter((s) => s.type === StepType.VISIT).length;
    assert.match(j.tagline, new RegExp(`${rides} (train )?rides · ${stops} stops`), j.id);
    assert.equal(new Set(j.steps.map((s) => s.id)).size, j.steps.length, `${j.id}: unique step ids`);
  }
});

test("seek: skips inside the video's cut, and past its end ends the ride", () => {
  const cut = { id: "v", start: 100, end: 400 };
  assert.equal(seekTarget(cut, 150, 30), 180);
  assert.equal(seekTarget(cut, 110, -30), 100, "not before the cut's start");
  assert.equal(seekTarget(cut, 380, 30), null, "past the end: the ride is over");
  assert.equal(seekTarget({ id: "v" }, 10, -30), 0);
  assert.equal(seekTarget({ id: "v" }, 590, 30, 600), null, "no cut end: the video's length");
  assert.equal(seekTarget({ id: "v" }, 500, 30, 600), 530);
});
