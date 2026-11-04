// Hana, the guide: pure CSS (styles/hana.css). She blinks and bobs all the
// time, moves her mouth while [talking], and waves with [waving].

import { define } from "../base.js";

const PARTS = `
  <div class="hana-fig">
    <div class="hair-back"></div><div class="neck"></div><div class="body"></div><div class="badge"></div>
    <div class="scarf"></div><div class="face"></div><div class="bangs"></div><div class="clip"></div>
    <div class="eye l"></div><div class="eye r"></div><div class="cheek l"></div><div class="cheek r"></div>
    <div class="mouth"></div>
    <div class="arm"><div class="flag-pole"></div><div class="flag"></div></div>
  </div>`;

export class VvHana extends HTMLElement {
  connectedCallback() {
    if (!this.firstElementChild) this.innerHTML = PARTS;
    this.setAttribute("aria-hidden", "true");
  }

  /** @param {boolean} on */
  set talking(on) {
    this.toggleAttribute("talking", on);
  }
}

define("vv-hana", VvHana);
