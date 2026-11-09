// Background music: one track at a time, looped with Web Audio, faded in and
// out. Browsers only start sound after a click or a key press on the page
// (gamepad presses don't count), so it begins then.

const FADE_IN = 1.2;
const FADE_OUT = 0.6;

/** @typedef {{ src: string, volume?: number, loopStart?: number }} Track  loopStart: seconds of encoder silence to skip when looping */
/** @typedef {{ track: Track, gain: GainNode, source: AudioBufferSourceNode | null }} Voice */

export class MenuMusic {
  /**
   * @param {Window} window
   * @param {{ load(): unknown, save(data: unknown): void }} store remembers whether the music is on
   */
  constructor(window, store) {
    this.window = window;
    this.store = store;
    this.enabled = store.load() !== false;
    /** @type {Track | null} what this screen wants */
    this.track = null;
    /** @type {AudioContext | null} */
    this.ctx = null;
    /** @type {Map<string, Promise<AudioBuffer | null>>} */
    this.buffers = new Map();
    /** @type {Voice | null} */
    this.voice = null;
    const unlock = () => {
      if (this.ctx?.state === "suspended") this.ctx.resume().catch(() => {});
    };
    window.addEventListener("keydown", unlock);
    window.addEventListener("pointerdown", unlock);
  }

  /** The screen changed. The same track plays on. @param {Track | null} track */
  play(track) {
    this.track = track;
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
    const audible = this.voice?.source && this.ctx?.state === "running";
    this.play(null);
    return audible ? new Promise((resolve) => this.window.setTimeout(resolve, FADE_OUT * 1000)) : Promise.resolve();
  }

  update() {
    const wanted = this.enabled ? this.track : null;
    if (wanted?.src === this.voice?.track.src) return;
    this.stop();
    if (wanted) this.start(wanted);
  }

  /** @param {string} src @param {AudioContext} ctx */
  buffer(src, ctx) {
    let buffer = this.buffers.get(src);
    if (!buffer) {
      buffer = this.window
        .fetch(src)
        .then((r) => (r.ok ? r.arrayBuffer() : Promise.reject(new Error(`${r.status}`))))
        .then((data) => ctx.decodeAudioData(data))
        .catch((e) => {
          console.warn("[virtual-visit] music", src, e);
          return null;
        });
      this.buffers.set(src, buffer);
    }
    return buffer;
  }

  /** @param {Track} track */
  async start(track) {
    if (!this.ctx) {
      const AC = /** @type {typeof AudioContext | undefined} */ (/** @type {any} */ (this.window).AudioContext ?? /** @type {any} */ (this.window).webkitAudioContext);
      if (!AC) return;
      this.ctx = new AC();
    }
    const ctx = this.ctx;
    const gain = ctx.createGain();
    gain.connect(ctx.destination);
    /** @type {Voice} */
    const voice = { track, gain, source: null };
    this.voice = voice;
    const buffer = await this.buffer(track.src, ctx);
    if (this.voice !== voice || !buffer) return; // changed meanwhile, or no track
    const source = ctx.createBufferSource();
    voice.source = source;
    source.buffer = buffer;
    source.loop = true;
    source.loopStart = track.loopStart ?? 0;
    source.loopEnd = buffer.duration;
    source.connect(gain);
    source.onended = () => gain.disconnect();
    const now = ctx.currentTime;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(track.volume ?? 0.4, now + FADE_IN);
    source.start(now, source.loopStart);
  }

  stop() {
    const voice = this.voice;
    this.voice = null;
    if (!voice?.source || !this.ctx) return; // never started
    const now = this.ctx.currentTime;
    voice.gain.gain.cancelScheduledValues(now);
    voice.gain.gain.setValueAtTime(voice.gain.gain.value, now);
    voice.gain.gain.linearRampToValueAtTime(0, now + FADE_OUT);
    voice.source.stop(now + FADE_OUT);
  }
}
