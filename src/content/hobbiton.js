// Hobbiton with Tama: one day at the Hobbiton Movie Set near Matamata, in
// the Waikato on New Zealand's North Island. From the hobbit-style visitor
// centre in town over the country roads to the Shire's Rest, by tour bus
// onto the farm, and then on foot past the gardens up to Bag End, down to
// the Party Tree, over the bridge by the mill and into the Green Dragon.
// Coordinates are WGS84 (OpenStreetMap). The set has no official Street
// View: its stops are visitors' photo spheres, and every walk starts
// within 15 m of one.
//
// In Tama's lines, {braces} mark Māori words and the names of places, shown in red.

export const HOBBITON = {
  id: "hobbiton",
  title: "Hobbiton",
  jp: "Matamata, Aotearoa",
  tagline: "1 day · 3 rides · 7 stops",
  guide: { id: "tama", name: "Tama Greenhill", short: "Tama" },
  available: true,
  lines: {
    town: { name: "Through Matamata", color: "#D2603F" },
    country: { name: "Country roads", color: "#7FB356" },
    tourbus: { name: "Tour bus", color: "#3B8A4F" },
  },
  days: [
    {
      id: "day1",
      num: "Day 1",
      title: "A day in the Shire",
      intro: [
        "{Kia ora!} I'm Tama, and I'm a guide at the {Hobbiton} Movie Set. {Haere mai!} Welcome to New Zealand!",
        "In Māori, our country is called {Aotearoa}: 'the land of the long white cloud'.",
        "The Lord of the Rings and The Hobbit films were made here. Their village of the hobbits is still standing, on a sheep farm in the green hills.",
        "Today we drive through the little town of {Matamata}, ride a bus onto the farm, and walk through the whole village. Sweet as! Let's go!",
      ],
      legs: [
        {
          id: "isite",
          rides: [
            {
              line: "town",
              name: "Through Matamata",
              from: ["M", "State Highway 27"],
              to: ["M", "Broadway"],
              mins: "5 min",
              video: { id: "cBZWhrGZdVc" },
            },
          ],
          hana: [
            "This is {Matamata}, a farming town of about nine thousand people in the {Waikato}. Here in New Zealand we drive on the left!",
            "The land around is flat and very green. It's famous for dairy cows and for racehorses.",
            "See the long blue mountains behind the town? That's the {Kaimai} Range.",
            "Since the films, the main street has a surprise: a visitor centre that looks like a hobbit house!",
            "Look around with your pad, and when you've seen enough, press {L + R} together.",
          ],
          stop: {
            kind: "sight",
            name: "Matamata i-SITE",
            jp: "Gatehouse",
            text: "The town's visitor centre, rebuilt in 2013 as a crooked, thatched hobbit-style gatehouse with round windows, at the top of the main street, Broadway.",
            walkLabel: "Hetana Street → the i-SITE",
            mins: 2,
            o: "-37.80951,175.77216",
            d: "-37.80930,175.77205",
            tip: "Look for the round door and the round windows. Nothing in a hobbit house is quite straight!",
          },
        },
        {
          id: "shiresrest",
          rides: [
            {
              line: "country",
              name: "Country roads to Buckland Road",
              from: ["C", "Matamata"],
              to: ["C", "The Shire's Rest"],
              mins: "20 min",
              video: { id: "8dtIXBz5wOU" },
            },
          ],
          hana: [
            "Now we drive out of town, past paddocks full of cows and sheep. A paddock is what we call a field.",
            "In 1998 the film director Peter Jackson flew over these hills, looking for a place for the hobbits' village.",
            "From the air he saw the {Alexander} family's farm: round green hills, a lake and one big tree beside it. Just like in the book!",
            "The New Zealand Army helped to build a road onto the farm. And it's still a real farm, with about thirteen thousand sheep!",
            "The tours start at {The Shire's Rest}. It used to be the farm's woolshed.",
          ],
          stop: {
            kind: "sight",
            name: "The Shire's Rest",
            jp: "501 Buckland Road",
            text: "The ticket office, café and shop of the Hobbiton Movie Set tours on the Alexander farm, where the green tour buses leave for the set.",
            walkLabel: "Buckland Road → the café",
            mins: 2,
            o: "-37.87222,175.68347",
            d: "-37.87210,175.68300",
            tip: "Look across the road: the film set is hidden behind those hills. You can't see it from anywhere outside!",
          },
        },
        {
          id: "cutting",
          rides: [
            {
              line: "tourbus",
              name: "Tour bus onto the farm",
              from: ["B", "The Shire's Rest"],
              to: ["B", "Hobbiton"],
              mins: "10 min",
              video: { id: "kIAe5hFv42E" },
            },
          ],
          hana: [
            "All aboard the green bus! Only the tour buses may drive onto the farm.",
            "The first village was made of plywood and plastic foam for The Lord of the Rings. After filming, most of it was taken down.",
            "For The Hobbit films it was built again in 2011, this time to stay: with real wood, bricks and stone. There are forty-four hobbit holes!",
            "We walk in through {Gandalf's Cutting}, a narrow path between two banks. In the film, the wizard's cart rolls through here.",
          ],
          stop: {
            kind: "sight",
            name: "Gandalf's Cutting & the gardens",
            jp: "The way in",
            text: "The path into the set, opening onto the first hobbit holes and the vegetable gardens, with the whole village on the hillside behind.",
            walkLabel: "Gandalf's Cutting → the vegetable gardens",
            mins: 3,
            o: "-37.85764,175.68193",
            d: "-37.85775,175.68143",
            tip: "The vegetables are real! Gardeners grow pumpkins, cabbages and beans here all year. On the set you jump from one visitor's photo to the next.",
          },
        },
        {
          id: "bagend",
          hana: [
            "Now we climb the hill along {Bagshot Row}. Look at the doors: every hobbit hole has its own colour.",
            "Some holes are small and some are big. Next to a small door an actor looks as tall as a wizard, and next to a big door as small as a hobbit!",
            "Behind most doors there is only earth. The rooms were filmed in a studio in Wellington. But since 2023 you can walk through two real hobbit homes here.",
            "At the very top is {Bag End}, the most famous hole of all, with its green door.",
          ],
          stop: {
            kind: "sight",
            name: "Bag End",
            jp: "The Hill",
            text: "The hobbit hole at the top of the hill, home of Bilbo and Frodo Baggins in the films, with a round green door and a big oak tree above it.",
            walkLabel: "Bagshot Row → Bag End",
            mins: 5,
            o: "-37.85737,175.68012",
            d: "-37.85757,175.67987",
            tip: "The oak above Bag End is not real! It's made of steel and plastic, and about two hundred thousand leaves were wired on by hand.",
          },
        },
        {
          id: "partytree",
          hana: [
            "Down the hill we go, to the {Party Field}. This is where Bilbo's big birthday party was filmed, with fireworks and dancing.",
            "The huge tree by the water is the {Party Tree}. It's a real pine, more than a hundred years old. It's the tree Peter Jackson saw from the air!",
            "Look for the maypole, the swings and the seesaw. Hobbits love a party.",
          ],
          stop: {
            kind: "sight",
            name: "The Party Tree",
            jp: "Party Field",
            text: "A meadow below the hill with a maypole, tents and fences, next to the giant old pine that made the film-makers choose this farm.",
            walkLabel: "Party Field → the Party Tree",
            mins: 3,
            o: "-37.85784,175.68060",
            d: "-37.85806,175.68087",
            tip: "In the films the farm's own sheep don't appear: sheep with black faces were brought in, because they look more like old English ones!",
          },
        },
        {
          id: "mill",
          hana: [
            "We follow the path along the lake to the {Mill}. Listen: its water wheel really turns!",
            "Next to it is the stone bridge with two arches. In the film, Gandalf drives his cart full of fireworks over it.",
            "The roofs here are thatched with rushes that were cut on the farm.",
          ],
          stop: {
            kind: "sight",
            name: "The Mill & the bridge",
            jp: "Bywater",
            text: "A thatched watermill with a turning wheel and a double-arched stone bridge over the lake, on the way to the inn.",
            walkLabel: "The Mill → the stone bridge",
            mins: 2,
            o: "-37.85939,175.68069",
            d: "-37.85961,175.68079",
            tip: "Stop in the middle of the bridge and look back. You can see the whole village, with Bag End at the top!",
          },
        },
        {
          id: "dragon",
          hana: [
            "Every tour ends at the {Green Dragon}, the hobbits' inn. In the film it burns down, so this one was built new in 2012.",
            "Inside there are fireplaces, round windows and deep armchairs. Every visitor gets a drink in a pottery mug. For you and me: ginger beer!",
            "And there's {kai}, that's food: a warm beef pie and a scone. {Ka pai!} That means 'good'!",
          ],
          stop: {
            kind: "dinner",
            name: "The Green Dragon Inn",
            jp: "Bywater",
            cuisine: "Pies, scones & ginger beer · Hobbiton",
            text: "A thatched inn on the lake with carved beams, open fires and a beer garden, where every tour of the set ends with a drink.",
            walkLabel: "Bywater Road → the inn",
            mins: 2,
            o: "-37.85934,175.68151",
            d: "-37.85968,175.68132",
          },
        },
      ],
      wrapUp: [
        "A hobbit house in town, a bus onto a sheep farm, forty-four round doors, a tree that isn't a tree and a tree that is.",
        "And a mug of ginger beer by the fire in the Green Dragon. {Ka rawe!} Awesome!",
      ],
    },
  ],
  wrapUp: [
    "One day, three rides, seven stops. You walked through the whole village of the hobbits!",
    "The pictures on the set were taken by visitors on different days, so the sky and the flowers can change between two steps.",
    "{Ka kite anō!} See you again! And as we say in New Zealand: sweet as!",
  ],
};
