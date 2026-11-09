// Background music for the menus and journeys: one track, looped seamlessly with Web
// Audio, faded in and out. Browsers only start sound after a click or a key
// press on the page (gamepad presses don't count), so it begins then.

const FADE_IN = 1.2;
const FADE_OUT = 0.6;

export class MenuMusic {
  /**
   * @param {Window} window
   * @param {{ src: string, volume?: number, loopStart?: number }} track loopStart: seconds of encoder silence to skip when looping
   * @param {{ load(): unknown, save(data: unknown): void }} store remembers whether the music is on
   */
  constructor(window, track, store) {
    this.window = window;
    this.track = track;
    this.store = store;
    this.enabled = store.load() !== false;
    this.wanted = false;
    /** @type {AudioContext | null} */
    this.ctx = null;
    /** @type {GainNode | null} */
    this.gain = null;
    /** @type {Promise<AudioBuffer | null> | null} */
    this.buffer = null;
    /** @type {AudioBufferSourceNode | null} */
    this.source = null;
    const unlock = () => {
      if (this.ctx?.state === "suspended") this.ctx.resume().catch(() => {});
    };
    window.addEventListener("keydown", unlock);
    window.addEventListener("pointerdown", unlock);
  }

  /** The screen changed: does this one have music? @param {boolean} wanted */
  setWanted(wanted) {
    this.wanted = wanted;
    this.update();
  }

  /** X on a screen with music. @returns {boolean} whether the music is on now */
  toggle() {
    this.enabled = !this.enabled;
    this.store.save(this.enabled);
    this.update();
    return this.enabled;
  }

  /** Fade out and wait for it, before leaving the page. @returns {Promise<void>} */
  fadeOut() {
    const audible = this.source?.buffer && this.ctx?.state === "running";
    this.setWanted(false);
    return audible ? new Promise((resolve) => this.window.setTimeout(resolve, FADE_OUT * 1000)) : Promise.resolve();
  }

  update() {
    if (this.enabled && this.wanted) this.start();
    else this.stop();
  }

  async start() {
    if (this.source) return;
    if (!this.ctx) {
      const AC = /** @type {typeof AudioContext | undefined} */ (/** @type {any} */ (this.window).AudioContext ?? /** @type {any} */ (this.window).webkitAudioContext);
      if (!AC) return;
      this.ctx = new AC();
      this.gain = this.ctx.createGain();
      this.gain.connect(this.ctx.destination);
      this.buffer = fetch(this.track.src)
        .then((r) => (r.ok ? r.arrayBuffer() : Promise.reject(new Error(`${r.status}`))))
        .then((data) => /** @type {AudioContext} */ (this.ctx).decodeAudioData(data))
        .catch((e) => {
          console.warn("[virtual-visit] menu music", e);
          return null;
        });
    }
    const ctx = this.ctx;
    const gain = /** @type {GainNode} */ (this.gain);
    const source = ctx.createBufferSource();
    this.source = source;
    const buffer = await this.buffer;
    if (this.source !== source || !buffer) return; // stopped meanwhile, or no track
    source.buffer = buffer;
    source.loop = true;
    source.loopStart = this.track.loopStart ?? 0;
    source.loopEnd = buffer.duration;
    source.connect(gain);
    const now = ctx.currentTime;
    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(this.track.volume ?? 0.4, now + FADE_IN);
    source.start(now, source.loopStart);
  }

  stop() {
    const source = this.source;
    if (!source) return;
    this.source = null;
    if (!source.buffer || !this.ctx || !this.gain) return; // never started
    const now = this.ctx.currentTime;
    this.gain.gain.cancelScheduledValues(now);
    this.gain.gain.setValueAtTime(this.gain.gain.value, now);
    this.gain.gain.linearRampToValueAtTime(0, now + FADE_OUT);
    source.stop(now + FADE_OUT);
  }
}
