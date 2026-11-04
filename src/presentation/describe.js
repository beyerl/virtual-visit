// Short human descriptions of where a game is, for the load screen and HUD.

import { StepType } from "../domain/journey.js";

/** @param {import("../domain/journey.js").Journey} journey @param {import("../domain/journey.js").Step | null} step */
export function describeStep(journey, step) {
  if (!step) return "";
  const day = journey.days[step.day];
  switch (step.type) {
    case StepType.DAY_INTRO:
      return `${day.num} · ${day.title}`;
    case StepType.RIDE:
      return step.stop ? `${day.num} · riding to ${step.stop.name}` : `${day.num} · riding home`;
    case StepType.WALK:
      return `${day.num} · walking to ${step.stop?.name}`;
    case StepType.VISIT:
      return `${day.num} · ${step.stop?.name}`;
    case StepType.DAY_WRAP_UP:
      return `${day.num} · done for the day`;
    case StepType.JOURNEY_WRAP_UP:
      return "Journey complete";
    default:
      return "";
  }
}

/** @param {number} t */
export function formatDate(t) {
  return new Date(t).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

/** "Stop 4 of 18" @param {import("../domain/journey.js").Journey} journey @param {number} stepIndex */
export function progress(journey, stepIndex) {
  const visits = journey.steps.filter((s) => s.type === StepType.VISIT);
  const done = journey.steps.slice(0, stepIndex).filter((s) => s.type === StepType.VISIT).length;
  return { done, total: visits.length, pct: Math.round((stepIndex / Math.max(1, journey.steps.length - 1)) * 100) };
}
