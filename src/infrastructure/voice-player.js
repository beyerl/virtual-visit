// Plays the guide's recorded lines, one at a time. Starting a line or
// stopping cuts off the one before. Browsers only play sound after the page
// got a click or a key press; until then the lines stay silent.

export class VoicePlayer {
  /** @param {{ onStart?: () => void, onEnd?: () => void }} [on] */
  constructor(on = {}) {
    this.on = on;
    /** @type {HTMLAudioElement | null} */
    this.audio = null;
  }

  get playing() {
    return !!this.audio;
  }

  /** @param {string} src */
  play(src) {
    this.stop();
    const audio = new Audio(src);
    this.audio = audio;
    const done = () => {
      if (this.audio !== audio) return;
      this.audio = null;
      this.on.onEnd?.();
    };
    audio.addEventListener("ended", done);
    audio.addEventListener("error", done);
    audio.play().then(
      () => this.audio === audio && this.on.onStart?.(),
      done, // not allowed yet (no click or key press so far), or no file
    );
  }

  stop() {
    const audio = this.audio;
    if (!audio) return;
    this.audio = null;
    audio.pause();
    audio.removeAttribute("src");
    audio.load(); // let go of the download
    this.on.onEnd?.();
  }
}
