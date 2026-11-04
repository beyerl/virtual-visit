import { GameState } from "../domain/game-state.js";
import { SaveRepository } from "../application/ports.js";

const KEY = "virtual-visit.saves.v1";

/** Saved games in localStorage, as one JSON object keyed by game id. */
export class LocalStorageSaves extends SaveRepository {
  /** @param {() => Storage} storage a getter: even reading `localStorage` can throw */
  constructor(storage) {
    super();
    this.storage = storage;
  }

  /** @returns {Record<string, import("../domain/game-state.js").GameStateData>} */
  read() {
    try {
      return JSON.parse(this.storage().getItem(KEY) || "{}") || {};
    } catch {
      return {};
    }
  }

  /** @param {Record<string, import("../domain/game-state.js").GameStateData>} all */
  write(all) {
    try {
      this.storage().setItem(KEY, JSON.stringify(all));
    } catch (e) {
      console.warn("[virtual-visit] could not save", e);
    }
  }

  list() {
    return Object.values(this.read())
      .flatMap((d) => {
        try {
          return [new GameState(d)];
        } catch {
          return [];
        }
      })
      .sort((a, b) => b.updatedAt - a.updatedAt);
  }

  get(/** @type {string} */ id) {
    const d = this.read()[id];
    return d ? new GameState(d) : null;
  }

  save(/** @type {GameState} */ state) {
    const all = this.read();
    all[state.id] = state.toJSON();
    this.write(all);
  }

  remove(/** @type {string} */ id) {
    const all = this.read();
    delete all[id];
    this.write(all);
  }
}
