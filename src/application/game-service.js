// Use cases around a running game: start, load, advance, visit a stop in
// Street View and come back. Every change is saved right away (autosave).

import { GameState } from "../domain/game-state.js";
import { StepType } from "../domain/journey.js";
import { panoramaUrl, routeUrl } from "../domain/maps-links.js";

export const VISIT_HASH = "visit=";

export class GameService {
  /**
   * @param {{ journeys: import("../domain/journey.js").Journey[], saves: import("./ports.js").SaveRepository,
   *           link: import("./ports.js").VisitLink, navigator: import("./ports.js").Navigator,
   *           now: () => number, newId: () => string }} deps
   */
  constructor({ journeys, saves, link, navigator, now, newId }) {
    this.journeys = journeys;
    this.saves = saves;
    this.link = link;
    this.navigator = navigator;
    this.now = now;
    this.newId = newId;
    /** @type {GameState | null} */
    this.state = null;
    link.onUpdate((ticket) => this.syncVisit(ticket));
  }

  /** @param {string} id */
  journey(id) {
    return this.journeys.find((j) => j.id === id) ?? null;
  }

  get currentJourney() {
    return this.state ? this.journey(this.state.journeyId) : null;
  }

  get step() {
    return this.state ? (this.currentJourney?.step(this.state.stepIndex) ?? null) : null;
  }

  /** @param {GameState} state */
  commit(state) {
    this.state = state;
    this.saves.save(state);
    return state;
  }

  /** @param {string} journeyId */
  newGame(journeyId) {
    const j = this.journey(journeyId);
    if (!j?.steps.length) throw new Error(`journey not available: ${journeyId}`);
    return this.commit(GameState.start(this.newId(), journeyId, this.now()));
  }

  /** @param {string} id */
  load(id) {
    const s = this.saves.get(id);
    if (!s || !this.journey(s.journeyId)) return null;
    this.state = s;
    return s;
  }

  listSaves() {
    return this.saves.list().filter((s) => this.journey(s.journeyId));
  }

  /** @param {string} id */
  deleteSave(id) {
    this.saves.remove(id);
    if (this.state?.id === id) this.state = null;
  }

  advance() {
    if (!this.state) throw new Error("no game");
    const j = /** @type {import("../domain/journey.js").Journey} */ (this.currentJourney);
    return this.commit(this.state.advance(j.steps.length, this.now()));
  }

  back() {
    if (!this.state) throw new Error("no game");
    return this.commit(this.state.back(this.now()));
  }

  /** Back to the start of the journey's steps (for "play again"). */
  restart() {
    if (!this.state) throw new Error("no game");
    return this.commit(this.state.with({ stepIndex: 0, finished: false, visiting: false, position: null }, this.now()));
  }

  /** The current stop in Street View: hand it to the extension if it's there
   * and leave for Google Maps. Resumes at the last saved position. */
  async openVisit() {
    const step = this.step;
    if (!this.state || step?.type !== StepType.VISIT || !step.stop) throw new Error("not at a stop");
    const { o, d } = step.stop;
    const state = this.commit(this.state.openVisit(this.now()));
    const hash = VISIT_HASH + state.id;
    // Coming back with the browser's Back button lands here too.
    this.navigator.setHash(hash);
    if (await this.link.detect()) {
      await this.link.start({
        slot: state.id,
        returnUrl: this.navigator.ownUrl(hash),
        origin: o,
        destination: d,
        resumeUrl: state.position?.url,
        position: state.position,
      });
      this.navigator.go(state.position?.url || routeUrl(o, d));
    } else {
      this.navigator.go(panoramaUrl(o, d));
    }
  }

  /** A move or the end of a visit, as the extension reports it.
   * @param {import("./ports.js").VisitTicket} ticket @returns {boolean} whether it was for this game */
  syncVisit(ticket) {
    if (!this.state || ticket.slot !== this.state.id) {
      const other = ticket.slot && this.saves.get(ticket.slot);
      // A visit of another saved game: keep its position in that save.
      if (other && ticket.position) this.saves.save(other.moveTo(ticket.position, this.now()));
      return false;
    }
    if (ticket.position) this.commit(this.state.moveTo(ticket.position, this.now()));
    return true;
  }

  /**
   * The game was opened with #visit=<id>: the player comes back from Street
   * View. @returns {Promise<"finished" | "returned" | null>} finished: the stop
   * was finished with L+R; returned: back without finishing; null: no such game
   */
  async returnFromVisit() {
    const h = this.navigator.hash;
    if (!h.startsWith(VISIT_HASH)) return null;
    const id = h.slice(VISIT_HASH.length);
    this.navigator.setHash("");
    if (!this.load(id)) return null;
    await this.link.detect();
    const ticket = this.link.pending;
    let finished = false;
    if (ticket && this.syncVisit(ticket)) {
      finished = !!ticket.finished;
      this.link.clear();
    }
    if (finished && this.step?.type === StepType.VISIT) {
      this.advance();
      return "finished";
    }
    return "returned";
  }
}
