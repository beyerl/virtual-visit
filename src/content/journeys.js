// All journeys on offer. Only available ones can be started; the others are
// shown as "coming soon".

import { Journey } from "../domain/journey.js";
import { TOKYO } from "./tokyo.js";
import { LINES, STATIONS } from "./tokyo-network.js";

const SOON = { available: false, days: [], wrapUp: [], lines: {}, guide: "", tagline: "Coming soon" };

export const JOURNEYS = [
  new Journey({ ...TOKYO, network: { stations: STATIONS, lines: LINES } }),
  new Journey({ ...SOON, id: "kyoto", title: "Kyoto", jp: "京都" }),
  new Journey({ ...SOON, id: "paris", title: "Paris", jp: "パリ" }),
];
