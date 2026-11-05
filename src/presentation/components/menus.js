// Title, main menu, load game, journey selection and the pause menu.

import { Button, FINISH } from "../../domain/input.js";
import { define, esc, Screen } from "../base.js";
import { describeStep, formatDate, progress } from "../describe.js";
import { CITY_SVG, GLOBE_SVG } from "./globe.js";
import "./menu.js";
import "./pad-hint.js";
import "./guide.js";

/** @typedef {import("./menu.js").VvMenu} VvMenu */
/** @typedef {import("./pad-hint.js").VvPadHint} VvPadHint */

export class VvSplash extends Screen {
  render() {
    this.innerHTML = `
      <div class="sunburst"></div><div class="halftone"></div>
      <div class="splash">
        <div class="splash-art">${GLOBE_SVG}</div>
        <h1 class="comic-title">
          <span class="w1">Virtually</span>
          <span class="w2">traveling</span>
          <span class="w3">the world!</span>
        </h1>
        <button class="press-start" data-button="start">Press start</button>
        <p class="splash-note">Best with an SNES-style gamepad · keyboard works too · <b>X</b>: music on / off</p>
      </div>`;
  }

  onAction(/** @type {string} */ action) {
    if (action === FINISH) return;
    this.app.mainMenu();
  }
}

export class VvMainMenu extends Screen {
  render() {
    const saves = this.app.game.listSaves();
    this.innerHTML = `
      <div class="halftone"></div>
      <div class="menu-screen">
        <h2 class="comic-heading tilt-l">Virtual Visit</h2>
        <div class="panel menu-panel">
          <vv-menu></vv-menu>
        </div>
        <div class="menu-globe">${GLOBE_SVG}</div>
        <vv-pad-hint></vv-pad-hint>
        <div class="version">v${esc(this.app.version)}</div>
      </div>`;
    const menu = /** @type {VvMenu} */ (this.$("vv-menu"));
    menu.setOptions([
      { label: "Start new game", value: "new", sub: "Choose a journey" },
      {
        label: "Load game",
        value: "load",
        sub: saves.length ? `${saves.length} saved game${saves.length > 1 ? "s" : ""}` : "No saved games yet",
        disabled: !saves.length,
      },
      { label: "Controls", value: "controls", sub: "Set up your gamepad" },
    ]);
    menu.addEventListener("choose", (e) => {
      const v = /** @type {CustomEvent} */ (e).detail;
      if (v === "new") this.app.journeySelect();
      else if (v === "controls") this.app.controlsScreen();
      else this.app.loadScreen();
    });
    /** @type {VvPadHint} */ (this.$("vv-pad-hint")).hints = [
      ["dpad", "Choose"],
      ["a", "OK"],
      ["x", "Music"],
    ];
  }

  onAction(/** @type {string} */ action) {
    /** @type {VvMenu} */ (this.$("vv-menu")).onAction(action);
  }
}

export class VvLoadScreen extends Screen {
  render() {
    this.confirming = null;
    this.innerHTML = `
      <div class="halftone"></div>
      <div class="menu-screen">
        <h2 class="comic-heading tilt-r">Load game</h2>
        <div class="panel menu-panel load-panel"><vv-menu></vv-menu></div>
        <div class="toast" hidden></div>
        <vv-pad-hint></vv-pad-hint>
      </div>`;
    this.fill();
    const menu = /** @type {VvMenu} */ (this.$("vv-menu"));
    menu.addEventListener("choose", (e) => this.app.loadGame(/** @type {CustomEvent} */ (e).detail));
    menu.addEventListener("move", () => this.setConfirm(null));
    /** @type {VvPadHint} */ (this.$("vv-pad-hint")).hints = [
      ["dpad", "Choose"],
      ["a", "Load"],
      ["y", "Delete"],
      ["b", "Back"],
      ["x", "Music"],
    ];
  }

  fill(index = 0) {
    const game = this.app.game;
    const saves = game.listSaves();
    if (!saves.length) return this.app.mainMenu();
    /** @type {VvMenu} */ (this.$("vv-menu")).setOptions(
      saves.map((s) => {
        const j = /** @type {import("../../domain/journey.js").Journey} */ (game.journey(s.journeyId));
        const p = progress(j, s.stepIndex);
        const where = s.finished ? "Journey complete" : describeStep(j, j.step(s.stepIndex));
        const pos = s.position ? `📍 ${s.position.lat.toFixed(4)}, ${s.position.lng.toFixed(4)}` : "";
        return {
          value: s.id,
          label: j.title,
          html: `
            <span class="save-row">
              <span class="save-city">${CITY_SVG[j.id] ?? ""}</span>
              <span class="save-info">
                <span class="menu-label">${esc(j.title)} <span class="jp">${esc(/** @type {any} */ (j).jp)}</span></span>
                <span class="menu-sub">${esc(where)}${s.visiting ? " · in Street View" : ""}</span>
                <span class="save-meta">${esc(formatDate(s.updatedAt))} · stop ${p.done}/${p.total} ${esc(pos)}</span>
                <span class="save-bar"><i style="width:${p.pct}%"></i></span>
              </span>
            </span>`,
        };
      }),
      index,
    );
  }

