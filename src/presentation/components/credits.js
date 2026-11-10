// Credits (main menu → Credits): the music, voices, ride videos, map data,
// fonts and every stop photo, in one long page. The D-pad scrolls it, L and R
// jump a page, B or A goes back. Links open in a new tab (mouse only).

import { creditSections } from "../../content/credits.js";
import { Button, FINISH } from "../../domain/input.js";
import { define, esc, Screen } from "../base.js";
import "./pad-hint.js";

/** Part of the panel's height one D-pad press scrolls; L and R scroll most of a page. */
const STEP = 0.25;
const PAGE = 0.85;

/** @param {import("../../content/credits.js").CreditEntry} e */
const entryHtml = (e) => `
  <li>
    ${e.url ? `<a href="${esc(e.url)}" target="_blank" rel="noopener">${esc(e.text)}</a>` : `<span>${esc(e.text)}</span>`}
    ${e.by ? `<span class="credit-by">${esc(e.by)}</span>` : ""}
    ${e.license ? `<span class="credit-license">${esc(e.license)}</span>` : ""}
  </li>`;

export class VvCredits extends Screen {
  render() {
    /** @type {number | undefined} where the panel is scrolling to */
    this.heading = undefined;
    this.innerHTML = `
      <div class="halftone"></div>
      <div class="menu-screen">
        <h2 class="comic-heading tilt-r">Credits</h2>
        <div class="panel credits-panel" tabindex="-1">
          ${creditSections(this.app.game.journeys)
            .map(
              (s) => `
            <section>
              <h3>${esc(s.title)}</h3>
              ${s.note ? `<p class="credits-note">${esc(s.note)}</p>` : ""}
              <ul>${s.entries.map(entryHtml).join("")}</ul>
            </section>`,
            )
            .join("")}
        </div>
        <vv-pad-hint></vv-pad-hint>
      </div>`;
    // Scrolled by hand (wheel, touch, scrollbar): the next press starts from where that left it.
    for (const type of ["wheel", "pointerdown", "touchstart"])
      this.$(".credits-panel").addEventListener(type, () => (this.heading = undefined), { passive: true });
    /** @type {import("./pad-hint.js").VvPadHint} */ (this.$("vv-pad-hint")).hints = [
      ["dpad", "Scroll"],
      ["b", "Back"],
      ["x", "Music"],
    ];
  }

  /** @param {number} pages of the panel's height, down (positive) or up */
  scroll(pages) {
    const panel = /** @type {HTMLElement} */ (this.$(".credits-panel"));
    // From where the last press was heading, not from where the smooth scroll has got to: quick presses add up.
    const from = this.heading ?? panel.scrollTop;
    this.heading = Math.max(0, Math.min(panel.scrollHeight - panel.clientHeight, from + pages * panel.clientHeight));
    panel.scrollTo({ top: this.heading });
  }

  onAction(/** @type {string} */ action) {
    if (action === Button.UP) this.scroll(-STEP);
    else if (action === Button.DOWN) this.scroll(STEP);
    else if (action === Button.L || action === Button.LEFT) this.scroll(-PAGE);
    else if (action === Button.R || action === Button.RIGHT) this.scroll(PAGE);
    else if (action === Button.B || action === Button.A || action === Button.START) this.app.mainMenu();
    else if (action === FINISH) return;
  }
}

define("vv-credits", VvCredits);
