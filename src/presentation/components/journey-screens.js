// The screens of a running journey: day intro, train ride, walk, Street View
// hand-over, and the wrap-ups after each day and the whole journey.

import { Button, FINISH } from "../../domain/input.js";
import { StepType } from "../../domain/journey.js";
import { RideVideo } from "../../infrastructure/youtube-player.js";
import { define, esc, Screen } from "../base.js";
import { progress } from "../describe.js";
import "./menu.js";
import "./pad-hint.js";
import "./route-map.js";
import "./speech.js";

/**
 * @typedef {import("./speech.js").VvSpeech} VvSpeech
 * @typedef {import("./pad-hint.js").VvPadHint} VvPadHint
 * @typedef {import("./menu.js").VvMenu} VvMenu
 * @typedef {import("../../domain/journey.js").Step} Step
 * @typedef {import("../../domain/journey.js").Journey} Journey
 * @typedef {import("../../domain/journey.js").Ride} Ride
 */

/** A station badge like the real ones: code in a box with the line colour. @param {Journey} j @param {Ride} r @param {[string, string]} st */
const station = (j, r, st) =>
  `<span class="st"><span class="code" style="--line:${j.color(r)}">${esc(st[0])}</span>${esc(st[1])}</span>`;

/** @param {Journey} j @param {Ride} r */
const rideCaption = (j, r) => `
  <div class="line-name"><i class="chip" style="background:${j.color(r)}"></i>${esc(r.name)}</div>
  <div class="stations">${station(j, r, r.from)}<span class="arrow">→</span>${station(j, r, r.to)}<span class="mins">${esc(r.mins)}</span></div>`;

/** Top bar inside a journey: day, progress. @param {Journey} j @param {Step} step @param {number} stepIndex */
const hud = (j, step, stepIndex) => {
  const p = progress(j, stepIndex);
  return `<div class="hud"><span class="hud-day">${esc(j.days[step.day]?.num ?? "")}</span><span class="hud-city">${esc(/** @type {any} */ (j).title)}</span><span class="hud-bar"><i style="width:${p.pct}%"></i></span><span class="hud-count">stop ${Math.min(p.done + 1, p.total)}/${p.total}</span></div>`;
};

/** Base for journey screens: a step, the speech, the pause button. */
class StepScreen extends Screen {
  get step() {
    return /** @type {Step} */ (this.props.step);
  }
  get journey() {
    return /** @type {Journey} */ (this.props.journey);
  }
  get guideId() {
    return this.journey.guide?.id ?? "hana";
  }
  get speech() {
    return /** @type {VvSpeech} */ (this.$("vv-speech"));
  }
  /** @param {[string, string][]} hints */
  hints(hints) {
    /** @type {VvPadHint} */ (this.$("vv-pad-hint")).hints = hints;
  }
  hudHtml() {
    return hud(this.journey, this.step, this.props.stepIndex);
  }

  /** Shared keys: Select pauses. @param {string} action @returns {boolean} handled */
  common(action) {
    if (action === Button.SELECT) {
      this.app.openPause();
      return true;
    }
    return false;
  }
}

export class VvDayIntro extends StepScreen {
  render() {
    const j = this.journey;
    const day = j.days[this.step.day];
    const stops = j.stopsOf(this.step.day);
    const lines = [...new Set(j.ridesOf(this.step.day).map((r) => r.line))];
    this.innerHTML = `
      <div class="sunburst"></div><div class="halftone"></div>
      ${this.hudHtml()}
      <div class="day-intro">
        <div class="burst"><svg viewBox="0 0 200 200" aria-hidden="true"><polygon points="${burstPoints(100, 100, 96, 86, 18)}" fill="#f2c45a" stroke="#3b2418" stroke-width="4" stroke-linejoin="round"/></svg><span>${esc(day.num)}</span></div>
        <h2 class="comic-heading day-title">${esc(day.title)}</h2>
        <div class="panel day-plan">
          <div class="plan-lines">${lines.map((l) => `<span class="line-pill" style="--line:${j.lines[l]?.color}">${esc(j.lines[l]?.name)}</span>`).join("")}</div>
          <ol class="plan-stops">${stops.map((s) => `<li class="${s.kind}">${esc(s.name)} <span class="jp">${esc(s.jp)}</span></li>`).join("")}</ol>
        </div>
      </div>
      <vv-speech guide="${this.guideId}" class="bottom-speech"></vv-speech>
      <vv-pad-hint></vv-pad-hint>`;
    this.hints([
      ["a", "Next"],
      ["start", "Skip"],
      ["select", "Pause"],
    ]);
    this.speech.addEventListener("dialogue-end", () => this.app.next());
    this.speech.play(this.step.lines);
  }

