// Button hints in SNES style ("Ⓐ Next  START Skip"), as inline SVG. Each hint
// can be clicked or tapped, which presses that button.

import { define, esc } from "../base.js";

/** SNES face button colours (the Super Famicom / PAL pad). */
const FACE = { a: "#d2603f", b: "#f0b43c", x: "#3f7fa6", y: "#5f9e4a" };

/** @param {string} b */
function glyph(b) {
  if (b in FACE) {
    return `<svg viewBox="0 0 28 28" class="glyph"><circle cx="14" cy="14" r="12" fill="${FACE[/** @type {keyof typeof FACE} */ (b)]}" stroke="currentColor" stroke-width="2.5"/><text x="14" y="19" text-anchor="middle" font-size="14" font-weight="900" fill="#fff">${b.toUpperCase()}</text></svg>`;
  }
  if (b === "start" || b === "select") {
    return `<svg viewBox="0 0 64 24" class="glyph wide"><rect x="2" y="4" width="60" height="16" rx="8" fill="#8a6a4f" stroke="currentColor" stroke-width="2.5"/><text x="32" y="16.5" text-anchor="middle" font-size="10" font-weight="900" fill="#fff" letter-spacing="1">${b.toUpperCase()}</text></svg>`;
  }
  if (b === "lr") {
    return `<svg viewBox="0 0 74 24" class="glyph wide"><path d="M4 20 Q4 4 22 4 H32 V20 Z" fill="#c79a6b" stroke="currentColor" stroke-width="2.5"/><text x="20" y="16.5" text-anchor="middle" font-size="11" font-weight="900" fill="#fff">L</text><path d="M70 20 Q70 4 52 4 H42 V20 Z" fill="#c79a6b" stroke="currentColor" stroke-width="2.5"/><text x="54" y="16.5" text-anchor="middle" font-size="11" font-weight="900" fill="#fff">R</text></svg>`;
  }
  if (b === "dpad") {
    return `<svg viewBox="0 0 28 28" class="glyph"><path d="M10 2h8v8h8v8h-8v8h-8v-8H2v-8h8z" fill="#e8d2a8" stroke="currentColor" stroke-width="2"/></svg>`;
  }
  return "";
}

export class VvPadHint extends HTMLElement {
  /** @param {[string, string][]} list [button, label] pairs; button "lr" = L + R, "dpad" = D-pad */
  set hints(list) {
    this.innerHTML = list
      .map(
        ([b, label]) =>
          `<span class="hint" ${b === "dpad" ? "" : `data-button="${b === "lr" ? "finish" : b}"`} role="button">${glyph(b)}<span>${esc(label)}</span></span>`,
      )
      .join("");
  }
}

define("vv-pad-hint", VvPadHint);
