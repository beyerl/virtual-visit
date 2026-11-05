// Prints, as JSON, every speech-bubble line of a guide (default: hana): the
// day intros, ride and walk talks and wrap-ups of their journeys, and the
// lines the guide says at every stop. tools/voice/generate.py voices them.
//
//   node tools/voice/lines.mjs hana

import { JOURNEYS } from "../../src/content/journeys.js";
import { VISIT_LINES } from "../../src/content/visit-lines.js";

const guide = process.argv[2] ?? "hana";
const journeys = JOURNEYS.filter((j) => /** @type {any} */ (j).guide?.id === guide);
if (!journeys.length) {
  console.error(`No journey has the guide "${guide}".`);
  process.exit(1);
}
const lines = new Set([...journeys.flatMap((j) => j.steps.flatMap((s) => s.lines)), ...Object.values(VISIT_LINES)]);
console.log(JSON.stringify({ guide, lines: [...lines] }, null, 1));
