// Talks to the Street View Gamepad extension, whose content script runs on
// this page, with window.postMessage:
//
//   game -> extension  { source: "virtual-visit", type: "vv-hello" | "vv-start" | "vv-clear", ticket? }
//   extension -> game  { source: "sv-gamepad-visit", type: "vv-state", ticket, version }
//                      { source: "sv-gamepad-visit", type: "vv-started" }
//
// "vv-state" answers "vv-hello" and is sent again whenever the stored visit
// changes (each Street View move is stored by the extension right away).

import { VisitLink } from "../application/ports.js";

const OURS = "virtual-visit";
const THEIRS = "sv-gamepad-visit";
const DETECT_TIMEOUT = 700;
const START_TIMEOUT = 1500;

export class ExtensionVisitLink extends VisitLink {
  /** @param {Window} window */
  constructor(window) {
    super();
    this.window = window;
    /** @type {import("../application/ports.js").VisitTicket | null} */
    this.ticket = null;
    /** @type {string | null} */
    this.version = null;
    /** @type {((t: import("../application/ports.js").VisitTicket) => void)[]} */
    this.listeners = [];
    /** @type {Map<string, (() => void)[]>} */
    this.waiting = new Map();
    /** @type {Promise<boolean> | null} */
    this.detecting = null;
    window.addEventListener("message", (e) => {
      if (e.source !== window || e.data?.source !== THEIRS) return;
      const { type } = e.data;
      if (type === "vv-state") {
        this.version = e.data.version ?? "?";
        this.ticket = e.data.ticket ?? null;
        if (this.ticket) for (const fn of this.listeners) fn(this.ticket);
      }
      for (const fn of this.waiting.get(type) ?? []) fn();
      this.waiting.delete(type);
    });
  }

  /** @param {string} type @param {Record<string, unknown>} [payload] */
  post(type, payload = {}) {
    this.window.postMessage({ source: OURS, type, ...payload }, this.window.location.origin);
  }

  /** @param {string} type @param {number} ms @returns {Promise<boolean>} whether it came in time */
  waitFor(type, ms) {
    return new Promise((resolve) => {
      const timer = setTimeout(() => resolve(false), ms);
      const list = this.waiting.get(type) ?? [];
      list.push(() => {
        clearTimeout(timer);
        resolve(true);
      });
      this.waiting.set(type, list);
    });
  }

  get available() {
    return this.version != null;
  }

  async detect() {
    if (this.available) return true;
    this.detecting ??= (async () => {
      const answered = this.waitFor("vv-state", DETECT_TIMEOUT);
      this.post("vv-hello");
      return answered;
    })();
    return this.detecting;
  }

  get pending() {
    return this.ticket;
  }

  async start(/** @type {import("../application/ports.js").VisitTicket} */ ticket) {
    const started = this.waitFor("vv-started", START_TIMEOUT);
    this.post("vv-start", { ticket });
    await started;
  }

  clear() {
    this.ticket = null;
    this.post("vv-clear");
  }

  onUpdate(/** @type {(t: import("../application/ports.js").VisitTicket) => void} */ fn) {
    this.listeners.push(fn);
  }
}