  onAction(/** @type {string} */ action) {
    if (this.common(action)) return;
    if (action === Button.A) this.speech.advance();
    if (action === Button.START) this.speech.skipAll();
  }
}

/** Points of a comic burst star. */
function burstPoints(cx = 100, cy = 100, r1 = 96, r2 = 70, n = 14) {
  const pts = [];
  for (let i = 0; i < n * 2; i++) {
    const r = i % 2 ? r2 : r1;
    const a = (Math.PI * i) / n - Math.PI / 2;
    pts.push(`${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`);
  }
  return pts.join(" ");
}

/**
 * A train ride: the side-window video full screen, the guide talking over it.
 * A = next bubble, Start = skip the ride, X = sound, Y = map. After the
 * (last) video, remaining bubbles can still be read, then on to the stop.
 */
export class VvRideScreen extends StepScreen {
  render() {
    this.rideIndex = 0;
    this.videoDone = false;
    this.dialogueDone = false;
    this.mapShown = true;
    this.innerHTML = `
      <div class="video-wrap"><div class="video-host"></div><div class="video-shield"></div></div>
      <div class="boarding"><div class="speedlines"></div><span>All aboard!</span></div>
      <div class="arrived" hidden><span>Arrived!</span></div>
      ${this.hudHtml()}
      <div class="ride-caption panel caption"></div>
      <vv-route-map class="panel"></vv-route-map>
      <div class="sound-badge" data-button="x" hidden>🔇 Sound off: press <b>X</b> (or click once, then X)</div>
      <vv-speech guide="${this.guideId}" class="bottom-speech over-video"></vv-speech>
      <vv-pad-hint></vv-pad-hint>`;
    this.hints([
      ["a", "Next"],
      ["start", "Skip ride"],
      ["x", "Sound"],
      ["y", "Map"],
      ["select", "Pause"],
    ]);
    this.speech.addEventListener("dialogue-end", () => {
      this.dialogueDone = true;
      if (this.videoDone) this.finish();
    });
    this.speech.play(this.step.lines);
    this.playRide();
  }

  get rides() {
    return /** @type {Ride[]} */ (this.step.rides);
  }

  playRide() {
    const ride = this.rides[this.rideIndex];
    /** @type {HTMLElement} */ (this.$(".ride-caption")).innerHTML =
      (this.rides.length > 1 ? `<div class="ride-count">Ride ${this.rideIndex + 1} of ${this.rides.length}</div>` : "") +
      rideCaption(this.journey, ride);
    /** @type {import("./route-map.js").VvRouteMap} */ (this.$("vv-route-map")).show({ ride, journey: this.journey });
    this.classList.remove("playing");
    this.video?.destroy();
    const host = document.createElement("div");
    /** @type {HTMLElement} */ (this.$(".video-host")).replaceChildren(host);
    this.video = new RideVideo(window, host, ride.video, {
      onPlaying: () => this.classList.add("playing"),
      onEnded: () => this.rideEnded(),
      onError: (e) => {
        console.warn("[virtual-visit] video", ride.video.id, e);
        // No video: keep the comic speed lines going; Start goes on.
        this.classList.add("no-video");
      },
      onMuted: (m) => {
        /** @type {HTMLElement} */ (this.$(".sound-badge")).hidden = !m;
      },
    });
  }

  rideEnded() {
    if (this.rideIndex < this.rides.length - 1) {
      this.rideIndex++;
      this.playRide();
      return;
    }
    this.videoDone = true;
    /** @type {HTMLElement} */ (this.$(".arrived")).hidden = false;
    if (this.dialogueDone || this.speech.done) this.finish();
  }

  finish() {
    if (this.finished) return;
    this.finished = true;
    this.app.next();
  }

  cleanup() {
    this.video?.destroy();
  }

  onAction(/** @type {string} */ action) {
    if (this.common(action)) return;
    if (action === Button.A) this.speech.advance();
    else if (action === Button.START) this.finish();
    else if (action === Button.X) this.video?.toggleSound();
    else if (action === Button.Y) {
      this.mapShown = !this.mapShown;
      /** @type {HTMLElement} */ (this.$("vv-route-map")).classList.toggle("folded", !this.mapShown);
    }
  }
}

