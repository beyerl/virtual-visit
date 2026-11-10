// The opening cutscene: from inside a train we watch the journeys' cities go
// by, each guide waving from the platform. Then the train lifts into the sky,
// we go through the window, and the globe is exactly where the title screen
// shows it. All of it is CSS animation (styles/main.css, "opening cutscene");
// this only lays out the strip of cities and moves on to the title. Any button
// or a click skips it.

import { FINISH } from "../../domain/input.js";
import { define, esc, Screen } from "../base.js";
import { CITY_SVG, GLOBE_SVG } from "./globe.js";
import "./guide.js";
import "./pad-hint.js";

const SECONDS_PER_CITY = 0.85;
const THROUGH_WINDOW = 1.2; // s of going through the window at the end

export class VvIntro extends Screen {
  render() {
    const journeys = this.app.game.journeys.filter((j) => j.steps.length);
    const w = Math.round(Math.min(innerWidth * 0.84, innerHeight * 1.2));
    const h = Math.round(w * 0.5625);
    const city = w * 0.8;
    const lead = w * 0.6;
    const distance = lead + journeys.length * city - w * 0.1;
    const scroll = (distance / city) * SECONDS_PER_CITY;
    const scenes = journeys
      .map(
        (j) => `
        <div class="train-city">
          <div class="train-landmark">${CITY_SVG[j.id] ?? ""}</div>
          <div class="train-sign">${esc(j.title)}</div>
          <vv-guide who="${esc(j.guide.id)}"></vv-guide>
        </div>`,
      )
      .join("");
    this.innerHTML = `
      <div class="sunburst"></div><div class="halftone"></div>
      <div class="splash intro-end" aria-hidden="true">
        <div class="splash-art">${GLOBE_SVG}</div>
        <h1 class="comic-title"><span class="w1">Virtually</span><span class="w2">traveling</span><span class="w3">the world!</span></h1>
        <button class="press-start" tabindex="-1">Press start</button>
        <p class="splash-note">&nbsp;</p>
      </div>
      <div class="train-cabin" style="--w:${w}px;--h:${h}px;--city:${Math.round(city)}px;--lead:${Math.round(lead)}px;--distance:${Math.round(distance)}px;--scroll:${scroll.toFixed(2)}s;--guide:${((h * 0.5) / 210).toFixed(3)}">
        <div class="train-window">
          <div class="train-world">
            <div class="train-sky"></div>
            <div class="train-lift">
              <div class="train-strip">${scenes}</div>
              <div class="train-ground"></div>
            </div>
            <div class="train-poles"></div>
          </div>
          <div class="train-curtain l"></div><div class="train-curtain r"></div>
        </div>
        <div class="train-sill"></div>
        <div class="train-seat l"></div><div class="train-seat r"></div>
      </div>
      <vv-pad-hint class="intro-skip"></vv-pad-hint>`;
    /** @type {import("./pad-hint.js").VvPadHint} */ (this.$("vv-pad-hint")).hints = [["start", "Skip"]];
    this.timer = setTimeout(() => this.finish(true), (scroll + THROUGH_WINDOW) * 1000);
    // The hint's click arrives as its button press (see PointerSource); skipping for it here too would skip the title as well.
    this.addEventListener("click", (e) => {
      if (!(/** @type {Element} */ (e.target).closest("[data-button]"))) this.finish();
    });
  }

  cleanup() {
    clearTimeout(this.timer);
  }

  /** @param {boolean} [afterIntro] it played to the end, with the globe already in place: no fade */
  finish(afterIntro = false) {
    if (this.isConnected) this.app.show("vv-splash", { afterIntro });
  }

  onAction(/** @type {string} */ action) {
    if (action !== FINISH) this.finish();
  }
}

define("vv-intro", VvIntro);
