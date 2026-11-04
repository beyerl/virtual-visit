// Controls: which gamepad input means which SNES button. Pick a control and
// press the pad input for it, or set up all of them in a row (like a retro
// console's input setup). The pad picture highlights the control at hand.

import { CONTROL_INFO, CONTROL_ORDER, describeBinding } from "../../domain/controls.js";
import { Button } from "../../domain/input.js";
import { define, esc, Screen } from "../base.js";
import "./menu.js";
import "./pad-hint.js";

const CAPTURE_MS = 8000;

const PAD_SVG = `
<svg class="snes-pad" viewBox="0 0 420 210" aria-hidden="true">
  <path data-ctl="l" d="M40 52 Q60 18 130 16 L150 16 L150 44 L48 60 Z" class="pad-shoulder"/>
  <path data-ctl="r" d="M380 52 Q360 18 290 16 L270 16 L270 44 L372 60 Z" class="pad-shoulder"/>
  <path d="M105 36 H315 A90 85 0 0 1 315 206 H105 A90 85 0 0 1 105 36 Z" class="pad-body"/>
  <circle cx="105" cy="121" r="58" class="pad-well"/>
  <circle cx="315" cy="121" r="64" class="pad-well face"/>
  <g transform="translate(105 121)">
    <rect x="-13" y="-44" width="26" height="88" rx="4" class="pad-dpad"/>
    <rect x="-44" y="-13" width="88" height="26" rx="4" class="pad-dpad"/>
    <path data-ctl="up" d="M-12 -43 H12 V-14 H-12 Z" class="pad-dir"/>
    <path data-ctl="down" d="M-12 14 H12 V43 H-12 Z" class="pad-dir"/>
    <path data-ctl="left" d="M-43 -12 H-14 V12 H-43 Z" class="pad-dir"/>
    <path data-ctl="right" d="M14 -12 H43 V12 H14 Z" class="pad-dir"/>
  </g>
  <g transform="rotate(-28 210 128)">
    <rect data-ctl="select" x="168" y="122" width="34" height="13" rx="6.5" class="pad-small"/>
    <rect data-ctl="start" x="218" y="122" width="34" height="13" rx="6.5" class="pad-small"/>
  </g>
  <text x="180" y="166" class="pad-label">SELECT</text><text x="226" y="166" class="pad-label">START</text>
  <circle data-ctl="x" cx="315" cy="80" r="19" class="pad-face" style="--c:#2D5DB3"/>
  <circle data-ctl="a" cx="356" cy="121" r="19" class="pad-face" style="--c:#D62828"/>
  <circle data-ctl="b" cx="315" cy="162" r="19" class="pad-face" style="--c:#F2B705"/>
  <circle data-ctl="y" cx="274" cy="121" r="19" class="pad-face" style="--c:#2E9E4F"/>
  <text x="315" y="86" class="pad-face-label">X</text><text x="356" y="127" class="pad-face-label">A</text>
  <text x="315" y="168" class="pad-face-label">B</text><text x="274" y="127" class="pad-face-label">Y</text>
  <text x="95" y="28" class="pad-label big">L</text><text x="318" y="28" class="pad-label big">R</text>
</svg>`;

export class VvControls extends Screen {
  render() {
    /** @type {string[] | null} buttons still to set up in "set up all" */
    this.queue = null;
    this.capturing = /** @type {string | null} */ (null);
    this.timer = 0;
    this.innerHTML = `
      <div class="halftone"></div>
      <div class="controls-screen">
        <h2 class="comic-heading tilt-l">Controls</h2>
        <div class="controls-body">
          <div class="panel pad-panel">
            ${PAD_SVG}
            <div class="controls-status"></div>
          </div>
          <div class="panel menu-panel controls-panel"><vv-menu></vv-menu></div>
        </div>
        <div class="capture-prompt" hidden>
          <div class="panel capture-box">
            <div class="capture-title"></div>
            <div class="capture-sub"></div>
            <div class="capture-bar"><i></i></div>
            <div class="capture-keys"></div>
          </div>
        </div>
        <vv-pad-hint></vv-pad-hint>
      </div>`;
    const menu = this.menu;
    menu.addEventListener("choose", (e) => this.choose(/** @type {CustomEvent} */ (e).detail));
    menu.addEventListener("move", () => this.highlight(menu.value));
    /** @type {import("./pad-hint.js").VvPadHint} */ (this.$("vv-pad-hint")).hints = [
      ["dpad", "Choose"],
      ["a", "Set"],
      ["b", "Back"],
    ];
    this.onKey = (/** @type {KeyboardEvent} */ e) => {
      if (!this.capturing) return;
      if (e.key === "Escape") this.endCapture(false);
      else if (e.key === "Enter" && this.queue) this.skip();
      e.stopPropagation();
    };
    window.addEventListener("keydown", this.onKey, true);
    this.fill(0);
    this.statusTimer = window.setInterval(() => this.status(), 1000);
  }

  cleanup() {
    window.removeEventListener("keydown", this.onKey, true);
    clearInterval(this.statusTimer);
    clearInterval(this.timer);
    this.app.controls.cancelCapture();
  }

