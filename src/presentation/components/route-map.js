// A small SVG map of a ride: the network faintly, the ridden stretch in its
// line colour, stations labelled where there is room. Ported from the
// original page (reference/tokyo-with-hana.html).

import { define, esc } from "../base.js";

const KX = 90.4; // km per degree of longitude at Tokyo's latitude
const KY = 111; // km per degree of latitude
const W = 480;
const H = 270;

/** @typedef {{ line: string, n0: number, loop?: boolean, off: number, ids: string | string[], code?: Record<string, string> }} NetLine */

/** @param {Record<string, NetLine>} lines */
function prepare(lines) {
  for (const [prefix, L] of Object.entries(lines)) {
    if (Array.isArray(L.ids)) continue;
    L.ids = L.ids.split(" ");
    L.code = {};
    L.ids.forEach((id, k) => (/** @type {Record<string, string>} */ (L.code)[prefix + String(L.n0 + k).padStart(2, "0")] = id));
  }
}

/** @param {NetLine} L @param {string} a @param {string} b */
function routeIds(L, a, b) {
  const ids = /** @type {string[]} */ (L.ids);
  const n = ids.length;
  const ia = ids.indexOf(a);
  const ib = ids.indexOf(b);
  const out = [];
  if (L.loop) {
    const fwd = (ib - ia + n) % n;
    const dir = fwd <= n - fwd ? 1 : -1;
    const steps = dir > 0 ? fwd : n - fwd;
    for (let k = 0; k <= steps; k++) out.push(ids[(ia + dir * k + n) % n]);
    return out;
  }
  const d = ib >= ia ? 1 : -1;
  for (let k = ia; k !== ib + d; k += d) out.push(ids[k]);
  return out;
}

/** Shift a polyline sideways by d px (parallel tracks). @param {number[][]} pts @param {number} d */
function offset(pts, d) {
  if (!d) return pts;
  return pts.map((p, i) => {
    const a = pts[Math.max(0, i - 1)];
    const b = pts[Math.min(pts.length - 1, i + 1)];
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const l = Math.hypot(dx, dy) || 1;
    return [p[0] - (dy / l) * d, p[1] + (dx / l) * d];
  });
}

const pl = (/** @type {number[][]} */ pts) => pts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");

/**
 * @param {import("../../domain/journey.js").Ride} ride
 * @param {{ stations: Record<string, [number, number, string]>, lines: Record<string, NetLine> }} network
 * @param {(line: string) => string} color
 * @returns {string} SVG markup, or "" if the ride isn't on the map
 */
