// The root component: shows one screen at a time (plus the pause overlay),
// passes the player's actions to it, and moves through the game's flow.

import { StepType } from "../../domain/journey.js";
import { define } from "../base.js";
import "./controls.js";
import "./journey-screens.js";
import "./menus.js";

/** Screen per step type. */
const STEP_SCREENS = {
  [StepType.DAY_INTRO]: "vv-day-intro",
  [StepType.RIDE]: "vv-ride-screen",
  [StepType.WALK]: "vv-walk-screen",
  [StepType.VISIT]: "vv-visit-screen",
  [StepType.DAY_WRAP_UP]: "vv-wrap-up",
  [StepType.JOURNEY_WRAP_UP]: "vv-wrap-up",
};

export class VvApp extends HTMLElement {
  constructor() {
    super();
    /** @type {import("../../application/game-service.js").GameService} */
    this.game = /** @type {any} */ (null);
    /** @type {import("../../application/ports.js").VisitLink} */
    this.link = /** @type {any} */ (null);
    /** @type {import("../../application/controls-service.js").ControlsService} */
    this.controls = /** @type {any} */ (null);
    this.version = "0";
    /** @type {import("../base.js").Screen | null} */
    this.screen = null;
    /** @type {import("../base.js").Screen | null} */
    this.pause = null;
  }

  /**
   * @param {{ game: import("../../application/game-service.js").GameService, link: import("../../application/ports.js").VisitLink,
   *           input: import("../../application/input-service.js").InputService,
   *           controls: import("../../application/controls-service.js").ControlsService, version: string }} deps
   */
  async start({ game, link, input, controls, version }) {
    this.game = game;
    this.link = link;
    this.controls = controls;
    this.version = version;
    input.listen((a) => (this.pause ?? this.screen)?.onAction(a));
    const back = await game.returnFromVisit();
    if (back === "finished") this.playStep();
    else if (back === "returned") this.playStep({ returned: true, position: game.state?.position });
    else this.show("vv-splash");
  }

  /** @param {string} tag @param {Record<string, any>} [props] */
  show(tag, props = {}) {
    this.closePause();
    const el = /** @type {import("../base.js").Screen} */ (document.createElement(tag));
    el.app = this;
    el.props = props;
    this.screen?.remove();
    this.screen = el;
    this.append(el);
  }

  mainMenu() {
    this.show("vv-main-menu");
  }

  loadScreen() {
    this.show("vv-load-screen");
  }

  controlsScreen() {
    this.show("vv-controls");
  }

  journeySelect() {
    this.show("vv-journey-select");
  }

  /** @param {string} journeyId */
  newGame(journeyId) {
    this.game.newGame(journeyId);
    this.playStep();
  }

  /** @param {string} id */
  loadGame(id) {
    const s = this.game.load(id);
    if (!s) return this.mainMenu();
    if (s.finished) this.game.restart();
    this.playStep({ returned: s.visiting, position: s.position });
  }

  restart() {
    this.game.restart();
    this.playStep();
  }

  /** Show the current step. @param {Record<string, any>} [extra] */
  async playStep(extra = {}) {
    const step = this.game.step;
    const journey = this.game.currentJourney;
    if (!step || !journey || !this.game.state) return this.mainMenu();
    const props = { step, journey, stepIndex: this.game.state.stepIndex, ...extra };
    if (step.type === StepType.VISIT) Object.assign(props, { extension: await this.link.detect() });
    this.show(STEP_SCREENS[step.type], props);
  }

  /** The current step is done: on to the next (saved). */
  next() {
    if (this.game.state?.finished) return this.mainMenu();
    const wasLast = this.game.step?.type === StepType.JOURNEY_WRAP_UP;
    this.game.advance();
    if (wasLast) this.mainMenu();
    else this.playStep();
  }

  openVisit() {
    this.game.openVisit().catch((e) => {
      console.error(e);
      this.playStep();
    });
  }

  openPause() {
    if (this.pause) return;
    const el = /** @type {import("../base.js").Screen} */ (document.createElement("vv-pause"));
    el.app = this;
    this.pause = el;
    this.append(el);
  }

  closePause() {
    this.pause?.remove();
    this.pause = null;
  }
}

define("vv-app", VvApp);
