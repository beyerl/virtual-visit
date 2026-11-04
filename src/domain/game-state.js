// A saved game (entity, identified by `id`): which journey, how far along,
// and, while a stop is being visited in Street View, where the player stands.
// Immutable: every change returns a new state, so the repository can save it.

/**
 * @typedef {{ lat: number, lng: number, heading?: number, url?: string }} Position  the last Street View location
 * @typedef {{ id: string, journeyId: string, stepIndex: number, visiting: boolean, position: Position | null,
 *             finished: boolean, createdAt: number, updatedAt: number }} GameStateData
 */

export class GameState {
  /** @param {GameStateData} data */
  constructor({ id, journeyId, stepIndex = 0, visiting = false, position = null, finished = false, createdAt, updatedAt }) {
    if (!id || !journeyId) throw new Error("a game needs an id and a journey");
    this.id = id;
    this.journeyId = journeyId;
    this.stepIndex = stepIndex;
    this.visiting = visiting;
    this.position = position;
    this.finished = finished;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt ?? createdAt;
    Object.freeze(this);
  }

  /** @param {string} id @param {string} journeyId @param {number} now */
  static start(id, journeyId, now) {
    return new GameState({ id, journeyId, stepIndex: 0, createdAt: now, updatedAt: now });
  }

  /** @param {Partial<GameStateData>} changes @param {number} now */
  with(changes, now) {
    return new GameState({ ...this.toJSON(), ...changes, updatedAt: now });
  }

  /** On to the next step; the last one finishes the game. @param {number} stepCount @param {number} now */
  advance(stepCount, now) {
    const last = this.stepIndex >= stepCount - 1;
    return this.with(
      { stepIndex: last ? this.stepIndex : this.stepIndex + 1, visiting: false, position: null, finished: last },
      now,
    );
  }

  /** Street View was opened for the current stop. @param {number} now */
  openVisit(now) {
    return this.with({ visiting: true }, now);
  }

  /** The player moved in Street View. @param {Position} position @param {number} now */
  moveTo(position, now) {
    return this.with({ position: { ...position } }, now);
  }

  /** @returns {GameStateData} */
  toJSON() {
    const { id, journeyId, stepIndex, visiting, position, finished, createdAt, updatedAt } = this;
    return { id, journeyId, stepIndex, visiting, position, finished, createdAt, updatedAt };
  }
}
