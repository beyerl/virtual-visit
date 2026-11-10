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
  bogota: `
<svg viewBox="0 0 200 140" aria-hidden="true">
  <circle cx="44" cy="36" r="16" fill="#f2c45a" stroke="#3b2418" stroke-width="3.5"/>
  <path d="M0 128 L60 70 L96 44 L132 70 L200 110 V128 Z" fill="#7fb356" stroke="#3b2418" stroke-width="3.5" stroke-linejoin="round"/>
  <path d="M88 46 V30 H104 V46" fill="#f6e6c4" stroke="#3b2418" stroke-width="3"/>
  <path d="M86 30 L96 18 L106 30 Z" fill="#d2603f" stroke="#3b2418" stroke-width="3" stroke-linejoin="round"/>
  <path d="M96 46 L60 128" stroke="#3b2418" stroke-width="2.5" stroke-dasharray="4 4"/>
  <path d="M20 128 V104 H36 V128 M40 128 V96 H58 V128 M150 128 V100 H170 V128" fill="#e48a52" stroke="#3b2418" stroke-width="3"/>
  <path d="M0 128 H200" stroke="#3b2418" stroke-width="3.5"/>
</svg>`,
  rio: `
<svg viewBox="0 0 200 140" aria-hidden="true">
  <path d="M0 112 Q40 104 80 112 T160 112 T200 112 V128 H0 Z" fill="#5fb3ad" stroke="#3b2418" stroke-width="3"/>
  <path d="M10 112 C14 70 40 70 46 112 Z" fill="#7fb356" stroke="#3b2418" stroke-width="3.5"/>
  <path d="M40 112 C44 40 74 34 84 112 Z" fill="#7fb356" stroke="#3b2418" stroke-width="3.5"/>
  <path d="M110 112 L148 50 L190 112 Z" fill="#3b8a4f" stroke="#3b2418" stroke-width="3.5" stroke-linejoin="round"/>
  <path d="M148 50 V24 M138 32 H158" stroke="#f6e6c4" stroke-width="5" stroke-linecap="round"/>
  <path d="M148 50 V24 M138 32 H158" stroke="#3b2418" stroke-width="1.5"/>
  <path d="M46 70 L64 46" stroke="#3b2418" stroke-width="2"/>
  <rect x="52" y="54" width="9" height="7" fill="#d2603f" stroke="#3b2418" stroke-width="2"/>
  <path d="M0 128 H200" stroke="#3b2418" stroke-width="3.5"/>
</svg>`,
  newyork: `
<svg viewBox="0 0 200 140" aria-hidden="true">
  <path d="M86 128 V60 H94 V46 H100 V30 H104 V46 H110 V60 H118 V128" fill="#f6e6c4" stroke="#3b2418" stroke-width="3.5" stroke-linejoin="round"/>
  <path d="M102 30 V12" stroke="#3b2418" stroke-width="3"/>
  <path d="M94 72 V120 M102 72 V120 M110 72 V120" stroke="#3b2418" stroke-width="2" opacity=".5"/>
  <path d="M56 128 V82 H78 V128 M126 128 V76 H146 V128 M150 128 V96 H170 V128 M30 128 V100 H50 V128" fill="#e48a52" stroke="#3b2418" stroke-width="3"/>
  <path d="M168 60 V44 M162 44 L168 34 L174 44" fill="#f2c45a" stroke="#3b2418" stroke-width="3" stroke-linejoin="round"/>
  <path d="M160 128 L164 72 Q168 64 172 72 L176 128" fill="#7cc4a8" stroke="#3b2418" stroke-width="3"/>
  <path d="M164 64 L160 56 M168 62 V52 M172 64 L176 56" stroke="#7cc4a8" stroke-width="3" stroke-linecap="round"/>
  <path d="M0 128 H200" stroke="#3b2418" stroke-width="3.5"/>
</svg>`,
  ulaanbaatar: `
<svg viewBox="0 0 200 140" aria-hidden="true">
  <circle cx="160" cy="34" r="14" fill="#f2c45a" stroke="#3b2418" stroke-width="3.5"/>
  <path d="M0 100 L40 62 L70 84 L110 48 L150 82 L200 70 V128 H0 Z" fill="#7fb356" stroke="#3b2418" stroke-width="3.5" stroke-linejoin="round"/>
  <path d="M62 128 V100 H138 V128" fill="#fbf0d9" stroke="#3b2418" stroke-width="3.5"/>
  <path d="M56 100 Q100 66 144 100 Z" fill="#fbf0d9" stroke="#3b2418" stroke-width="3.5" stroke-linejoin="round"/>
  <path d="M62 108 H138" stroke="#d2603f" stroke-width="4"/>
  <path d="M92 128 V110 H108 V128" fill="#d2603f" stroke="#3b2418" stroke-width="3"/>
  <circle cx="100" cy="80" r="4" fill="#2f6db5" stroke="#3b2418" stroke-width="2"/>
  <path d="M0 128 H200" stroke="#3b2418" stroke-width="3.5"/>
</svg>`,
  capetown: `
<svg viewBox="0 0 200 140" aria-hidden="true">
  <path d="M0 116 Q50 108 100 116 T200 116 V128 H0 Z" fill="#5fb3ad" stroke="#3b2418" stroke-width="3"/>
  <path d="M20 116 L50 52 H136 L160 80 L186 116 Z" fill="#7fb356" stroke="#3b2418" stroke-width="3.5" stroke-linejoin="round"/>
  <path d="M44 48 Q60 36 80 44 Q96 34 116 44 Q130 38 142 50 H44 Z" fill="#fff" stroke="#3b2418" stroke-width="3" stroke-linejoin="round"/>
  <path d="M160 80 Q168 54 176 50 Q182 60 186 116" fill="#3b8a4f" stroke="#3b2418" stroke-width="3.5" stroke-linejoin="round"/>
  <path d="M100 52 L120 96" stroke="#3b2418" stroke-width="2" stroke-dasharray="3 3"/>
  <rect x="104" y="64" width="9" height="7" fill="#d2603f" stroke="#3b2418" stroke-width="2"/>
  <path d="M0 128 H200" stroke="#3b2418" stroke-width="3.5"/>
</svg>`,
  cairo: `
<svg viewBox="0 0 200 140" aria-hidden="true">
  <circle cx="44" cy="34" r="16" fill="#f2c45a" stroke="#3b2418" stroke-width="3.5"/>
  <path d="M40 128 L92 52 L144 128 Z" fill="#f2c45a" stroke="#3b2418" stroke-width="3.5" stroke-linejoin="round"/>
  <path d="M92 52 L104 128" stroke="#3b2418" stroke-width="2" opacity=".5"/>
  <path d="M120 128 L156 76 L192 128 Z" fill="#e0a540" stroke="#3b2418" stroke-width="3.5" stroke-linejoin="round"/>
  <path d="M8 128 L30 96 L52 128 Z" fill="#e0a540" stroke="#3b2418" stroke-width="3.5" stroke-linejoin="round"/>
  <path d="M0 128 H200" stroke="#3b2418" stroke-width="3.5"/>
</svg>`,
  nairobi: `
<svg viewBox="0 0 200 140" aria-hidden="true">
  <circle cx="40" cy="36" r="16" fill="#f2c45a" stroke="#3b2418" stroke-width="3.5"/>
  <path d="M150 128 V84 M150 84 Q130 80 118 72 Q150 60 182 72 Q170 80 150 84" fill="#7fb356" stroke="#3b2418" stroke-width="3.5" stroke-linejoin="round"/>
  <path d="M66 128 V98 M88 128 V98" stroke="#3b2418" stroke-width="5" stroke-linecap="round"/>
  <path d="M60 100 Q60 86 78 86 Q94 86 94 100 Z" fill="#f2c45a" stroke="#3b2418" stroke-width="3.5"/>
  <path d="M88 90 L100 36" stroke="#3b2418" stroke-width="12" stroke-linecap="round"/>
  <path d="M88 90 L100 36" stroke="#f2c45a" stroke-width="6" stroke-linecap="round"/>
  <path d="M96 38 Q104 30 112 38 L108 44 Q100 44 96 38 Z" fill="#f2c45a" stroke="#3b2418" stroke-width="3" stroke-linejoin="round"/>
  <path d="M100 32 V26 M106 32 V26" stroke="#3b2418" stroke-width="2.5" stroke-linecap="round"/>
  <circle cx="72" cy="94" r="2.5" fill="#8a4f32"/><circle cx="84" cy="92" r="2.5" fill="#8a4f32"/>
  <path d="M0 128 H200" stroke="#3b2418" stroke-width="3.5"/>
</svg>`,
  kingston: `
<svg viewBox="0 0 200 140" aria-hidden="true">
  <circle cx="150" cy="40" r="18" fill="#f2c45a" stroke="#3b2418" stroke-width="3.5"/>
  <path d="M0 114 Q50 106 100 114 T200 114 V128 H0 Z" fill="#5fb3ad" stroke="#3b2418" stroke-width="3"/>
  <path d="M64 128 Q66 80 84 52" fill="none" stroke="#3b2418" stroke-width="8" stroke-linecap="round"/>
  <path d="M64 128 Q66 80 84 52" fill="none" stroke="#8a4f32" stroke-width="4" stroke-linecap="round"/>
  <path d="M84 52 Q60 40 40 56 Q62 50 84 52 Q78 28 58 22 Q74 36 84 52 Q100 32 124 36 Q100 40 84 52 Q110 50 120 70 Q100 56 84 52 Z" fill="#1f8a4c" stroke="#3b2418" stroke-width="3" stroke-linejoin="round"/>
  <circle cx="80" cy="58" r="4" fill="#7a5230" stroke="#3b2418" stroke-width="2"/><circle cx="88" cy="58" r="4" fill="#7a5230" stroke="#3b2418" stroke-width="2"/>
  <path d="M0 128 H200" stroke="#3b2418" stroke-width="3.5"/>
</svg>`,
  hobbiton: `
<svg viewBox="0 0 200 140" aria-hidden="true">
  <circle cx="164" cy="34" r="15" fill="#f2c45a" stroke="#3b2418" stroke-width="3.5"/>
  <path d="M58 46 V30" stroke="#3b2418" stroke-width="7" stroke-linecap="round"/>
  <path d="M58 46 V30" stroke="#8a4f32" stroke-width="3" stroke-linecap="round"/>
  <path d="M38 26 Q34 10 50 10 Q58 0 68 9 Q84 8 80 24 Q84 34 70 34 H46 Q34 36 38 26 Z" fill="#3b8a4f" stroke="#3b2418" stroke-width="3.5" stroke-linejoin="round"/>
  <path d="M0 128 Q10 60 70 44 Q110 34 150 60 Q190 84 200 128 Z" fill="#7fb356" stroke="#3b2418" stroke-width="3.5" stroke-linejoin="round"/>
  <path d="M132 58 V40 H144 V62" fill="#e48a52" stroke="#3b2418" stroke-width="3" stroke-linejoin="round"/>
  <path d="M62 128 V104 Q62 70 96 70 Q130 70 130 104 V128 Z" fill="#f6e6c4" stroke="#3b2418" stroke-width="3.5" stroke-linejoin="round"/>
  <circle cx="96" cy="104" r="21" fill="#3b8a4f" stroke="#3b2418" stroke-width="3.5"/>
  <circle cx="96" cy="104" r="3.5" fill="#f2c45a" stroke="#3b2418" stroke-width="2"/>
  <circle cx="150" cy="106" r="9" fill="#f2c45a" stroke="#3b2418" stroke-width="3"/>
  <path d="M150 97 V115 M141 106 H159" stroke="#3b2418" stroke-width="2"/>
  <path d="M0 128 H200" stroke="#3b2418" stroke-width="3.5"/>
</svg>`,
};
