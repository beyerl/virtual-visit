// Points on the map as "lat,lng" strings (the format Google Maps URLs use)
// and the little geometry the game needs.

const RAD = Math.PI / 180;

/** @param {string} s "lat,lng" @returns {{ lat: number, lng: number }} */
export function parsePoint(s) {
  const [lat, lng] = String(s).split(",").map(Number);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) throw new Error(`not a point: ${s}`);
  return { lat, lng };
}

/** Compass bearing (° clockwise from north) from one point to another.
 * @param {string} from @param {string} to */
export function bearing(from, to) {
  const a = parsePoint(from);
  const b = parsePoint(to);
  const y = Math.sin((b.lng - a.lng) * RAD) * Math.cos(b.lat * RAD);
  const x =
    Math.cos(a.lat * RAD) * Math.sin(b.lat * RAD) - Math.sin(a.lat * RAD) * Math.cos(b.lat * RAD) * Math.cos((b.lng - a.lng) * RAD);
  return Math.round((Math.atan2(y, x) / RAD + 360) % 360);
}
