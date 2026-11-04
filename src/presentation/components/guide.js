// The travel guides, in pure CSS (styles/guides.css): Hana (Tokyo), Wei
// (Beijing) and Katya (Moscow) share one figure; `who` picks hair, clothes,
// accessories and what they hold. They blink and bob all the time, move their
// mouth while [talking], and wave.

import { define } from "../base.js";

const PARTS = `
  <div class="guide-fig">
    <div class="braid"></div>
    <div class="hair-back"></div><div class="neck"></div><div class="body"></div><div class="badge"></div>
    <div class="scarf"></div><div class="face"></div><div class="bangs"></div><div class="clip"></div>
    <div class="eye l"></div><div class="eye r"></div><div class="glasses"></div><div class="cheek l"></div><div class="cheek r"></div>
    <div class="mouth"></div>
    <div class="hat"><div class="pompom"></div></div>
    <div class="arm"><div class="item"></div></div>
  </div>`;

export class VvGuide extends HTMLElement {
  connectedCallback() {
    if (!this.firstElementChild) this.innerHTML = PARTS;
    if (!this.hasAttribute("who")) this.setAttribute("who", "hana");
    this.setAttribute("aria-hidden", "true");
  }

  /** @param {boolean} on */
  set talking(on) {
    this.toggleAttribute("talking", on);
  }
}

define("vv-guide", VvGuide);
