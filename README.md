# Virtual Visit

_Virtually traveling the world_: a calm, cosy comic-style exploration game for an SNES-type gamepad. Ride real trains in
side-window videos while your guide tells you about the city, then walk each stop in Google
Street View.

**Play:** https://beyerl.github.io/virtual-visit/

Currently available: **Tokyo with Hana**, 3 days, 15 train rides, 18 stops (from the static page
in `reference/tokyo-with-hana.html`).

## How a journey goes

1. Title screen → **Start new game** or **Load game**.
2. Choose a journey.
3. Each day starts with Hana's plan for the day. Then, for every stop:
   - a **train ride**: a side-window (車窓 / 側面展望) YouTube video, cut to the stretch we ride,
     with Hana's speech bubbles about the place we're going to (on foot, a short walk scene
     instead);
   - the **stop in Street View**, at the start of the walking route, facing the way to go.
     Press **L + R together** when you've seen enough, and the next ride starts.
4. After each day, and after the whole journey, a wrap-up with stamps for every stop.

The game saves itself after every step and every move in Street View (localStorage). **Load
game** lists the saves; a game saved in Street View resumes where you stood.

## Controls

| Button   | Keyboard          | What it does                                                   |
| -------- | ----------------- | -------------------------------------------------------------- |
| D-pad    | arrow keys        | choose                                                         |
| A        | Enter, Space      | OK, next speech bubble                                         |
| B        | Esc, Backspace    | back                                                           |
| Start    | S                 | skip the train ride (or the remaining bubbles); title: start   |
| Select   | P, Tab            | pause menu                                                     |
| X        | X, M              | sound on / off during a ride                                   |
| Y        | Y, Delete         | show / hide the ride map; delete a save (load screen)          |
| L + R    | Q + E             | finish the stop (in the game and in Street View)               |

Gamepads with Chrome's standard mapping are read by button position (as on an Xbox pad: A right,
B bottom, X top, Y left, like the SNES). Common USB SNES replicas without a standard mapping are
supported too. Everything can also be clicked.

**Main menu → Controls** sets the pad's controls: pick a control and press the pad button (or
push the stick / D-pad direction) for it, or choose _Set up all buttons_ to go through all twelve
in a row (Enter skips one, Esc stops, waiting 8 s skips). Each input belongs to one control only;
assigning it elsewhere takes it away from the old one. _Automatic layout_ forgets the custom
controls. They are saved in localStorage; the keyboard keys always stay the same.

Browsers only play video with sound after a click or key press on the page (a gamepad press
doesn't count). Without one, rides play muted and a badge says so: click once anywhere, then
press X.

## Street View and the Street View Gamepad extension

Street View is walked with the **[Street View Gamepad](https://github.com/beyerl/street-view-gamepad)**
Chrome extension (version 1.12 or newer), which drives Google Maps itself with the pad. The game
hands each stop to the extension and opens the walking route on Google Maps in the same tab; the
extension enters Street View at the route's start (a Street View URL needs a panorama id, which
the old page's links lacked, so they only showed the route), stores every move for the game's
autosave, and brings you back when you press L + R.

Without the extension, the game opens Google's own Street View link for the stop (no route on
the minimap, no gamepad); come back with the browser's Back button.

## Running locally

No build step: plain ES modules, web components and CSS.

```sh
npm run serve      # http://localhost:8080
npm test           # domain and application tests (Node 22+)
```

The extension's content script also runs on `localhost` and `127.0.0.1`, so the hand-over works
locally too.

## Architecture

Domain-driven, with dependencies pointing inwards:

```
src/
  domain/          journey (aggregate root) and its itinerary of steps, game state (entity),
                   dialogue, input (SNES buttons, the L + R chord), controls (pad bindings),
                   geo, Google Maps links
  application/     GameService (new game, load, advance, visit a stop, come back),
                   InputService (buttons → actions, with repeat), ControlsService (custom
                   controls, capturing the next pad input), ports (interfaces)
  infrastructure/  localStorage saves, gamepad / keyboard / pointer sources, the extension
                   link (postMessage), the YouTube IFrame player, the browser's location
  presentation/    web components: <vv-app> (screen flow), splash, menus, load, journey
                   select, controls, day intro, ride, walk, visit, wrap-up, pause, and the parts:
                   <vv-hana> (pure CSS), <vv-speech>, <vv-menu>, <vv-pad-hint>, <vv-route-map>
  content/         journeys: Tokyo (days, legs, Hana's lines, ride videos) and its rail map
  main.js          composition root, the only module touching browser globals
styles/            comic theme (main.css) and Hana (hana.css)
```

All graphics are CSS or inline SVG: warm pastel colours, soft brown ink outlines, rounded shapes and slow motion. Fonts (Fredoka, Zen Maru Gothic, Zen Kaku Gothic New) come from Google Fonts.

## Ride videos

Side-window recordings by these YouTube channels, embedded with the YouTube player:
めんどくさがらないで【サブチャン】 (Yamanote Line), PSTLSTS (Tōkaidō Shinkansen), きままトラベル
(Marunouchi Line), yoman7206 (Ginza, Asakusa, Hanzōmon lines), 乗り物車窓ch (Chūō Line), 大人のひとり歩き
and 日本最大!車窓YouTuber! (Yurikamome), 乗り物でどうでしょうチャンネル (Keihin-Tōhoku Line).

Where a video has station chapters, the ride is cut to them; other cut points are estimates.
