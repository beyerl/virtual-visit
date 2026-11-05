# Virtual Visit

_Virtually traveling the world_: a warm, sunny pixel-adventure-style exploration game for an SNES-type gamepad. Ride real trains in
side-window videos while your guide tells you about the city, then walk each stop in Google
Street View.

**Play:** https://beyerl.github.io/virtual-visit/

Currently available, each with its own guide:

- **Tokyo with Hana**: 3 days, 15 train rides, 18 stops (from the static page in
  `reference/tokyo-with-hana.html`).
- **Beijing with Wei**: 3 days, 11 train rides, 15 stops, from Qianmen along the imperial axis
  to the Forbidden City, the temples and hutongs, and out to the Great Wall at Badaling.
  Google has little official Street View in mainland China, so most Beijing stops are user
  photospheres (every walk start has one within 250 m).
- **Moscow with Katya**: 3 days, 11 train rides, 15 stops, from the Sapsan arrival to Red
  Square, the Arbat, Gorky Park, VDNKh, the Sparrow Hills and around the Central Circle.

And eight two-day journeys, each with its own guide too:

- **Bogotá with Valentina**: 4 rides, 8 stops: TransMilenio to the Gold Museum, La Candelaria,
  Plaza de Bolívar, the funicular up Monserrate, the TransMiCable over Ciudad Bolívar and the Zona T.
- **Rio with Thiago**: 6 rides, 8 stops: the VLT, the Selarón steps, the Santa Teresa tram, the
  Sugarloaf cable car, the Corcovado train to Christ the Redeemer, Ipanema and Copacabana.
- **New York with Maya**: 6 rides, 10 stops: the Staten Island Ferry, Wall Street, the Brooklyn
  Bridge and DUMBO, Times Square, the Roosevelt Island Tram, Central Park and the High Line.
- **Ulaanbaatar with Bat**: 5 rides, 8 stops: the Trans-Mongolian train, Sükhbaatar Square, the
  Choijin Lama Temple, Zaisan, the Chinggis Khaan statue and Turtle Rock in Terelj.
- **Cape Town with Thandi**: 5 rides, 7 stops: the V&A Waterfront, the Table Mountain cableway,
  the Bo-Kaap, and the Southern Line along False Bay to Muizenberg, Boulders Beach and Kalk Bay.
- **Cairo with Omar**: 4 rides, 8 stops: the metro to Tahrir, the Qasr al-Nil bridge, a felucca to
  the Cairo Tower, Pyramids Street to Giza and the Sphinx, and Khan el-Khalili.
- **Nairobi with Amani**: 4 rides, 6 stops: the Expressway, the KICC, the Railway Museum, a matatu
  to the Giraffe Centre and a game drive in Nairobi National Park.
- **Kingston with Kemar**: 4 rides, 7 stops: Hope Road to the Bob Marley Museum, Emancipation Park,
  Devon House, the Blue Mountains, the waterfront and Port Royal.

Not every ride is a train: some cities are seen from a bus, a cable car, a boat or a car window.
Where Google has no official Street View (much of Cairo, parts of Bogotá, Nairobi, Kingston and
Ulaanbaatar), the stops use user photospheres; every walk starts within 15 m of one.

## How a journey goes

1. Title screen → **Start new game** or **Load game**.
2. Choose a journey.
3. Each day starts with the guide's plan for the day, with a photo of every stop (free images
   from Wikimedia Commons, see [CREDITS.md](CREDITS.md)). Then, for every stop:
   - a **train ride**: a side-window (車窓 / 側面展望) YouTube video, cut to the stretch we ride,
     with the guide's speech bubbles about the place we're going to (on foot, a short walk scene
     instead);
   - the **stop in Street View**, at the start of the walking route, facing the way to go.
     Press **L + R together** when you've seen enough, and the next ride starts.
4. After each day, and after the whole journey, a wrap-up with stamps for every stop.

