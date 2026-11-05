// The guide with a speech bubble (attribute `guide`: a guide id, see guide.js). Lines appear letter by letter; A shows the
// whole line at once, or goes on to the next one. Fires "dialogue-end" after
// the last line.
//
// A guide with a recorded voice (content/voices.js) says each line while its
// bubble is shown; going on to the next bubble, or skipping, stops it. While
// the voice speaks, "voice-start" and "voice-end" fire (rides turn the video
// down).

import { Dialogue } from "../../domain/dialogue.js";
import { voiceFile } from "../../domain/voice.js";
import { VOICES } from "../../content/voices.js";
import { VoicePlayer } from "../../infrastructure/voice-player.js";
import { define, lineHtml } from "../base.js";
import "./guide.js";

const TYPE_MS = 22;

export class VvSpeech extends HTMLElement {
  constructor() {
    super();
    this.dialogue = new Dialogue([]);
    this.timer = 0;
    this.typing = false;
    this.voice = new VoicePlayer({
      onStart: () => this.dispatchEvent(new CustomEvent("voice-start", { bubbles: true })),
      onEnd: () => this.dispatchEvent(new CustomEvent("voice-end", { bubbles: true })),
    });
  }

  connectedCallback() {
    if (this.firstElementChild) return;
    this.innerHTML = `
      <vv-guide who="${this.getAttribute("guide") || "hana"}"></vv-guide>
      <div class="bubble" hidden><div class="bubble-text"></div><div class="bubble-more" aria-hidden="true">▼</div></div>`;
  }

  disconnectedCallback() {
    clearInterval(this.timer);
    this.voice.stop();
  }

  get guide() {
    return /** @type {import("./guide.js").VvGuide} */ (this.querySelector("vv-guide"));
  }

  get bubble() {
    return /** @type {HTMLElement} */ (this.querySelector(".bubble"));
  }

  get done() {
    return this.dialogue.done;
  }

  /** @param {readonly string[]} lines */
  play(lines) {
    this.connectedCallback();
    this.dialogue = new Dialogue(lines);
    this.show();
  }

  show() {
    clearInterval(this.timer);
    const line = this.dialogue.current;
    this.speak(line);
    if (line == null) {
      this.bubble.hidden = true;
      this.guide.talking = false;
      this.typing = false;
      this.dispatchEvent(new CustomEvent("dialogue-end", { bubbles: true }));
      return;
    }
    const text = /** @type {HTMLElement} */ (this.querySelector(".bubble-text"));
    text.innerHTML = lineHtml(line);
    this.bubble.hidden = false;
    this.bubble.classList.remove("pop");
    void this.bubble.offsetWidth; // restart the pop-in animation
    this.bubble.classList.add("pop");
    this.bubble.classList.toggle("last", this.dialogue.isLast);
    // Typewriter: reveal the text nodes' characters one by one.
    const nodes = /** @type {Text[]} */ ([]);
    const walker = document.createTreeWalker(text, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) nodes.push(/** @type {Text} */ (walker.currentNode));
    const full = nodes.map((n) => n.data);
    nodes.forEach((n) => (n.data = ""));
    let ni = 0;
    let ci = 0;
    this.typing = true;
    this.guide.talking = true;
    this.finishTyping = () => {
      clearInterval(this.timer);
      nodes.forEach((n, i) => (n.data = full[i]));
      this.typing = false;
      this.guide.talking = false;
      this.bubble.classList.add("typed");
    };
    this.bubble.classList.remove("typed");
    this.timer = window.setInterval(() => {
      if (ni >= nodes.length) return this.finishTyping();
      nodes[ni].data = full[ni].slice(0, ++ci);
      if (ci >= full[ni].length) {
        ni++;
        ci = 0;
      }
    }, TYPE_MS);
  }

  /** Say the line in the guide's voice, if it was recorded; stop the line before. @param {string | null} line */
  speak(line) {
    const file = line == null ? null : voiceFile(VOICES[this.getAttribute("guide") || "hana"], line);
    if (file) this.voice.play(file);
    else this.voice.stop();
  }

  /** @type {() => void} */
  finishTyping = () => {};

  /** A pressed: finish the line, or on to the next. @returns {boolean} whether a line is still showing */
  advance() {
    if (this.dialogue.done) return false;
    if (this.typing) {
      this.finishTyping();
      return true;
    }
    this.dialogue.next();
    this.show();
    return !this.dialogue.done;
  }

  /** Skip every remaining line. */
  skipAll() {
    this.dialogue.skip();
    this.show();
  }
}

define("vv-speech", VvSpeech);
