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
import { RIDE_ROUTES } from "./ride-routes.js";
import { STOP_IMAGES } from "./stop-images.js";
import { TOKYO } from "./tokyo.js";
import { LINES, STATIONS } from "./tokyo-network.js";
import { ULAANBAATAR } from "./ulaanbaatar.js";

/**
 * The journey's data with a photo on every stop that has one
 * (images/stops/<journey>/<leg>.webp, credits in stop-images.js), and the
 * route of every ride that has one (ride-routes.js), for the ride maps.
 * @template {{ id: string, days: import("../domain/journey.js").Day[] }} T @param {T} data @returns {T}
 */
const withExtras = (data) => {
  const routes = RIDE_ROUTES[data.id] ?? {};
  /** @param {import("../domain/journey.js").Ride[]} rides @param {string} prefix */
  const routed = (rides, prefix) => rides.map((r, i) => (routes[`${prefix}:${i}`] ? { ...r, route: routes[`${prefix}:${i}`] } : r));
  return {
    ...data,
    days: data.days.map((day) => ({
      ...day,
      ...(day.home ? { home: { ...day.home, rides: routed(day.home.rides, `${day.id}:home`) } } : {}),
      legs: day.legs.map((leg) => {
        const credit = STOP_IMAGES[data.id]?.[leg.id];
        return {
          ...leg,
          ...(leg.rides ? { rides: routed(leg.rides, leg.id) } : {}),
          stop: credit ? { ...leg.stop, image: { src: `images/stops/${data.id}/${leg.id}.webp`, ...credit } } : leg.stop,
        };
      }),
    })),
  };
};

export const JOURNEYS = [
  { ...TOKYO, network: { stations: STATIONS, lines: LINES } },
  BEIJING,
  MOSCOW,
  BOGOTA,
  RIO,
  NEW_YORK,
  ULAANBAATAR,
  CAPE_TOWN,
  CAIRO,
  NAIROBI,
  KINGSTON,
].map((data) => new Journey(withExtras(data)));