/** On foot to the next stop: no train, the guide walks with us through a little street. */
export class VvWalkScreen extends StepScreen {
  render() {
    const s = /** @type {import("../../domain/journey.js").Stop} */ (this.step.stop);
    this.innerHTML = `
      <div class="walk-scene">
        <div class="sky"></div>
        <div class="skyline far"></div>
        <div class="skyline near"></div>
        <div class="street"></div>
        <vv-guide class="walking" who="${this.guideId}"></vv-guide>
      </div>
      ${this.hudHtml()}
      <div class="panel caption walk-caption">
        <div class="line-name">${walkIcon()} On foot · ${esc(s.mins)} min</div>
        <div class="stations">${esc(s.walkLabel)}</div>
      </div>
      <vv-speech guide="${this.guideId}" class="bottom-speech no-hana"></vv-speech>
      <vv-pad-hint></vv-pad-hint>`;
    this.hints([
      ["a", "Next"],
      ["start", "Skip"],
      ["select", "Pause"],
    ]);
    this.speech.addEventListener("dialogue-end", () => this.app.next());
    this.speech.play(this.step.lines);
  }

  onAction(/** @type {string} */ action) {
    if (this.common(action)) return;
    if (action === Button.A) this.speech.advance();
    if (action === Button.START) this.app.next();
  }
}

const walkIcon = () =>
  `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M13.5 5.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM9.8 8.9 7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3A7.3 7.3 0 0 0 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L6 8.3V13h2V9.6l1.8-.7"/></svg>`;

/**
 * A stop, before Street View opens (A) or after coming back without
 * finishing it. L + R finishes the stop, here as in Street View.
 */
export class VvVisitScreen extends StepScreen {
  render() {
    const s = /** @type {import("../../domain/journey.js").Stop} */ (this.step.stop);
    const returned = this.props.returned;
    const ext = this.props.extension;
    this.innerHTML = `
      <div class="halftone"></div>
      ${this.hudHtml()}
      <div class="visit">
        <article class="panel stop-card ${s.kind}">
          ${s.kind === "dinner" ? `<div class="eyebrow">Evening · dinner</div>` : `<div class="eyebrow">Next stop</div>`}
          <h2>${esc(s.name)} <small class="jp">${esc(s.jp)}</small></h2>
          ${s.cuisine ? `<div class="kind">${esc(s.cuisine)}</div>` : ""}
          <p>${esc(s.text)}</p>
          <div class="walk">${walkIcon()}<b>${esc(s.mins)} min walk</b> · ${esc(s.walkLabel)}</div>
          ${s.tip ? `<div class="tip"><b>${esc(this.journey.guide.short)}'s tip:</b> ${esc(s.tip)}</div>` : ""}
        </article>
        <div class="panel visit-actions">
          <vv-menu></vv-menu>
          <div class="ext-status ${ext ? "ok" : "missing"}">
            ${
              ext
                ? `<b>Street View Gamepad</b> is on: walk with the pad, press <b>L + R</b> together to finish this stop.`
                : `<b>Street View Gamepad</b> extension not found. Street View opens without the pad controls and the route; use the browser's <b>Back</b> button to come back.`
            }
          </div>
        </div>
      </div>
      <vv-speech guide="${this.guideId}" class="corner-speech"></vv-speech>
      <vv-pad-hint></vv-pad-hint>`;
    const menu = /** @type {VvMenu} */ (this.$("vv-menu"));
    menu.setOptions(
      returned
        ? [
            { label: "Back to Street View", value: "go", sub: this.props.position ? "Where you left off" : "From the start of the walk" },
            { label: "Next stop", value: "next", sub: "Finish this stop" },
            { label: "Main menu", value: "menu" },
          ]
        : [
            { label: "Walk in Street View", value: "go", sub: `${s.mins} min walk` },
            { label: "Skip this stop", value: "next" },
          ],
    );
    menu.addEventListener("choose", (e) => {
      const v = /** @type {CustomEvent} */ (e).detail;
      if (v === "go") this.go();
      else if (v === "next") this.app.next();
      else this.app.mainMenu();
    });
    this.hints([
      ["dpad", "Choose"],
      ["a", "OK"],
      ["lr", "Finish stop"],
      ["select", "Pause"],
    ]);
    this.speech.play([
      returned
        ? "{Okaeri!} Welcome back. Do you want to look around some more, or shall we move on?"
        : `Here we are! Walk around with me, and press {L + R} together when you've seen enough.`,
    ]);
  }

  go() {
    if (this.going) return;
    this.going = true;
    this.classList.add("leaving");
    this.app.openVisit();
  }

  onAction(/** @type {string} */ action) {
    if (this.common(action)) return;
    if (action === FINISH) return this.app.next();
    if (action === Button.B && this.props.returned) return this.app.mainMenu();
    /** @type {VvMenu} */ (this.$("vv-menu")).onAction(action);
  }
}

