import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { creditSections } from "../src/content/credits.js";
import { JOURNEY_MUSIC, TRACK_TITLES } from "../src/content/journey-music.js";
import { JOURNEYS } from "../src/content/journeys.js";

const sections = creditSections(JOURNEYS);
const section = (/** @type {string} */ title) => sections.find((s) => s.title === title);

test("credits: every journey's track is named, with its composer and licence", () => {
  const music = section("Music");
  assert.ok(music);
  assert.match(music.entries[0].text, /Happy Adventure/);
  for (const j of JOURNEYS.filter((j) => j.steps.length)) {
    assert.ok(JOURNEY_MUSIC[j.id], `${j.id} has music`);
    const entry = music.entries.find((e) => e.text === `${j.title}: ${TRACK_TITLES[j.id]}`);
    assert.ok(entry, `${j.id}: track credited`);
    assert.equal(entry.by, "Kevin MacLeod");
    assert.equal(entry.license, "CC BY 4.0");
  }
});

test("credits: every stop photo is credited with its author, licence and Commons page", () => {
  for (const j of JOURNEYS.filter((j) => j.steps.length)) {
    const photos = section(`Photos: ${j.title}`);
    assert.ok(photos, j.id);
    const stops = j.days.flatMap((_, di) => j.stopsOf(di));
    assert.equal(photos.entries.length, stops.length, j.id);
    stops.forEach((s, i) => {
      assert.deepEqual(photos.entries[i], { text: s.name, by: s.image.author, license: s.image.license, url: s.image.page });
    });
  }
});

test("credits: voices, ride videos, maps and fonts have their sections; every entry says what it is", () => {
  for (const title of ["Guide voices", "Ride videos", "Maps and Street View", "Fonts"]) assert.ok(section(title)?.entries.length, title);
  for (const s of sections) for (const e of s.entries) {
    assert.ok(e.text, s.title);
    if (e.url) assert.match(e.url, /^https:\/\//, e.text);
  }
});

test("credits: CREDITS.md names the same tracks and photos", () => {
  const md = readFileSync(new URL("../CREDITS.md", import.meta.url), "utf8");
  for (const title of Object.values(TRACK_TITLES)) assert.ok(md.includes(`| ${title} |`), title);
  for (const j of JOURNEYS.filter((j) => j.steps.length))
    for (const s of j.days.flatMap((_, di) => j.stopsOf(di))) assert.ok(md.includes(`[${s.image.file.replace(/^File:/, "")}]`), s.image.file);
});
