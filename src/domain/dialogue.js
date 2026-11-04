// What the guide says on a screen: a list of speech bubbles, shown one at a time.

export class Dialogue {
  /** @param {readonly string[]} lines */
  constructor(lines = []) {
    this.lines = Object.freeze([...lines]);
    this.index = 0;
  }

  /** The bubble on screen, or null once all were shown. */
  get current() {
    return this.index < this.lines.length ? this.lines[this.index] : null;
  }

  get done() {
    return this.index >= this.lines.length;
  }

  get isLast() {
    return this.index === this.lines.length - 1;
  }

  /** Go to the next bubble. @returns {boolean} whether there is one */
  next() {
    if (!this.done) this.index++;
    return !this.done;
  }

  /** Skip all remaining bubbles. */
  skip() {
    this.index = this.lines.length;
  }
}

/**
 * A line split into plain text and highlighted (Japanese) parts: "{Konnichiwa!} I'm Hana"
 * → [{ text: "Konnichiwa!", jp: true }, { text: " I'm Hana", jp: false }].
 * @param {string} line @returns {{ text: string, jp: boolean }[]}
 */
export function lineParts(line) {
  return line
    .split(/(\{[^}]*\})/)
    .filter(Boolean)
    .map((p) => (p.startsWith("{") && p.endsWith("}") ? { text: p.slice(1, -1), jp: true } : { text: p, jp: false }));
}