/** Stamps for the stops of a day. @param {Journey} j @param {number} day */
const stamps = (j, day) =>
  j
    .stopsOf(day)
    .map((s, i) => {
      const rot = ((i * 37) % 9) - 4;
      const hue = s.kind === "dinner" ? "#d2603f" : ["#3d8a8c", "#5f9e4a", "#9a5f8c", "#d98a3a"][i % 4];
      return `<div class="stamp-cell" style="--rot:${rot}deg;--ink:${hue};animation-delay:${i * 120}ms">
        <svg viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="52" fill="none" stroke="var(--ink)" stroke-width="6"/><circle cx="60" cy="60" r="42" fill="none" stroke="var(--ink)" stroke-width="2" stroke-dasharray="3 4"/>${s.kind === "dinner" ? `<path d="M48 40 v40 M44 40 v14 a4 4 0 0 0 8 0 v-14 M72 40 q-8 10 0 22 v18" stroke="var(--ink)" stroke-width="4" fill="none" stroke-linecap="round"/>` : `<path d="M60 30 l7 15 16 2-12 11 3 16-14-8-14 8 3-16-12-11 16-2z" fill="var(--ink)"/>`}</svg>
        <span class="stamp-jp">${esc(s.jp)}</span><span class="stamp-name">${esc(s.name)}</span></div>`;
    })
    .join("");

/** After a day, and after the whole journey. */
export class VvWrapUp extends StepScreen {
  render() {
    const j = this.journey;
    const journey = this.step.type === StepType.JOURNEY_WRAP_UP;
    const days = journey ? j.days.map((_, i) => i) : [this.step.day];
    const rides = days.flatMap((d) => j.ridesOf(d));
    const stops = days.flatMap((d) => j.stopsOf(d));
    const day = j.days[this.step.day];
    const lastDay = this.step.day >= j.days.length - 1;
    this.innerHTML = `
      <div class="sunburst ${journey ? "gold" : ""}"></div><div class="halftone"></div>
      ${this.hudHtml()}
      <div class="wrap-up${journey ? " journey" : ""}">
        <h2 class="comic-heading ${journey ? "big" : ""}">${journey ? "Journey complete!" : `${esc(day.num)} complete!`}</h2>
        <div class="panel stamp-book">
          ${days.map((d) => `${journey ? `<h3>${esc(j.days[d].num)} · ${esc(j.days[d].title)}</h3>` : ""}<div class="stamps">${stamps(j, d)}</div>`).join("")}
          <div class="tally">
            <span><b>${stops.length}</b> stops</span>
            <span><b>${rides.length}</b> rides</span>
            <span class="pills">${[...new Set(rides.map((r) => r.line))].map((l) => `<i class="dot" style="background:${j.lines[l]?.color}" title="${esc(j.lines[l]?.name)}"></i>`).join("")}</span>
          </div>
        </div>
        <div class="panel wrap-menu" hidden><vv-menu></vv-menu></div>
        ${journey ? `<div class="the-end">The End</div>` : ""}
      </div>
      <vv-speech guide="${this.guideId}" class="bottom-speech"></vv-speech>
      <vv-pad-hint></vv-pad-hint>`;
    const menu = /** @type {VvMenu} */ (this.$("vv-menu"));
    menu.setOptions(
      journey
        ? [
            { label: "Main menu", value: "menu" },
            { label: "Travel again", value: "again", sub: `${/** @type {any} */ (j).title} from the start` },
          ]
        : [
            { label: lastDay ? "Finish the journey" : `On to ${j.days[this.step.day + 1].num}`, value: "next" },
            { label: "Save & quit to menu", value: "menu" },
          ],
    );
    menu.addEventListener("choose", (e) => {
      const v = /** @type {CustomEvent} */ (e).detail;
      if (v === "next") this.app.next();
      else if (v === "again") this.app.restart();
      else if (journey) this.app.next(); // marks the journey finished, then the menu
      else this.app.mainMenu();
    });
    this.hints([
      ["a", "Next"],
      ["start", "Skip"],
      ["select", "Pause"],
    ]);
    this.speech.addEventListener("dialogue-end", () => this.showMenu());
    this.speech.play(this.step.lines);
  }

  showMenu() {
    /** @type {HTMLElement} */ (this.$(".wrap-menu")).hidden = false;
    this.menuShown = true;
    this.hints([
      ["dpad", "Choose"],
      ["a", "OK"],
    ]);
  }

  onAction(/** @type {string} */ action) {
    if (this.common(action)) return;
    if (this.menuShown) return void /** @type {VvMenu} */ (this.$("vv-menu")).onAction(action);
    if (action === Button.A) this.speech.advance();
    if (action === Button.START) this.speech.skipAll();
  }
}

define("vv-day-intro", VvDayIntro);
define("vv-ride-screen", VvRideScreen);
define("vv-walk-screen", VvWalkScreen);
define("vv-visit-screen", VvVisitScreen);
define("vv-wrap-up", VvWrapUp);
