// Settings: the pad's controls in the game and in Street View, and the Street
// View Gamepad extension's settings, which stay in sync with it. Pick a control
// and press the pad input for it, or set up all of them in a row (like a retro
// console's input setup). The picture shows the preset, or the control at hand.

import { CONTROL_INFO, CONTROL_ORDER, describeBinding } from "../../domain/controls.js";
import { Button } from "../../domain/input.js";
import {
  actionBinding,
  describeActionBinding,
  NEUTRAL_PAD_IMAGE,
  PRESETS,
  presetOf,
  SETTING_DEFS,
  STREET_VIEW_ACTIONS,
} from "../../domain/settings.js";
import { define, esc, Screen } from "../base.js";
import "./menu.js";
import "./pad-hint.js";

const CAPTURE_MS = 8000;
const CUSTOM = "Custom";

/** @typedef {{ kind: "game" | "action", id: string, name: string, does: string }} Target */

/** @param {keyof typeof CONTROL_INFO | string} id @returns {Target} */
const gameTarget = (id) => {
  const info = CONTROL_INFO[/** @type {keyof typeof CONTROL_INFO} */ (id)];
  return { kind: "game", id, name: info.name, does: info.does };
};
/** @param {{ id: string, label: string }} a @returns {Target} */
const actionTarget = (a) => ({ kind: "action", id: a.id, name: a.label, does: "In Street View" });
const GAME_TARGETS = CONTROL_ORDER.map(gameTarget);
const ACTION_TARGETS = STREET_VIEW_ACTIONS.map(actionTarget);

/** @param {string} label */
const heading = (label) => ({ value: `head:${label}`, label, disabled: true, heading: true, html: `<span class="settings-head">${esc(label)}</span>` });

/** A row changed with ← / →. @param {string} label @param {string} value */
const stepRow = (label, value) =>
  `<span class="set-row"><span class="set-label">${esc(label)}</span><span class="set-value"><button class="set-arrow" data-adjust="-1" tabindex="-1">◀</button><b>${esc(value)}</b><button class="set-arrow" data-adjust="1" tabindex="-1">▶</button></span></span>`;

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
  <circle data-ctl="x" cx="315" cy="80" r="19" class="pad-face" style="--c:#3f7fa6"/>
  <circle data-ctl="a" cx="356" cy="121" r="19" class="pad-face" style="--c:#d2603f"/>
  <circle data-ctl="b" cx="315" cy="162" r="19" class="pad-face" style="--c:#f0b43c"/>
  <circle data-ctl="y" cx="274" cy="121" r="19" class="pad-face" style="--c:#5f9e4a"/>
  <text x="315" y="86" class="pad-face-label">X</text><text x="356" y="127" class="pad-face-label">A</text>
  <text x="315" y="168" class="pad-face-label">B</text><text x="274" y="127" class="pad-face-label">Y</text>
  <text x="95" y="28" class="pad-label big">L</text><text x="318" y="28" class="pad-label big">R</text>
