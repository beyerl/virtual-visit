// SVG art: the spinning globe of the title screen, and a little city badge
// per journey. Comic style: flat colours, thick ink outlines.

export const GLOBE_SVG = `
<svg class="globe" viewBox="0 0 320 320" aria-hidden="true">
  <defs>
    <clipPath id="globe-clip"><circle cx="160" cy="160" r="112"/></clipPath>
    <pattern id="globe-dots" width="8" height="8" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.4" fill="#3b2418" opacity=".08"/></pattern>
  </defs>
  <circle cx="160" cy="160" r="112" fill="#5fb3ad"/>
  <g clip-path="url(#globe-clip)">
    <g class="globe-land">
      ${[0, 1].map((k) => `<g transform="translate(${k * 360} 0)">
        <path d="M-20 95 q40-30 85-10 q20 20 5 45 q-25 15-30 45 q-20 25-45 5 q-30-20-25-50z" fill="#7fb356" stroke="#3b2418" stroke-width="3.5"/>
        <path d="M95 70 q35-25 70-5 q15 25-10 40 q-30 5-40 30 q-20 10-30-15 q-5-30 10-50z" fill="#f2c45a" stroke="#3b2418" stroke-width="3.5"/>
        <path d="M120 165 q30-10 45 20 q10 40-15 70 q-25 10-30-25 q-10-35 0-65z" fill="#7fb356" stroke="#3b2418" stroke-width="3.5"/>
        <path d="M205 90 q50-25 105 0 q25 30-10 50 q-40 0-50 25 q-30 15-45-20 q-15-35 0-55z" fill="#e48a52" stroke="#3b2418" stroke-width="3.5"/>
        <path d="M265 210 q30-10 45 10 q0 25-30 30 q-25-5-15-40z" fill="#f2c45a" stroke="#3b2418" stroke-width="3.5"/>
        <circle cx="300" cy="118" r="7" fill="#d2603f" stroke="#3b2418" stroke-width="3"/>
      </g>`).join("")}
    </g>
    <rect x="40" y="40" width="240" height="240" fill="url(#globe-dots)"/>
    <ellipse cx="160" cy="160" rx="112" ry="40" fill="none" stroke="#3b2418" stroke-width="2" opacity=".25"/>
    <ellipse cx="160" cy="160" rx="45" ry="112" fill="none" stroke="#3b2418" stroke-width="2" opacity=".25"/>
    <path d="M100 80 a112 112 0 0 1 60-25" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round" opacity=".7"/>
  </g>
  <circle cx="160" cy="160" r="112" fill="none" stroke="#3b2418" stroke-width="4.5"/>
  <g class="orbit">
    <path d="M160 18 a142 142 0 0 1 0 284 a142 142 0 0 1 0-284" fill="none" stroke="#3b2418" stroke-width="3" stroke-dasharray="4 12" stroke-linecap="round" opacity=".6"/>
    <g transform="translate(160 18)">
      <path d="M-20 0 L16 -4 Q24 0 16 4 Z" fill="#fff" stroke="#3b2418" stroke-width="3.5" stroke-linejoin="round"/>
      <path d="M-2 -2 L-10 -20 L-2 -20 L10 -2 Z M-2 2 L-10 20 L-2 20 L10 2 Z" fill="#d2603f" stroke="#3b2418" stroke-width="3" stroke-linejoin="round"/>
      <path d="M-18 -1 L-24 -10 L-19 -10 L-12 -1 Z" fill="#d2603f" stroke="#3b2418" stroke-width="2.5"/>
    </g>
  </g>
</svg>`;

