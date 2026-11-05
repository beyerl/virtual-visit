// Nairobi with Amani: two days, from the airport on the new expressway to
// the conference tower and the railway that founded the city, then by
// matatu to the giraffes of Langata and on a game drive through the only
// national park in a capital city. Coordinates are WGS84 (OpenStreetMap);
// every walk starts within 60 m of a Street View panorama.
//
// In Amani's lines, {braces} mark Swahili words, shown in red.

export const NAIROBI = {
  id: "nairobi",
  title: "Nairobi",
  jp: "Enkare Nyirobi",
  tagline: "2 days · 4 rides · 6 stops",
  guide: { id: "amani", name: "Amani Wanjiru", short: "Amani" },
  available: true,
  lines: {
    expressway: { name: "Nairobi Expressway", color: "#2F6DB5" },
    matatu: { name: "Matatu", color: "#D2603F" },
    safari: { name: "Game drive", color: "#7FB356" },
  },
  days: [
    {
      id: "day1",
      num: "Day 1",
      title: "The city in the sun",
      intro: [
        "{Jambo!} I'm Amani, and my name means 'peace' in Swahili. {Karibu Nairobi!} Welcome to Nairobi!",
        "The name comes from the Maasai words {Enkare Nyirobi}: 'the place of cool water'.",
        "Today we drive in from the airport, climb a tower, and visit the railway that started the whole city. {Twende!} Let's go!",
      ],
      legs: [
        {
          id: "kicc",
          rides: [
            {
              line: "expressway",
              name: "Nairobi Expressway",
              from: ["E", "JKIA"],
              to: ["E", "Westlands"],
              mins: "20 min",
              video: { id: "55-NPOtNjUs", start: 600, end: 1860 },
            },
          ],
          hana: [
            "We land at Jomo Kenyatta Airport and take the {Expressway}: a highway on tall pillars, high above the traffic, opened in 2022.",
            "Down below, people are walking, selling fruit and riding motorbike taxis called {boda bodas}.",
            "Look at the skyline: the round tower is the {KICC}, where we're going first.",
            "Look around with your pad, and when you've seen enough, press {L + R} together.",
          ],
          stop: {
            kind: "sight",
            name: "Kenyatta International Convention Centre",
            jp: "KICC",
            text: "A 28-floor tower from 1973 next to a hall shaped like a traditional round hut, on City Square with the statue of Kenya's first president.",
            walkLabel: "City Hall Way → City Square → KICC",
            mins: 4,
            o: "-1.28793,36.82219",
            d: "-1.28870,36.82330",
            tip: "You can go up to the helipad on the roof. On a clear day you can see the Ngong Hills, and the national park right at the edge of the city!",
          },
        },
        {
          id: "railway",
          hana: [
            "Now we walk to the {Nairobi Railway Museum}. In 1899 there was nothing here but a swamp and a water stop for the new railway.",
            "The railway ran from the coast at Mombasa to Lake Victoria. People called it the 'Lunatic Express', because building it seemed so crazy!",
            "The water stop grew into a town, and the town into a city of more than four million people.",
          ],
          stop: {
            kind: "sight",
            name: "Nairobi Railway Museum",
            jp: "Makumbusho ya Reli",
            text: "Old steam locomotives and carriages from the Uganda Railway, in a yard next to Nairobi's main station.",
            walkLabel: "Moi Avenue → Haile Selassie Avenue → the museum",
            mins: 12,
            o: "-1.29053,36.82470",
            d: "-1.29361,36.82264",
            tip: "Look for the carriage from 1900 where a hungry lion climbed in through the door one night. True story!",
          },
        },
        {
          id: "thorntree",
          hana: [
            "For dinner we go to the {Thorn Tree Café} at the Stanley Hotel, from 1902.",
            "In the courtyard grows an acacia tree. For a hundred years, travellers pinned notes for each other on a board under it!",
            "We eat {nyama choma}, grilled meat, with {ugali}, a soft cornmeal cake you eat with your fingers. {Asante!}",
          ],
          stop: {
            kind: "dinner",
            name: "Thorn Tree Café",
            jp: "Thorn Tree Café",
            cuisine: "Kenyan & international · Stanley Hotel",
            text: "The open-air café of Nairobi's oldest hotel, on the corner of Kenyatta Avenue and Kimathi Street, around its famous acacia tree.",
            walkLabel: "Kenyatta Avenue → Kimathi Street",
            mins: 3,
            o: "-1.28371,36.82294",
            d: "-1.28438,36.82274",
          },
        },
      ],
      wrapUp: [
        "A highway in the sky, a tower with a helipad, and the railway that founded Nairobi.",
        "And dinner under the message tree. {Hakuna matata!}",
        "Tomorrow: giraffes, rhinos and lions! {Lala salama!} Sleep well!",
      ],
    },
    {
      id: "day2",
      num: "Day 2",
      title: "Giraffes and a safari in the city",
      intro: [
        "{Habari ya asubuhi!} Good morning! Today is animal day.",
        "First we ride a {matatu}, our colourful minibus, to feed the giraffes.",
        "Then a real safari: lions and rhinos, with the skyscrapers of Nairobi behind them!",
      ],
      legs: [
        {
          id: "giraffe",
          rides: [
            {
              line: "matatu",
              name: "Matatu to Karen",
              from: ["M", "CBD"],
              to: ["M", "Karen"],
              mins: "40 min",
              video: { id: "iTTkhbLrQd0" },
            },
          ],
          hana: [
            "Most people in Nairobi ride matatus. They're painted with pictures and play loud music. Some even have TVs inside!",
            "We ride out to {Karen}, a green part of town that, people say, is named after the writer Karen Blixen, who lived here on a coffee farm.",
            "At the {Giraffe Centre} you can feed Rothschild's giraffes from a high platform, eye to eye. {Twiga} means giraffe!",
          ],
          stop: {
            kind: "sight",
            name: "Giraffe Centre",
            jp: "Twiga",
            text: "A small sanctuary in Langata where rare Rothschild's giraffes come up to a raised wooden house to be fed, with a nature trail in the forest.",
            walkLabel: "Duma Road → the feeding platform",
            mins: 4,
            o: "-1.37490,36.74405",
            d: "-1.37656,36.74459",
            tip: "Hold a food pellet between your lips, and a giraffe will take it with its long blue-black tongue. A giraffe kiss!",
          },
        },
        {
          id: "ivory",
          rides: [
            {
              line: "safari",
              name: "Game drive, Nairobi National Park",
              from: ["P", "Main Gate"],
              to: ["P", "Ivory Burning Site"],
              mins: "game drive",
              video: { id: "um1NphnXjr4", start: 378, end: 1252 },
            },
          ],
          hana: [
            "{Nairobi National Park} was Kenya's very first national park, from 1946. It's the only one in the world next to a capital city!",
            "Look out for {twiga}, {pundamilia}, that's zebra, and {kifaru}, the rhino. And maybe {simba}, the lion!",
            "See the long bridge on legs? That's the new railway to Mombasa, crossing right over the park.",
            "We end at the {Ivory Burning Site}. Here, in 1989 and again in 2016, Kenya burned huge piles of ivory to say: elephants must not be killed for their tusks.",
          ],
          stop: {
            kind: "sight",
            name: "Ivory Burning Site",
            jp: "Ivory Burning Site",
            text: "A monument and picnic site in the park where Kenya burned its seized ivory, on open grassland near the main gate.",
            walkLabel: "Picnic site → the monument",
            mins: 3,
            o: "-1.34552,36.79714",
            d: "-1.34557,36.79709",
            tip: "Stay near the car! In this park the animals are wild, and you're their guest.",
          },
        },
        {
          id: "carnivore",
          rides: [
            {
              line: "safari",
              name: "Sunset drive",
              from: ["P", "Ivory Burning Site"],
              to: ["P", "Langata Road"],
              mins: "sunset",
              video: { id: "um1NphnXjr4", start: 1252, end: 1577 },
            },
          ],
          hana: [
            "The sun goes down over the savannah. What a sight!",
            "Our farewell dinner is next door, at {Carnivore}. The meat is roasted on big Maasai swords over a fire pit.",
            "The waiters bring the swords to your table and cut slices onto your plate. When you're full, you lower the little flag on your table! {Kwaheri}, my friend!",
          ],
          stop: {
            kind: "dinner",
            name: "Carnivore",
            jp: "Carnivore",
            cuisine: "Nyama choma · Langata",
            text: "A big open-air restaurant on Langata Road since 1980, famous for meat roasted on swords over a giant charcoal pit.",
            walkLabel: "Langata Road → the entrance",
            mins: 3,
            o: "-1.32903,36.80096",
            d: "-1.32923,36.80090",
          },
        },
      ],
      wrapUp: [
        "A matatu ride, a giraffe kiss, rhinos and lions in front of skyscrapers, and a sunset over the savannah.",
        "And dinner from a sword. {Asante sana!} Thank you very much!",
      ],
    },
  ],
  wrapUp: [
    "Two days, four rides, six stops. You saw Nairobi from the expressway to the savannah!",
    "Street View pictures are taken on different days, so the sky can change between two steps. The rains come in spring and in autumn.",
    "{Asante} for travelling with me. {Kwaheri!} Goodbye!",
  ],
};