</svg>`;


export class VvSettings extends Screen {
  render() {
    /** @type {Target[] | null} controls still to set up in "set up all" */
    this.queue = null;
    this.queueSize = 0;
    /** @type {Target | null} */
    this.capturing = null;
    this.timer = 0;
    this.innerHTML = `
      <div class="halftone"></div>
      <div class="controls-screen">
        <h2 class="comic-heading tilt-l">Settings</h2>
        <div class="controls-body">
          <div class="panel pad-panel">
            <img class="preset-image" alt="" />
            <div class="pad-live" hidden>${PAD_SVG}</div>
            <div class="pad-name"></div>
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
    menu.addEventListener("move", () => this.picture());
    /** @type {import("./pad-hint.js").VvPadHint} */ (this.$("vv-pad-hint")).hints = [
      ["dpad", "Choose / change"],
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
    // The arrows of a row, before the row itself takes the click.
    this.addEventListener(
      "click",
      (e) => {
        const arrow = /** @type {Element} */ (e.target).closest?.("[data-adjust]");
        if (!arrow) return;
        e.stopPropagation();
        const row = /** @type {HTMLElement} */ (arrow.closest(".menu-item"));
        menu.index = Number(row.dataset.index);
        this.adjust(Number(arrow.getAttribute("data-adjust")));
      },
      true,
    );
    this.settings.onChange = () => this.fill(this.menu.index);
    this.fill(1);
    this.statusTimer = window.setInterval(() => this.status(), 1000);
  }

  cleanup() {
    window.removeEventListener("keydown", this.onKey, true);
    clearInterval(this.statusTimer);
    clearTimeout(this.timer);
    this.app.controls.cancelCapture();
    this.settings.onChange = null;
  }

  get menu() {
    return /** @type {import("./menu.js").VvMenu} */ (this.$("vv-menu"));
  }

  get controls() {
    return this.app.controls;
  }

  get settings() {
    return this.app.settings;
  }

  /** @param {number} index */
  fill(index) {
    const values = this.settings.values;
    const gameMap = this.controls.effective;
    const preset = presetOf(values.buttonMap);
    this.menu.setOptions(
      [
        heading("Street View controls"),
        { value: "preset", label: "Preset", html: stepRow("Preset", preset?.label ?? CUSTOM) },
        ...ACTION_TARGETS.map((t) => {
          const b = values.buttonMap[t.id];
          return {
            value: `action:${t.id}`,
            label: t.name,
            html: `<span class="ctl-row action-row"><span class="set-label">${esc(t.name)}</span><span class="ctl-binding${b === null ? " none" : ""}">${esc(describeActionBinding(b))}</span></span>`,
          };
        }),
        { value: "all-action", label: "Set up all Street View buttons", sub: "One after the other" },
        heading("Street View"),
        ...SETTING_DEFS.map((d) => ({ value: `set:${d.key}`, label: d.label, html: stepRow(d.label, this.valueText(d)) })),
        heading("Game controls"),
        ...GAME_TARGETS.map((t) => {
          const bound = gameMap[t.id];
          return {
            value: `game:${t.id}`,
            label: t.name,
            html: `<span class="ctl-row"><span class="ctl-name">${esc(t.name)}</span><span class="ctl-does">${esc(t.does)}</span><span class="ctl-binding${bound ? "" : " none"}">${esc(describeBinding(bound))}</span></span>`,
          };
        }),
        { value: "all-game", label: "Set up all game buttons", sub: "One after the other" },
        { value: "auto", label: "Automatic game layout", sub: "Forget the custom game controls", disabled: this.controls.automatic },
        heading("Done"),
        { value: "reset", label: "Reset Street View settings", sub: "Back to the defaults" },
        { value: "back", label: "Back" },
      ],
      index,
    );
    this.picture();
    this.status();
  }

  /** @param {(typeof SETTING_DEFS)[number]} def */
  valueText(def) {
    const v = this.settings.values[def.key];
    if (def.type === "toggle") return v ? "On" : "Off";
    if (def.type === "select") return def.options.find((o) => o.value === v)?.label ?? String(v);
    return String(v);
  }

  /** The preset's picture, or the live pad while a game control is at hand. */
  picture() {
    const live = /** @type {HTMLElement} */ (this.$(".pad-live"));
    const image = /** @type {HTMLImageElement} */ (this.$(".preset-image"));
    const name = /** @type {HTMLElement} */ (this.$(".pad-name"));
    const value = this.menu.value ?? "";
    const atGame = this.capturing ? this.capturing.kind === "game" : value.startsWith("game:");
    live.hidden = !atGame;
    image.hidden = atGame;
    if (atGame) {
      name.textContent = "Game controls";
      const current = this.capturing?.id ?? value.slice("game:".length);
      this.querySelectorAll("[data-ctl]").forEach((el) => {
        el.classList.toggle("on", el.getAttribute("data-ctl") === current);
        el.classList.toggle("capturing", el.getAttribute("data-ctl") === this.capturing?.id);
      });
      return;
    }
    const preset = presetOf(this.settings.values.buttonMap);
    const src = preset?.image ?? NEUTRAL_PAD_IMAGE;
    if (image.getAttribute("src") !== src) image.src = src;
    image.alt = `${preset?.label ?? CUSTOM} controller layout`;
    name.textContent = `Street View: ${preset?.label ?? CUSTOM}`;
  }

  status() {
    const el = /** @type {HTMLElement} */ (this.$(".controls-status"));
    if (!el) return;
    const pads = this.controls.pads();
    const missing = this.controls.missing;
    const pad = pads[0];
    el.innerHTML = [
      pad ? `🎮 <b>${esc(pad.id ?? "Gamepad")}</b>` : `🎮 No gamepad found. Press a button on it so the browser shows it.`,
      this.controls.automatic
        ? `Game: automatic layout${pad ? ` (${pad.mapping === "standard" ? "standard mapping" : "USB SNES layout"})` : ""}.`
        : "Game: custom layout.",
      this.app.link.available
        ? "Street View Gamepad is connected: changes apply there too."
        : `<span class="warn">Street View Gamepad not found. The Street View settings apply once it is installed.</span>`,
      missing.length
        ? `<span class="warn">Not set: ${missing.map((b) => esc(CONTROL_INFO[/** @type {keyof typeof CONTROL_INFO} */ (b)].name)).join(", ")}. The keyboard still works.</span>`
        : "",
    ]
      .filter(Boolean)
      .join("<br>");
  }

  /** The row at hand changes by ← / → or its arrows. @param {number} dir @returns {boolean} whether it can */
  adjust(dir) {
    const value = this.menu.value ?? "";
    if (value === "preset") {
      const i = PRESETS.indexOf(/** @type {any} */ (presetOf(this.settings.values.buttonMap)));
      const next = i < 0 ? 0 : (i + dir + PRESETS.length) % PRESETS.length;
      this.settings.applyPreset(PRESETS[next].id);
      return true;
    }
    if (!value.startsWith("set:")) return false;
    const def = /** @type {(typeof SETTING_DEFS)[number]} */ (SETTING_DEFS.find((d) => d.key === value.slice(4)));
    const v = this.settings.values[def.key];
    if (def.type === "range") {
      const n = /** @type {number} */ (v) + dir * def.step;
      this.settings.change({ [def.key]: Math.min(def.max, Math.max(def.min, n)) });
    } else if (def.type === "toggle") this.settings.change({ [def.key]: !v });
    else {
      const n = def.options.length;
      const i = def.options.findIndex((o) => o.value === v);
      this.settings.change({ [def.key]: def.options[(i + dir + n) % n].value });
    }
    return true;
  }

  /** @param {string} value */
  choose(value) {
    if (value === "back") return this.app.mainMenu();
    if (value === "preset" || value.startsWith("set:")) return void this.adjust(1);
    if (value === "reset") return this.settings.reset();
    if (value === "auto") {
      this.controls.reset();
      return this.fill(this.menu.index);
    }
    if (value === "all-game" || value === "all-action") {
      this.queue = value === "all-game" ? [...GAME_TARGETS] : [...ACTION_TARGETS];
      this.queueSize = this.queue.length;
      return this.next();
    }
    this.queue = null;
    const [kind, id] = value.split(":");
    this.capture(kind === "game" ? gameTarget(id) : actionTarget(/** @type {any} */ (STREET_VIEW_ACTIONS.find((a) => a.id === id))));
  }

  next() {
    const t = this.queue?.shift();
    if (t) this.capture(t);
    else {
      this.queue = null;
      this.fill(this.menu.index);
    }
  }

  skip() {
    this.controls.cancelCapture();
    this.endCapture(true);
  }

  /** @param {Target} target */
  capture(target) {
    this.capturing = target;
    const prompt = /** @type {HTMLElement} */ (this.$(".capture-prompt"));
    prompt.hidden = false;
    /** @type {HTMLElement} */ (this.$(".capture-title")).innerHTML = `Press <b>${esc(target.name)}</b>`;
    /** @type {HTMLElement} */ (this.$(".capture-sub")).textContent =
      (this.queue ? `${this.queueSize - this.queue.length} of ${this.queueSize} · ` : "") + target.does;
    /** @type {HTMLElement} */ (this.$(".capture-keys")).textContent = this.queue
      ? "Esc: stop · Enter: skip · waiting skips"
      : "Esc: cancel · waiting cancels";
    const bar = /** @type {HTMLElement} */ (this.$(".capture-bar i"));
    bar.style.transition = "none";
    bar.style.width = "100%";
    void bar.offsetWidth;
    bar.style.transition = `width ${CAPTURE_MS}ms linear`;
    bar.style.width = "0%";
    this.picture();
    clearTimeout(this.timer);
    this.timer = window.setTimeout(() => {
      this.controls.cancelCapture();
      this.endCapture(!!this.queue);
    }, CAPTURE_MS);
    this.controls.startCapture((binding) => {
      if (target.kind === "game") this.controls.assign(target.id, binding);
      else this.settings.assign(target.id, actionBinding(binding));
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
    if ((action === Button.LEFT || action === Button.RIGHT) && this.adjust(action === Button.LEFT ? -1 : 1)) return;
    this.menu.onAction(action);
  }
}

define("vv-settings", VvSettings);