export function rideMapSvg(ride, network, color) {
  const { stations: S, lines } = network;
  prepare(lines);
  const pre = (/** @type {string} */ c) => (c.match(/^[A-Z]+/) || [""])[0];
  const L = lines[pre(ride.from[0])];
  if (!L || pre(ride.to[0]) !== pre(ride.from[0])) return "";
  const a = L.code?.[ride.from[0]];
  const b = L.code?.[ride.to[0]];
  if (!a || !b) return "";
  const km = (/** @type {string} */ id) => [(S[id][1] - 139.75) * KX, (35.68 - S[id][0]) * KY];
  const path = routeIds(L, a, b);
  const K = path.map(km);
  const pad = 0.9;
  let x0 = Math.min(...K.map((p) => p[0])) - pad;
  const x1 = Math.max(...K.map((p) => p[0])) + pad;
  let y0 = Math.min(...K.map((p) => p[1])) - pad;
  const y1 = Math.max(...K.map((p) => p[1])) + pad;
  let w = Math.max(x1 - x0, 3.4);
  let h = Math.max(y1 - y0, 1.9);
  if (w / h > W / H) h = w / (W / H);
  else w = h * (W / H);
  const cx = (x0 + x1) / 2;
  const cy = (y0 + y1) / 2;
  x0 = cx - w / 2;
  y0 = cy - h / 2;
  const s = W / w;
  const pt = (/** @type {string} */ id) => {
    const k = km(id);
    return [(k[0] - x0) * s, (k[1] - y0) * s];
  };
  const inView = (/** @type {number[]} */ p) => p[0] > -4 && p[0] < W + 4 && p[1] > -4 && p[1] < H + 4;
  let g = "";
  for (const Ln of Object.values(lines)) {
    const pts = /** @type {string[]} */ (Ln.ids).map(pt);
    if (Ln.loop) pts.push(pts[0]);
    g += `<polyline points="${pl(offset(pts, Ln.off))}" fill="none" stroke="${color(Ln.line)}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round" opacity="${Ln === L ? 0.45 : 0.28}"/>`;
  }
  const rp = offset(path.map(pt), L.off);
  g += `<polyline points="${pl(rp)}" fill="none" stroke="#3b2418" stroke-width="12" stroke-linejoin="round" stroke-linecap="round"/>`;
  g += `<polyline points="${pl(rp)}" fill="none" stroke="${color(L.line)}" stroke-width="8" stroke-linejoin="round" stroke-linecap="round"/>`;
  const all = [...new Set(Object.values(lines).flatMap((Ln) => /** @type {string[]} */ (Ln.ids)))];
  const visible = all.filter((id) => inView(pt(id)));
  /** @type {number[][]} */
  const boxes = visible.map((id) => {
    const p = pt(id);
    return [p[0] - 7, p[1] - 7, 14, 14];
  });
  const hit = (/** @type {number[]} */ bx) =>
    bx[0] < 2 || bx[1] < 2 || bx[0] + bx[2] > W - 2 || bx[1] + bx[3] > H - 2 ||
    boxes.some((o) => bx[0] < o[0] + o[2] && bx[0] + bx[2] > o[0] && bx[1] < o[1] + o[3] && bx[1] + bx[3] > o[1]);
  let labels = "";
  const place = (/** @type {string} */ id, /** @type {number} */ size, /** @type {number} */ weight, /** @type {string} */ cls, /** @type {boolean} */ force) => {
    const p = pt(id);
    const t = S[id][2];
    const tw = t.length * size * 0.56 + 4;
    const gap = size > 13 ? 12 : 9;
    /** @type {[number, number, string, number[]][]} */
    const cand = [
      [p[0] + gap, p[1] + size * 0.35, "start", [p[0] + gap, p[1] - size / 2, tw, size]],
      [p[0] - gap, p[1] + size * 0.35, "end", [p[0] - gap - tw, p[1] - size / 2, tw, size]],
      [p[0], p[1] - gap - 2, "middle", [p[0] - tw / 2, p[1] - gap - size, tw, size]],
      [p[0], p[1] + gap + size - 2, "middle", [p[0] - tw / 2, p[1] + gap - 2, tw, size]],
    ];
    let c = cand.find((c) => !hit(c[3]));
    if (!c) {
      if (!force) return;
      c = cand[0];
    }
    boxes.push(c[3]);
    labels += `<text class="${cls}" x="${c[0].toFixed(1)}" y="${c[1].toFixed(1)}" font-size="${size}" font-weight="${weight}" text-anchor="${c[2]}">${esc(t)}</text>`;
  };
  visible
    .filter((id) => !path.includes(id))
    .forEach((id) => {
      const p = pt(id);
      g += `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="3.5" fill="#fff" stroke="#b08a64" stroke-width="1.5"/>`;
    });
  path.forEach((id, k) => {
    const p = pt(id);
    const end = k === 0 || k === path.length - 1;
    g += end
      ? `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="9" fill="#fff" stroke="#3b2418" stroke-width="4"/>`
      : `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="4.5" fill="#fff" stroke="#3b2418" stroke-width="2"/>`;
  });
  place(path[0], 16, 800, "end-label", true);
  place(path[path.length - 1], 16, 800, "end-label", true);
  path.slice(1, -1).forEach((id) => place(id, 12, 600, "", false));
  visible.filter((id) => !path.includes(id)).forEach((id) => place(id, 11, 400, "ctx", false));
  labels += `<text x="${W - 14}" y="24" font-size="13" font-weight="800" text-anchor="end">N ↑</text>`;
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Map: ${esc(ride.name)} from ${esc(S[a][2])} to ${esc(S[b][2])}">${g}${labels}</svg>`;
}

export class VvRouteMap extends HTMLElement {
  /** @param {{ ride: import("../../domain/journey.js").Ride, journey: import("../../domain/journey.js").Journey }} p */
  show({ ride, journey }) {
    const net = /** @type {any} */ (journey).network;
    const svg = net ? rideMapSvg(ride, net, (line) => journey.lines[line]?.color ?? "#888") : "";
    this.innerHTML = svg;
    this.hidden = !svg;
  }
}

define("vv-route-map", VvRouteMap);