  /** @param {string | null} id */
  setConfirm(id) {
    this.confirming = id;
    const t = /** @type {HTMLElement} */ (this.$(".toast"));
    t.hidden = !id;
    t.textContent = id ? "Delete this saved game? Press Y again to delete." : "";
  }

  onAction(/** @type {string} */ action) {
    const menu = /** @type {VvMenu} */ (this.$("vv-menu"));
    if (action === Button.B) return this.app.mainMenu();
    if (action === Button.Y) {
      const id = menu.value;
      if (!id) return;
      if (this.confirming === id) {
        this.app.game.deleteSave(id);
        this.setConfirm(null);
        this.fill(menu.index);
      } else this.setConfirm(id);
      return;
    }
    menu.onAction(action);
  }
}

export class VvJourneySelect extends Screen {
  render() {
    this.index = 0;
    const journeys = this.app.game.journeys;
    this.innerHTML = `
      <div class="sunburst slow"></div><div class="halftone"></div>
      <div class="journey-screen">
        <h2 class="comic-heading tilt-l">Choose your journey</h2>
        <div class="journey-cards">
          ${journeys
            .map(
              (j, i) => `
            <div class="journey-card${j.steps.length ? "" : " locked"}" data-index="${i}">
              <div class="journey-art">${CITY_SVG[j.id] ?? ""}</div>
              <div class="journey-name">${esc(j.title)} <span class="jp">${esc(/** @type {any} */ (j).jp)}</span></div>
              <div class="journey-tag">${esc(/** @type {any} */ (j).tagline)}</div>
              ${j.steps.length ? `<div class="journey-guide"><vv-guide who="${j.guide.id}"></vv-guide>with ${esc(j.guide.name)}</div>` : `<div class="stamp">Coming soon</div>`}
            </div>`,
            )
            .join("")}
        </div>
        <vv-pad-hint></vv-pad-hint>
      </div>`;
    this.querySelectorAll(".journey-card").forEach((el) =>
      el.addEventListener("click", () => {
        this.index = Number(/** @type {HTMLElement} */ (el).dataset.index);
        this.select();
        this.onAction(Button.A);
      }),
    );
    /** @type {VvPadHint} */ (this.$("vv-pad-hint")).hints = [
      ["dpad", "Choose"],
      ["a", "Let's go!"],
      ["b", "Back"],
      ["x", "Music"],
    ];
    this.select();
  }

  select() {
    this.querySelectorAll(".journey-card").forEach((el, i) => el.classList.toggle("selected", i === this.index));
    this.querySelector(".journey-card.selected")?.scrollIntoView({ block: "nearest" });
  }

  /** Cards per row of the grid. */
  get columns() {
    const grid = this.querySelector(".journey-cards");
    return grid ? Math.max(1, getComputedStyle(grid).gridTemplateColumns.split(" ").length) : 1;
  }

  onAction(/** @type {string} */ action) {
    const journeys = this.app.game.journeys;
    const n = journeys.length;
    if (action === Button.LEFT) this.index = (this.index - 1 + n) % n;
    else if (action === Button.RIGHT) this.index = (this.index + 1) % n;
    else if (action === Button.UP) this.index = Math.max(0, this.index - this.columns);
    else if (action === Button.DOWN) this.index = Math.min(n - 1, this.index + this.columns);
    else if (action === Button.B) return this.app.mainMenu();
    else if (action === Button.A || action === Button.START) {
      const j = journeys[this.index];
      if (j.steps.length) this.app.newGame(j.id);
      else this.querySelector(".journey-card.selected")?.animate(
        [{ transform: "translateX(-8px)" }, { transform: "translateX(8px)" }, { transform: "none" }],
        { duration: 200 },
      );
      return;
    }
    this.select();
  }
}

/** Overlay over a running game: resume, or quit to the menu (the game is saved). */
export class VvPause extends Screen {
  render() {
    this.classList.add("overlay");
    this.innerHTML = `
      <div class="panel pause-panel">
        <h2 class="comic-heading small">Pause</h2>
        <vv-menu></vv-menu>
        <p class="pause-note">Your game is saved automatically.</p>
      </div>`;
    const menu = /** @type {VvMenu} */ (this.$("vv-menu"));
    menu.setOptions([
      { label: "Resume", value: "resume" },
      { label: "Skip to next step", value: "skip" },
      { label: "Main menu", value: "menu" },
    ]);
    menu.addEventListener("choose", (e) => {
      const v = /** @type {CustomEvent} */ (e).detail;
      this.app.closePause();
      if (v === "skip") this.app.next();
      if (v === "menu") this.app.mainMenu();
    });
  }

  onAction(/** @type {string} */ action) {
    if (action === Button.B || action === Button.SELECT) return this.app.closePause();
    /** @type {VvMenu} */ (this.$("vv-menu")).onAction(action);
  }
}

define("vv-splash", VvSplash);
define("vv-main-menu", VvMainMenu);
define("vv-load-screen", VvLoadScreen);
define("vv-journey-select", VvJourneySelect);
define("vv-pause", VvPause);
