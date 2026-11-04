// Google Maps URLs for a stop's walk.
//
// The old page linked to /maps/dir/A/B/@A,3a,…h,90t/data=!4m2!4m1!3e2: that draws
// the walking route but stays on the map, because a Street View URL needs a
// panorama id in its data part, which only Google knows. So:
//  - with the Street View Gamepad extension, the game opens the route
//    (routeUrl) and the extension looks up the panorama at its start and
//    enters Street View there, keeping the route on the minimap;
//  - without it, panoramaUrl uses Google's documented "map_action=pano" URL,
//    which always opens Street View, but without the route.

import { bearing } from "./geo.js";

const MAPS = "https://www.google.com/maps";

/** Walking directions from `o` to `d`, as a map. @param {string} o @param {string} d */
export const routeUrl = (o, d) => `${MAPS}/dir/${o}/${d}/@${o},18z/data=!4m2!4m1!3e2`;

/** Street View at `o`, looking towards `d`. @param {string} o @param {string} d */
export const panoramaUrl = (o, d) => `${MAPS}/@?api=1&map_action=pano&viewpoint=${o}&heading=${bearing(o, d)}`;