  get menu() {
    return /** @type {import("./menu.js").VvMenu} */ (this.$("vv-menu"));
  }

  get controls() {
    return this.app.controls;
  }

  /** @param {number} index */
  fill(index) {
    const map = this.controls.effective;
    this.menu.setOptions(
      [
        ...CONTROL_ORDER.map((b) => {
          const info = CONTROL_INFO[/** @type {keyof typeof CONTROL_INFO} */ (b)];
          const bound = map[b];
          return {
            value: b,
            label: info.name,
            html: `<span class="ctl-row"><span class="ctl-name">${esc(info.name)}</span><span class="ctl-does">${esc(info.does)}</span><span class="ctl-binding${bound ? "" : " none"}">${esc(describeBinding(bound))}</span></span>`,
          };
        }),
        { value: "all", label: "Set up all buttons", sub: "One after the other" },
        { value: "auto", label: "Automatic layout", sub: "Forget the custom controls", disabled: this.controls.automatic },
        { value: "back", label: "Back" },
      ],
      index,
    );
    this.highlight(this.menu.value);
    this.status();
  }

  status() {
    const pads = this.controls.pads();
    const missing = this.controls.missing;
    const el = /** @type {HTMLElement} */ (this.$(".controls-status"));
    if (!el) return;
    const pad = pads[0];
    el.innerHTML = [
      pad ? `🎮 <b>${esc(pad.id ?? "Gamepad")}</b>` : `🎮 No gamepad found. Press a button on it so the browser shows it.`,
      this.controls.automatic
        ? `Automatic layout${pad ? ` (${pad.mapping === "standard" ? "standard mapping" : "USB SNES layout"})` : ""}.`
        : "Custom layout.",
      missing.length
        ? `<span class="warn">Not set: ${missing.map((b) => esc(CONTROL_INFO[/** @type {keyof typeof CONTROL_INFO} */ (b)].name)).join(", ")}. The keyboard still works.</span>`
        : "",
    ]
      .filter(Boolean)
      .join("<br>");
  }

  /** @param {string | null} button */
  highlight(button) {
    this.querySelectorAll("[data-ctl]").forEach((el) => {
      el.classList.toggle("on", el.getAttribute("data-ctl") === button);
      el.classList.toggle("capturing", el.getAttribute("data-ctl") === this.capturing);
    });
  }

  /** @param {string} value */
  choose(value) {
    if (value === "back") return this.app.mainMenu();
    if (value === "auto") {
      this.controls.reset();
      return this.fill(this.menu.index);
    }
    if (value === "all") {
      this.queue = [...CONTROL_ORDER];
      return this.next();
    }
    this.queue = null;
    this.capture(value);
  }

  next() {
    const b = this.queue?.shift();
    if (b) this.capture(b);
    else {
      this.queue = null;
      this.fill(CONTROL_ORDER.length);
    }
  }

  skip() {
    this.controls.cancelCapture();
    this.endCapture(true);
  }

  /** @param {string} button */
  capture(button) {
    this.capturing = button;
    const info = CONTROL_INFO[/** @type {keyof typeof CONTROL_INFO} */ (button)];
    const prompt = /** @type {HTMLElement} */ (this.$(".capture-prompt"));
    prompt.hidden = false;
    /** @type {HTMLElement} */ (this.$(".capture-title")).innerHTML = `Press <b>${esc(info.name)}</b>`;
    /** @type {HTMLElement} */ (this.$(".capture-sub")).textContent =
      (this.queue ? `${CONTROL_ORDER.length - this.queue.length} of ${CONTROL_ORDER.length} · ` : "") + info.does;
    /** @type {HTMLElement} */ (this.$(".capture-keys")).textContent = this.queue
      ? "Esc: stop · Enter: skip · waiting skips"
      : "Esc: cancel · waiting cancels";
    const bar = /** @type {HTMLElement} */ (this.$(".capture-bar i"));
    bar.style.transition = "none";
    bar.style.width = "100%";
    void bar.offsetWidth;
    bar.style.transition = `width ${CAPTURE_MS}ms linear`;
    bar.style.width = "0%";
    this.highlight(button);
    clearTimeout(this.timer);
    this.timer = window.setTimeout(() => {
      this.controls.cancelCapture();
      this.endCapture(!!this.queue);
    }, CAPTURE_MS);
    this.controls.startCapture((binding) => {
      this.controls.assign(button, binding);
      this.endCapture(true);
    });
  }

  /** @param {boolean} goOn continue "set up all" */
  endCapture(goOn) {
    clearTimeout(this.timer);
    this.controls.cancelCapture();
    this.capturing = null;
    /** @type {HTMLElement} */ (this.$(".capture-prompt")).hidden = true;
    if (goOn && this.queue) {
      this.fill(this.menu.index);
      return this.next();
    }
    this.queue = null;
    this.fill(this.menu.index);
  }

  onAction(/** @type {string} */ action) {
    if (this.capturing) return;
    if (action === Button.B) return this.app.mainMenu();
    this.menu.onAction(action);
  }
}

define("vv-controls", VvControls);