/** @type {Record<string, string>} */
export const CITY_SVG = {
  tokyo: `
<svg viewBox="0 0 200 140" aria-hidden="true">
  <circle cx="150" cy="40" r="22" fill="#d2603f" stroke="#3b2418" stroke-width="4"/>
  <path d="M96 128 L100 14 L104 128 Z" fill="#f6e6c4" stroke="#3b2418" stroke-width="4" stroke-linejoin="round"/>
  <rect x="93" y="50" width="14" height="8" rx="2" fill="#f6e6c4" stroke="#3b2418" stroke-width="3"/>
  <path d="M40 128 L52 52 L64 128 Z" fill="#e48a52" stroke="#3b2418" stroke-width="4" stroke-linejoin="round"/>
  <path d="M45 98 H59 M48 76 H56" stroke="#3b2418" stroke-width="3"/>
  <path d="M128 128 V92 M168 128 V92 M120 92 H176 M124 100 H172" stroke="#d2603f" stroke-width="4.5" stroke-linecap="round"/>
  <path d="M120 92 H176" stroke="#3b2418" stroke-width="2"/>
  <path d="M0 128 H200" stroke="#3b2418" stroke-width="3.5"/>
</svg>`,
  beijing: `
<svg viewBox="0 0 200 140" aria-hidden="true">
  <circle cx="160" cy="34" r="16" fill="#f2c45a" stroke="#3b2418" stroke-width="3.5"/>
  <path d="M60 128 V112 H140 V128" fill="#d2603f" stroke="#3b2418" stroke-width="3.5"/>
  <path d="M50 112 L100 96 L150 112 Z" fill="#3d8a8c" stroke="#3b2418" stroke-width="3.5" stroke-linejoin="round"/>
  <path d="M70 96 V84 H130 V96" fill="#d2603f" stroke="#3b2418" stroke-width="3.5"/>
  <path d="M60 84 L100 70 L140 84 Z" fill="#3d8a8c" stroke="#3b2418" stroke-width="3.5" stroke-linejoin="round"/>
  <path d="M80 70 V60 H120 V70" fill="#d2603f" stroke="#3b2418" stroke-width="3.5"/>
  <path d="M72 60 L100 44 L128 60 Z" fill="#3d8a8c" stroke="#3b2418" stroke-width="3.5" stroke-linejoin="round"/>
  <circle cx="100" cy="40" r="4" fill="#f2c45a" stroke="#3b2418" stroke-width="2.5"/>
  <path d="M0 128 H200" stroke="#3b2418" stroke-width="3.5"/>
</svg>`,
  moscow: `
<svg viewBox="0 0 200 140" aria-hidden="true">
  <path d="M84 128 V84 H116 V128" fill="#f6e6c4" stroke="#3b2418" stroke-width="3.5"/>
  <path d="M100 30 C118 46 124 62 116 84 H84 C76 62 82 46 100 30 Z" fill="#d2603f" stroke="#3b2418" stroke-width="3.5"/>
  <path d="M92 44 C100 56 100 70 96 84 M108 44 C100 56 100 70 104 84" stroke="#f2c45a" stroke-width="3" fill="none"/>
  <path d="M100 30 V18" stroke="#3b2418" stroke-width="3"/>
  <path d="M48 128 V94 H70 V128" fill="#f6e6c4" stroke="#3b2418" stroke-width="3.5"/>
  <path d="M59 62 C72 72 74 84 70 94 H48 C44 84 46 72 59 62 Z" fill="#3d8a8c" stroke="#3b2418" stroke-width="3.5"/>
  <path d="M130 128 V98 H152 V128" fill="#f6e6c4" stroke="#3b2418" stroke-width="3.5"/>
  <path d="M141 68 C154 78 156 88 152 98 H130 C126 88 128 78 141 68 Z" fill="#7fb356" stroke="#3b2418" stroke-width="3.5"/>
  <path d="M0 128 H200" stroke="#3b2418" stroke-width="3.5"/>
</svg>`,
  kyoto: `
<svg viewBox="0 0 200 140" aria-hidden="true">
  <path d="M70 128 V100 H130 V128" fill="#e48a52" stroke="#3b2418" stroke-width="4"/>
  <path d="M55 100 L100 80 L145 100 Z M65 80 L100 62 L135 80 Z M75 62 L100 46 L125 62 Z" fill="#8a4f32" stroke="#3b2418" stroke-width="4" stroke-linejoin="round"/>
  <path d="M100 46 V24" stroke="#3b2418" stroke-width="4"/>
  <path d="M0 128 H200" stroke="#3b2418" stroke-width="3.5"/>
</svg>`,
  paris: `
<svg viewBox="0 0 200 140" aria-hidden="true">
  <path d="M100 12 L80 128 M100 12 L120 128 M86 90 H114 M92 56 H108 M84 128 Q100 100 116 128" fill="none" stroke="#3b2418" stroke-width="3.5" stroke-linejoin="round"/>
  <path d="M0 128 H200" stroke="#3b2418" stroke-width="3.5"/>
</svg>`,
};
