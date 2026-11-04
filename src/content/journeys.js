// All journeys on offer. Only available ones can be started; the others are
// shown as "coming soon".

import { Journey } from "../domain/journey.js";
import { BEIJING } from "./beijing.js";
import { MOSCOW } from "./moscow.js";
import { TOKYO } from "./tokyo.js";
import { LINES, STATIONS } from "./tokyo-network.js";

const SOON = { available: false, days: [], wrapUp: [], lines: {}, guide: null, tagline: "Coming soon" };

export const JOURNEYS = [
  new Journey({ ...TOKYO, network: { stations: STATIONS, lines: LINES } }),
  new Journey(BEIJING),
  new Journey(MOSCOW),
  new Journey({ ...SOON, id: "paris", title: "Paris", jp: "パリ" }),
];
