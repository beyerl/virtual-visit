// All journeys on offer, in the order of the journey select screen. A journey
// with `available: false` would be shown as "coming soon".

import { Journey } from "../domain/journey.js";
import { BEIJING } from "./beijing.js";
import { BOGOTA } from "./bogota.js";
import { CAIRO } from "./cairo.js";
import { CAPE_TOWN } from "./cape-town.js";
import { KINGSTON } from "./kingston.js";
import { MOSCOW } from "./moscow.js";
import { NAIROBI } from "./nairobi.js";
import { NEW_YORK } from "./new-york.js";
import { RIO } from "./rio.js";
import { TOKYO } from "./tokyo.js";
import { LINES, STATIONS } from "./tokyo-network.js";
import { ULAANBAATAR } from "./ulaanbaatar.js";

export const JOURNEYS = [
  new Journey({ ...TOKYO, network: { stations: STATIONS, lines: LINES } }),
  new Journey(BEIJING),
  new Journey(MOSCOW),
  new Journey(BOGOTA),
  new Journey(RIO),
  new Journey(NEW_YORK),
  new Journey(ULAANBAATAR),
  new Journey(CAPE_TOWN),
  new Journey(CAIRO),
  new Journey(NAIROBI),
  new Journey(KINGSTON),
];
