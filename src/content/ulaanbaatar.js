// Ulaanbaatar with Bat: two days, arriving on the Trans-Mongolian Railway,
// along Peace Avenue to Sükhbaatar Square and the Choijin Lama Temple, then
// out of the city to Zaisan hill, the giant Chinggis Khaan statue and Turtle
// Rock in Gorkhi-Terelj National Park. Coordinates are WGS84
// (OpenStreetMap); every walk starts within 30 m of a Street View panorama.
//
// In Bat's lines, {braces} mark Mongolian words, shown in red.

export const ULAANBAATAR = {
  id: "ulaanbaatar",
  title: "Ulaanbaatar",
  jp: "Улаанбаатар",
  tagline: "2 days · 5 rides · 8 stops",
  guide: { id: "bat", name: "Batbayar Dorj", short: "Bat" },
  available: true,
  lines: {
    transmongolian: { name: "Trans-Mongolian Railway", color: "#C0392B" },
    bus: { name: "City bus", color: "#2F6DB5" },
    road: { name: "By car", color: "#E0A540" },
    steppe: { name: "Across the steppe", color: "#7FB356" },
  },
  days: [
    {
      id: "day1",
      num: "Day 1",
      title: "Train, square and temple",
      intro: [
        "{Sain baina uu!} Hello! I'm Batbayar, but just call me Bat. {Tavtai morilno uu!} Welcome to Mongolia!",
        "Ulaanbaatar is the coldest capital city in the world. In winter it can be minus 40 degrees! Half of all Mongolians live here.",
        "We arrive like real travellers: on the long-distance train across the Gobi Desert. {Yavya!} Let's go!",
      ],
      legs: [
        {
          id: "station",
          rides: [
            {
              line: "transmongolian",
              name: "Trans-Mongolian train",
              from: ["T", "Zamyn-Üüd"],
              to: ["T", "Ulaanbaatar"],
              mins: "overnight",
              video: { id: "Nmcephj1V7o", start: 687, end: 1080 },
            },
          ],
          hana: [
            "We've been on the train all night, from the Chinese border, across the {Gobi}. It's a desert of stones and grass, not only sand!",
            "This railway goes all the way from Beijing through Mongolia to Russia, where it meets the Trans-Siberian.",
            "Look out of the window: wide, empty steppe, and now and then a white round tent, a {ger}.",
            "Look around with your pad, and when you've seen enough, press {L + R} together.",
          ],
          stop: {
            kind: "sight",
            name: "Ulaanbaatar Railway Station",
            jp: "Улаанбаатар өртөө",
            text: "The city's main station, halfway along the Trans-Mongolian line between Beijing and the Russian border, with a square in front.",
            walkLabel: "Platform → station square",
            mins: 3,
            o: "47.90819,106.88391",
            d: "47.90920,106.88380",
          },
        },
        {
          id: "square",
          rides: [
            {
              line: "bus",
              name: "City bus M:1",
              from: ["M1", "Peace Avenue"],
              to: ["M1", "Sükhbaatar Square"],
              mins: "9 min",
              video: { id: "R_8IraheeBc" },
            },
          ],
          hana: [
            "We ride the bus along {Enkh Taivny Örgön Chölöö}, Peace Avenue, the main street that crosses the whole city.",
            "Ulaanbaatar was once a moving monastery of tents. It only settled here, by the Tuul river, in 1778.",
            "In the middle of town is {Sükhbaatar Square}, named after a hero of the 1921 revolution, sitting on his horse.",
          ],
          stop: {
            kind: "sight",
            name: "Sükhbaatar Square",
            jp: "Сүхбаатарын талбай",
            text: "The great central square, with Sükhbaatar on horseback in the middle and the Government Palace with a huge seated Chinggis Khaan on its north side.",
            walkLabel: "Peace Avenue → Sükhbaatar statue → Government Palace",
            mins: 6,
            o: "47.91694,106.91738",
            d: "47.92060,106.91770",
            tip: "Stand in front of the Government Palace and look up at Chinggis Khaan. He's sitting on a throne, watching over his city!",
          },
        },
        {
          id: "choijin",
          hana: [
            "Just behind the square, between the tall glass towers, hides a little temple: {Choijin Lama}.",
            "It was built about 120 years ago for the brother of the last king of Mongolia, a holy man and fortune teller.",
            "Today it's a museum full of colourful masks for the {Tsam} dance, where dancers play gods and spirits.",
          ],
          stop: {
            kind: "sight",
            name: "Choijin Lama Temple",
            jp: "Чойжин ламын сүм",
            text: "A small Buddhist temple from 1908 with curved green roofs, standing among the skyscrapers south of the square, now a museum of masks and statues.",
            walkLabel: "Sükhbaatar Square → the temple gate",
            mins: 5,
            o: "47.91617,106.91663",
            d: "47.91505,106.91830",
          },
        },
        {
          id: "nomads",
          hana: [
            "Dinner time! We're going to {Modern Nomads}, a restaurant that cooks the food of the herders.",
            "We eat {buuz}, steamed dumplings, and {khuushuur}, crispy fried pastries filled with mutton.",
            "And to drink, {suutei tsai}: milk tea with a pinch of salt. Every ger has a pot of it on the stove!",
          ],
          stop: {
            kind: "dinner",
            name: "Modern Nomads",
            jp: "Модерн Номадс",
            cuisine: "Mongolian · Baga Toiruu",
            text: "A popular restaurant near the city centre, decorated with felt and wood like a ger, serving Mongolian dishes and big grilled platters.",
            walkLabel: "Sükhbaatar Square → Baga Toiruu",
            mins: 12,
            o: "47.91846,106.91687",
            d: "47.92575,106.91537",
          },
        },
      ],
      wrapUp: [
        "A night on the Trans-Mongolian, a bus down Peace Avenue, the great square and a temple of masks.",
        "And buuz with salty milk tea. {Bayarlalaa!} That means thank you!",
        "Tomorrow we ride out onto the steppe! {Sain amraarai!} Sleep well!",
      ],
    },
    {
      id: "day2",
      num: "Day 2",
      title: "Out onto the steppe",
      intro: [
        "{Öglöönii mend!} Good morning! Today we leave the city.",
        "First a hill with a view, then the biggest horse statue in the world, then a rock shaped like a turtle.",
        "And tonight we eat in a real {ger}!",
      ],
      legs: [
        {
          id: "zaisan",
          rides: [
            {
              line: "road",
              name: "Across the city",
              from: ["C", "Sansar"],
              to: ["C", "Zaisan"],
              mins: "15 min",
              video: { id: "maFvZa6JXZY", start: 1500, end: 2291 },
            },
          ],
          hana: [
            "We drive south through the city, across the Tuul river, to {Zaisan}.",
            "On top of the hill is a round monument with a painted ring, from 1971. About 300 steps lead up to it!",
            "From up there you see the whole city in its valley, and the forested mountain {Bogd Khan Uul} behind you.",
          ],
          stop: {
            kind: "sight",
            name: "Zaisan Memorial",
            jp: "Зайсан толгой",
            text: "A hilltop monument south of the city, a ring of painted mosaics reached by a long stairway, with a panorama of Ulaanbaatar.",
            walkLabel: "Foot of the hill → up the steps → the monument",
            mins: 10,
            o: "47.88691,106.91704",
            d: "47.88399,106.91551",
            tip: "Count the steps on your way up. Do you get to 300?",
          },
        },
        {
          id: "chinggis",
          rides: [
            {
              line: "steppe",
              name: "Road to Tsonjin Boldog",
              from: ["R", "Ulaanbaatar"],
              to: ["R", "Tsonjin Boldog"],
              mins: "1 h",
              video: { id: "CUp3tsSE3ZY" },
            },
          ],
          hana: [
            "Now east, out onto the grassy steppe. Look for horses, sheep and goats grazing by the road!",
            "Suddenly, there he is: {Chinggis Khaan} on his horse, 40 metres tall and shining silver.",
            "The story goes that young Chinggis found a golden whip right here. That's why the horse faces east, towards his birthplace.",
          ],
          stop: {
            kind: "sight",
            name: "Chinggis Khaan Statue",
            jp: "Чингис хааны морьт хөшөө",
            text: "The world's largest equestrian statue, of stainless steel, standing on a round museum building on the open steppe.",
            walkLabel: "Car park → the statue",
            mins: 4,
            o: "47.80811,107.52952",
            d: "47.80942,107.53038",
            tip: "You can take a lift up inside the horse and step out onto its head!",
          },
        },
        {
          id: "turtle",
          rides: [
            {
              line: "steppe",
              name: "Road into Terelj",
              from: ["R", "Tsonjin Boldog"],
              to: ["R", "Turtle Rock"],
              mins: "1 h",
              video: { id: "dvWriUTaW7g", start: 26, end: 588 },
            },
          ],
          hana: [
            "Into the mountains of {Gorkhi-Terelj National Park}: pine forests, rivers and strange-shaped rocks.",
            "One of them looks just like a giant turtle: {Melkhii Khad}, Turtle Rock!",
            "Can you see its head and its shell?",
          ],
          stop: {
            kind: "sight",
            name: "Turtle Rock",
            jp: "Мэлхий хад",
            text: "A granite rock about 24 metres high that looks like a turtle, in a green valley of Gorkhi-Terelj National Park.",
            walkLabel: "Road → around the rock",
            mins: 5,
            o: "47.90701,107.42284",
            d: "47.90750,107.42280",
          },
        },
        {
          id: "ger",
          hana: [
            "Our farewell dinner is in a {ger}, the round felt tent of the nomads. Its door always faces south!",
            "Inside, the stove stands in the middle. Guests sit on the left, and you must never step on the doorstep.",
            "Maybe someone plays the {morin khuur}, the horse-head fiddle. {Bayartai}, my friend!",
          ],
          stop: {
            kind: "dinner",
            name: "Dinner in a ger",
            jp: "Гэрт оройн хоол",
            cuisine: "Mongolian home cooking · Terelj",
            text: "A ger camp in the valley near Turtle Rock: white felt tents, a warm stove, and khuushuur and tea under a sky full of stars.",
            walkLabel: "Turtle Rock → the ger camp",
            mins: 5,
            o: "47.90750,107.42280",
            d: "47.90850,107.42150",
          },
        },
      ],
      wrapUp: [
        "A hill with a view, the biggest horse statue in the world, and a rock that looks like a turtle.",
        "And dinner in a real ger. {Bayarlalaa!}",
      ],
    },
  ],
  wrapUp: [
    "Two days, five rides, eight stops. You saw Mongolia from the train window, from the city and from the steppe!",
    "Street View pictures are taken on different days, so the seasons can change between two steps. The steppe is green in summer and white in winter.",
    "{Bayarlalaa} for travelling with me. {Bayartai!} Goodbye!",
  ],
};
