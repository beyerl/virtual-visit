// Shared bits of the web components: a base class for screens and HTML helpers.

import { lineParts } from "../domain/dialogue.js";

/** @param {unknown} s */
export const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] ?? c);

/** A line of the guide with {Japanese} parts highlighted, as HTML. @param {string} line */
export const lineHtml = (line) =>
  lineParts(line)
    .map((p) => (p.jp ? `<b class="jp">${esc(p.text)}</b>` : esc(p.text)))
    .join("");

/** @param {string} tag @param {CustomElementConstructor} cls */
export function define(tag, cls) {
  if (!customElements.get(tag)) customElements.define(tag, cls);
}

/**
 * A full-screen view. The app sets `app` and `props` before attaching it,
 * renders it on connect, and passes it the player's actions.
 */
export class Screen extends HTMLElement {
  constructor() {
    super();
    /** @type {import("./components/app.js").VvApp} */
    this.app = /** @type {any} */ (null);
    /** @type {Record<string, any>} */
    this.props = {};
  }

  connectedCallback() {
    this.classList.add("screen");
    this.render();
  }

  disconnectedCallback() {
    this.cleanup();
  }

  render() {}
  cleanup() {}

  /** @param {string} _action a Button value or FINISH @returns {boolean | void} true if handled */
  onAction(_action) {}

  /** @template {Element} T @param {string} sel @returns {T} */
  $(sel) {
    return /** @type {T} */ (this.querySelector(sel));
  }
}
