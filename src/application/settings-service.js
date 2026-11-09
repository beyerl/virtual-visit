// The settings shared with the Street View Gamepad extension. localStorage
// holds them and is the single source of truth once the game has them; the
// extension mirrors them for its own pages, which can't read this site's
// storage. Each side stamps its changes and the newer side wins, so a change
// made in the extension's popup while the game was closed still arrives.

import { assignAction, defaultSettings, normalizeSettings, PRESETS } from "../domain/settings.js";

/** Between a change and telling the extension (its storage limits writes per minute). */
const PUSH_DELAY = 400;

/** @typedef {import("../domain/settings.js").Settings} Settings */

export class SettingsService {
  /**
   * @param {{ store: { load(): any, save(data: unknown): void }, link: import("./ports.js").VisitLink,
   *           now: () => number, defer?: (fn: () => void) => void }} deps
   */
  constructor({ store, link, now, defer = (fn) => setTimeout(fn, PUSH_DELAY) }) {
    this.store = store;
    this.link = link;
    this.now = now;
    this.defer = defer;
    const saved = store.load();
    /** Whether localStorage has them yet: the extension's are taken over until then. */
    this.saved = !!saved;
    /** @type {Settings} */
    this.values = normalizeSettings(saved?.settings);
    /** @type {number} */
    this.updatedAt = saved?.updatedAt ?? 0;
    this.pushing = false;
    /** @type {(() => void) | null} a screen showing them */
    this.onChange = null;
  }

  /** Listen to the extension and ask it for its settings. */
  connect() {
    this.link.onSettings((remote) => this.receive(remote));
    this.link.detect();
  }

  /** @param {{ settings: unknown, updatedAt: number }} remote */
  receive({ settings, updatedAt }) {
    if (!this.saved || updatedAt > this.updatedAt) {
      this.values = normalizeSettings(settings);
      this.updatedAt = updatedAt;
      this.save();
      this.onChange?.();
    } else if (updatedAt < this.updatedAt) this.push();
  }

  save() {
    this.saved = true;
    this.store.save({ settings: this.values, updatedAt: this.updatedAt });
  }

  push() {
    if (this.pushing) return;
    this.pushing = true;
    this.defer(() => {
      this.pushing = false;
      this.link.pushSettings(this.values, this.updatedAt);
    });
  }

  /** A change made here. @param {Partial<Settings>} changes */
  change(changes) {
    this.values = { ...this.values, ...changes };
    this.updatedAt = Math.max(this.now(), this.updatedAt + 1);
    this.save();
    this.push();
    this.onChange?.();
  }

  /** @param {string} presetId */
  applyPreset(presetId) {
    const preset = PRESETS.find((p) => p.id === presetId);
    if (preset) this.change({ buttonMap: { ...preset.map } });
  }

  /** @param {string} action @param {import("../domain/settings.js").ActionBinding} binding */
  assign(action, binding) {
    this.change({ buttonMap: assignAction(this.values.buttonMap, action, binding) });
  }

  reset() {
    this.change(defaultSettings());
  }
}