In Tokyo, Hana also **speaks** every speech bubble (in English, with a Japanese accent). Her voice
stops when you go on to the next bubble or skip, and the ride video turns down while she talks.
Browsers only play sound after a click or a key press, so with only a gamepad she stays silent
until then.

The game saves itself after every step and every move in Street View (localStorage). **Load
game** lists the saves; a game saved in Street View resumes where you stood.

## Controls

| Button   | Keyboard          | What it does                                                   |
| -------- | ----------------- | -------------------------------------------------------------- |
| D-pad    | arrow keys        | choose; during a ride ← / → skip 30 s back / forward           |
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

## Guide voices

Hana's lines are pre-recorded with local text-to-speech: [Kokoro-82M](https://huggingface.co/hexgrad/Kokoro-82M)
(via kokoro-onnx, on the CPU) with its Japanese female voice `jf_alpha` reading English. The
Japanese words in {braces} and the Japanese place names are turned into Japanese phonemes, so they
sound Japanese. Each line is a 24 kHz mono 32 kbit/s MP3 in `audio/hana/`, named by a hash of its
text, so a changed line gets new audio. After changing Tokyo's lines, run:

```sh
.venv-voice/bin/python tools/voice/generate.py --guide hana   # setup: see the script's docstring
```

It voices only new or changed lines, removes stale files and rewrites `src/content/voices.js`.

## Architecture

Domain-driven, with dependencies pointing inwards:

```
src/
  domain/          journey (aggregate root) and its itinerary of steps, game state (entity),
                   dialogue, input (SNES buttons, the L + R chord), controls (pad bindings),
                   geo, Google Maps links, voice (which audio file says a line)
  application/     GameService (new game, load, advance, visit a stop, come back),
                   InputService (buttons → actions, with repeat), ControlsService (custom
                   controls, capturing the next pad input), ports (interfaces)
  infrastructure/  localStorage saves, gamepad / keyboard / pointer sources, the extension
                   link (postMessage), the YouTube IFrame player, the voice player, the browser's location
  presentation/    web components: <vv-app> (screen flow), splash, menus, load, journey
                   select, controls, day intro, ride, walk, visit, wrap-up, pause, and the parts:
                   <vv-guide> (all eleven guides in pure CSS), <vv-speech>, <vv-menu>, <vv-pad-hint>, <vv-route-map>
  content/         journeys: Tokyo, Beijing, Moscow, Bogotá, Rio, New York, Ulaanbaatar, Cape Town,
                   Cairo, Nairobi, Kingston (days, legs, guide lines, ride videos), Tokyo's rail map,
                   stop photos and their credits, which lines have a voice
  main.js          composition root, the only module touching browser globals
styles/            theme (main.css) and the guides (guides.css)
images/stops/      stop photos (WebP)
audio/<guide>/     the guides' recorded lines (MP3)
tools/voice/       makes the recorded lines (local TTS)
```

All graphics are CSS or inline SVG: a golden-hour sky over stepped pixel hills, parchment panels in dark wood frames, earthy terracotta / ochre / leaf green / teal, hard pixel shadows. Fonts (Pixelify Sans, Zen Maru Gothic, Zen Kaku Gothic New) come from Google Fonts.

## Ride videos

Side-window recordings by these YouTube channels, embedded with the YouTube player:
めんどくさがらないで【サブチャン】 (Yamanote Line), PSTLSTS (Tōkaidō Shinkansen), きままトラベル
(Marunouchi Line), yoman7206 (Ginza, Asakusa, Hanzōmon lines), 乗り物車窓ch (Chūō Line), 大人のひとり歩き
and 日本最大!車窓YouTuber! (Yurikamome), 乗り物でどうでしょうチャンネル (Keihin-Tōhoku Line).

The rides of the other journeys are side-window, front-window, in-car or dashcam recordings by
many channels, each checked for embedding; the video id in each journey's file leads to its
channel.

Where a video has station chapters, the ride is cut to them; other cut points are estimates.
