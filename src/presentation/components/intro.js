// The opening cutscene: the guides walk on and say hello, then step aside for
// the globe, which ends up exactly where the title screen shows it. All of it
// is CSS animation (styles/main.css, "opening cutscene"); this only sets it up
// and moves on to the title. Any button or a click skips it.

import { INTRO_CAST } from "../../content/intro-cast.js";
import { FINISH } from "../../domain/input.js";
import { define, esc, Screen } from "../base.js";
import { GLOBE_SVG } from "./globe.js";
import "./guide.js";
import "./pad-hint.js";

/** How long the animation runs, in ms (the globe's arrival ends it). */
export const INTRO_MS = 8300;

const WALK_ON_STEP = 0.42; // s between one guide arriving and the next
const STAGE_START = 6; // % from the left of the first guide
const STAGE_STEP = 8.8; // % between neighbours, who stand in two alternating rows
/** How far left a speech bubble is shifted, in % of its width, so the outermost guides' stay on screen. */
const BUBBLE_SHIFT = { 0: -15, 1: -30, 9: -70, 10: -85 };

export class VvIntro extends Screen {
  render() {
    // Neighbours in a row stand two steps apart; the guide must fit between them and in the lower part of the screen.
    const scale = Math.min(1.1, (innerWidth * (2 * STAGE_STEP)) / 100 / 150, (innerHeight * 0.34) / 210);
    const cast = INTRO_CAST.map(
      ({ id, hello }, i) => `
        <div class="intro-guide ${i % 2 ? "back" : "front"}"
             style="--i:${i};--step:${WALK_ON_STEP}s;--s:${scale.toFixed(3)};--from:${i % 2 ? 120 : -120}vw;--bx:${BUBBLE_SHIFT[i] ?? -50}%;left:${STAGE_START + i * STAGE_STEP}%">
          <div class="intro-hello">${esc(hello)}</div>
          <vv-guide who="${esc(id)}"></vv-guide>
        </div>`,
    ).join("");
    this.innerHTML = `
      <div class="sunburst"></div><div class="halftone"></div>
      <div class="splash intro-end" aria-hidden="true">
        <div class="splash-art">${GLOBE_SVG}</div>
        <h1 class="comic-title"><span class="w1">Virtually</span><span class="w2">traveling</span><span class="w3">the world!</span></h1>
        <button class="press-start" tabindex="-1">Press start</button>
        <p class="splash-note">&nbsp;</p>
      </div>
      <h2 class="comic-heading big intro-heading">Your guides are ready!</h2>
      <div class="intro-stage">${cast}</div>
      <vv-pad-hint class="intro-skip"></vv-pad-hint>`;
    /** @type {import("./pad-hint.js").VvPadHint} */ (this.$("vv-pad-hint")).hints = [["start", "Skip"]];
    this.timer = setTimeout(() => this.finish(), INTRO_MS);
    // The hint's click arrives as its button press (see PointerSource); skipping for it here too would skip the title as well.
    this.addEventListener("click", (e) => {
      if (!(/** @type {Element} */ (e.target).closest("[data-button]"))) this.finish();
    });
  }

  cleanup() {
    clearTimeout(this.timer);
  }

  finish() {
    if (this.isConnected) this.app.show("vv-splash");
  }

  onAction(/** @type {string} */ action) {
    if (action !== FINISH) this.finish();
  }
}

define("vv-intro", VvIntro);
