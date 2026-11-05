// A journey (aggregate root) is a city trip of days. Each day is a series of
// legs: get somewhere (by train, or on foot) and look around a stop in
// Street View. The itinerary flattens that into the steps the game plays.

export const StepType = Object.freeze({
  DAY_INTRO: "dayIntro",
  RIDE: "ride", // train video(s) with the guide talking
  WALK: "walk", // no train: the guide talks while we walk over
  VISIT: "visit", // Street View at a stop
  DAY_WRAP_UP: "dayWrapUp",
  JOURNEY_WRAP_UP: "journeyWrapUp",
});

/**
 * @typedef {{ id: string, start?: number, end?: number }} Video  a YouTube video, optionally cut to [start, end) seconds
 * @typedef {[number, number, string?]} RoutePoint  lat, lng, and a station name where the ride stops
 * @typedef {{ line: string, name: string, from: [string, string], to: [string, string], mins: string, video: Video, route?: RoutePoint[] }} Ride
 * @typedef {{ kind: "sight" | "dinner", name: string, jp: string, text: string, walkLabel: string, mins: number,
 *             o: string, d: string, tip?: string, cuisine?: string, image?: StopImage }} Stop
 * @typedef {{ src: string, file: string, author: string, license: string, page: string }} StopImage  a photo of the stop, with its credit
 * @typedef {{ id: string, rides?: Ride[], hana: string[], stop: Stop }} Leg
 * @typedef {{ rides: Ride[], hana: string[] }} HomeRide
 * @typedef {{ id: string, num: string, title: string, intro: string[], legs: Leg[], home?: HomeRide, wrapUp: string[] }} Day
 * @typedef {{ id: string, day: number, type: string, lines: readonly string[], leg?: number, stop?: Stop, rides?: Ride[] }} Step
 */

/** Seconds the D-pad skips forward or back in a ride video. */
export const SEEK_STEP = 30;

/**
 * Where to jump in a ride video: `delta` seconds from `now`, kept inside the
 * cut. Past the end means the ride is over (null).
 * @param {Video} video @param {number} now current time @param {number} delta
 * @param {number} [duration] the whole video's length, when the cut has no end
 * @returns {number | null}
 */
export function seekTarget(video, now, delta, duration) {
  const start = video.start ?? 0;
  const end = video.end ?? duration ?? Infinity;
  const t = now + delta;
  if (t >= end - 1) return null;
  return Math.max(start, t);
}

export class Journey {
  /**
   * @param {{ id: string, title: string, jp: string, tagline: string, guide: string, available: boolean,
   *           lines: Record<string, { name: string, color: string }>, days: Day[], wrapUp: string[] }} data
   */
  constructor(data) {
    Object.assign(this, data);
    /** @type {string} */ this.id = data.id;
    /** @type {Day[]} */ this.days = data.days;
    /** @type {Record<string, { name: string, color: string }>} */ this.lines = data.lines;
    /** @type {readonly Step[]} */
    this.steps = Object.freeze(data.available ? buildItinerary(data) : []);
  }

  /** @param {number} i */
  step(i) {
    return this.steps[i] ?? null;
  }

  /** @param {string} stepId */
  indexOf(stepId) {
    return this.steps.findIndex((s) => s.id === stepId);
  }

  /** Line colour (CSS) of a ride. @param {Ride} ride */
  color(ride) {
    return this.lines[ride.line]?.color ?? "#888";
  }

  /** All stops of a day, in order. @param {number} day */
  stopsOf(day) {
    return this.days[day].legs.map((l) => l.stop);
  }

  /** All rides of a day, including the ride home. @param {number} day */
  ridesOf(day) {
    const d = this.days[day];
    return [...d.legs.flatMap((l) => l.rides ?? []), ...(d.home?.rides ?? [])];
  }
}

/** @param {{ days: Day[], wrapUp: string[] }} journey @returns {Step[]} */
export function buildItinerary(journey) {
  /** @type {Step[]} */
  const steps = [];
  journey.days.forEach((day, di) => {
    steps.push({ id: `${day.id}:intro`, type: StepType.DAY_INTRO, day: di, lines: day.intro });
    day.legs.forEach((leg, li) => {
      const at = { day: di, leg: li, stop: leg.stop };
      steps.push(
        leg.rides?.length
          ? { id: `${day.id}:${leg.id}:ride`, type: StepType.RIDE, ...at, rides: leg.rides, lines: leg.hana }
          : { id: `${day.id}:${leg.id}:walk`, type: StepType.WALK, ...at, lines: leg.hana },
      );
      steps.push({ id: `${day.id}:${leg.id}:visit`, type: StepType.VISIT, ...at, lines: [] });
    });
    if (day.home) steps.push({ id: `${day.id}:home`, type: StepType.RIDE, day: di, rides: day.home.rides, lines: day.home.hana });
    steps.push({ id: `${day.id}:wrap`, type: StepType.DAY_WRAP_UP, day: di, lines: day.wrapUp });
  });
  steps.push({ id: "wrap", type: StepType.JOURNEY_WRAP_UP, day: journey.days.length - 1, lines: journey.wrapUp });
  return steps;
}
