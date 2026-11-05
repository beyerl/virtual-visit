// A guide's recorded voice: one audio file per speech-bubble line, named by a
// hash of the line's text (tools/voice/generate.py makes them, with the same
// hash). A changed line gets a new name, so it is never played with old audio.

/**
 * FNV-1a (32 bit) of the line's UTF-8 bytes, as 8 hex digits.
 * @param {string} line @returns {string}
 */
export function voiceKey(line) {
  let h = 0x811c9dc5;
  for (const byte of new TextEncoder().encode(line)) {
    h ^= byte;
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, "0");
}

/**
 * The audio file for a line, if the guide has a voice and that line was
 * recorded. @param {{ dir: string, keys: ReadonlySet<string> } | undefined} voice
 * @param {string} line @returns {string | null}
 */
export function voiceFile(voice, line) {
  if (!voice) return null;
  const key = voiceKey(line);
  return voice.keys.has(key) ? `${voice.dir}/${key}.mp3` : null;
}
