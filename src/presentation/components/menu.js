// A vertical list of comic-panel options, chosen with the D-pad and A (or a
// click). Fires "choose" with the option's value.

import { Button } from "../../domain/input.js";
import { define, esc } from "../base.js";

/** @typedef {{ label: string, value: string, sub?: string, disabled?: boolean, heading?: boolean, html?: string }} MenuOption */

export class VvMenu extends HTMLElement {
  constructor() {
    super();
    /** @type {MenuOption[]} */
    this.options = [];
    this.index = 0;
  }

  /** @param {MenuOption[]} options @param {number} [index] */
  setOptions(options, index = 0) {
    this.options = options;
    this.index = Math.min(Math.max(0, index), Math.max(0, options.length - 1));
    if (this.options[this.index]?.disabled) this.move(1);
    this.render();
  }

  get value() {
    return this.options[this.index]?.value ?? null;
  }

  render() {
    this.setAttribute("role", "listbox");
    this.innerHTML = this.options
      .map(
        (o, i) => `
        <div class="menu-item${i === this.index ? " selected" : ""}${o.disabled ? " disabled" : ""}${o.heading ? " heading" : ""}" role="option"
             aria-selected="${i === this.index}" data-index="${i}">
          <span class="menu-pointer" aria-hidden="true">▶</span>
          <span class="menu-body">${o.html ?? `<span class="menu-label">${esc(o.label)}</span>${o.sub ? `<span class="menu-sub">${esc(o.sub)}</span>` : ""}`}</span>
        </div>`,
      )
      .join("");
    this.querySelectorAll(".menu-item").forEach((el) =>
      el.addEventListener("click", () => {
        const i = Number(/** @type {HTMLElement} */ (el).dataset.index);
        if (this.options[i]?.disabled) return;
        this.index = i;
        this.choose();
      }),
    );
    this.querySelector(".selected")?.scrollIntoView({ block: "nearest" });
  }

  /** @param {number} dir */
  move(dir) {
    const n = this.options.length;
    if (!n || this.options.every((o) => o.disabled)) return;
    let i = this.index;
    do i = (i + dir + n) % n;
    while (this.options[i].disabled);
    this.index = i;
    this.render();
    this.dispatchEvent(new CustomEvent("move", { detail: this.value }));
  }

  choose() {
    const o = this.options[this.index];
    if (o && !o.disabled) this.dispatchEvent(new CustomEvent("choose", { detail: o.value }));
  }

  /** @param {string} action @returns {boolean} handled */
  onAction(action) {
    if (action === Button.UP || action === Button.LEFT) this.move(-1);
    else if (action === Button.DOWN || action === Button.RIGHT) this.move(1);
    else if (action === Button.A || action === Button.START) this.choose();
    else return false;
    return true;
  }
}

define("vv-menu", VvMenu);
