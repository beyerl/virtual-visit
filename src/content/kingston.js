// Kingston with Kemar: two days in Jamaica's capital, up Hope Road to Bob
// Marley's house, Emancipation Park and Devon House, then into the Blue
// Mountains, along the new waterfront, and out over the Palisadoes to old
// Port Royal. Coordinates are WGS84 (OpenStreetMap); every walk starts
// within 40 m of a Street View panorama.
//
// In Kemar's lines, {braces} mark Jamaican Patois words, shown in red.

export const KINGSTON = {
  id: "kingston",
  title: "Kingston",
  jp: "Jamaica",
  tagline: "2 days · 4 rides · 7 stops",
  guide: { id: "kemar", name: "Kemar Campbell", short: "Kemar" },
  available: true,
  lines: {
    hope: { name: "Along Hope Road", color: "#3B8A4F" },
    mountain: { name: "Into the Blue Mountains", color: "#2F6DB5" },
    downtown: { name: "Downtown drive", color: "#E0A540" },
    palisadoes: { name: "Palisadoes Road", color: "#D2603F" },
  },
  days: [
    {
      id: "day1",
      num: "Day 1",
      title: "Hope Road, reggae and ice cream",
      intro: [
        "{Wah gwaan!} What's up? I'm Kemar, and Kingston is my home. Welcome to Jamaica!",
        "Kingston is the city of reggae music. Bob Marley lived and played here, and his songs are known all over the world.",
        "Today: his house on Hope Road, a park with a famous statue, and the best ice cream on the island. {Mek wi go!} Let's go!",
      ],
      legs: [
        {
          id: "marley",
          rides: [
            {
              line: "hope",
              name: "Along Hope Road",
              from: ["H", "Half Way Tree"],
              to: ["H", "56 Hope Road"],
              mins: "8 min",
              video: { id: "WOg2KBtxuTg" },
            },
          ],
          hana: [
            "{Hope Road} runs from the middle of town up towards the mountains. Everyone in Kingston knows it.",
            "Look out of the window: fruit stands with mangoes, bananas, and coconuts you drink with a straw!",
            "At number 56 is the house where {Bob Marley} lived from 1975, with his recording studio, {Tuff Gong}.",
            "Look around with your pad, and when you've seen enough, press {L + R} together.",
          ],
          stop: {
            kind: "sight",
            name: "Bob Marley Museum",
            jp: "56 Hope Road",
            text: "Bob Marley's old wooden house on Hope Road, now a museum with his gold records, his bedroom, murals and a statue of him with his guitar in the yard.",
            walkLabel: "Hope Road → the museum gate",
            mins: 3,
            o: "18.01873,-76.78101",
            d: "18.01982,-76.77977",
            tip: "Look at the wall of colourful murals in the yard. Can you find Bob with his dreadlocks flying?",
          },
        },
        {
          id: "emancipation",
          hana: [
            "Now we walk down to {Emancipation Park}, in New Kingston.",
            "It's named after the day in 1838 when slavery ended in Jamaica. Every year on the 1st of August, we celebrate Emancipation Day.",
            "At the entrance stands a big bronze statue, 'Redemption Song', named after one of Bob Marley's songs: a man and a woman looking up to the sky.",
          ],
          stop: {
            kind: "sight",
            name: "Emancipation Park",
            jp: "Emancipation Park",
            text: "A green park from 2002 in New Kingston, with a jogging track, fountains and Laura Facey's 'Redemption Song' statue at its gate.",
            walkLabel: "Knutsford Boulevard → the park → the statue",
            mins: 6,
            o: "18.00614,-76.78893",
            d: "18.00300,-76.78960",
            tip: "In the evening, half of Kingston comes here to walk, jog and chat. {Yeah man!}",
          },
        },
        {
          id: "devon",
          hana: [
            "Dinner at {Devon House}, a white mansion from 1881. It was built by George Stiebel, the first Black millionaire in Jamaica!",
            "In the old stables and courtyards there are restaurants and a bakery. We eat {beef patties}, spicy pastries, and {ackee and saltfish}, our national dish.",
            "And then: {Devon House I-Scream}, famous all over the world. Try the {grape-nut} flavour! It's so {irie}!",
          ],
          stop: {
            kind: "dinner",
            name: "Devon House",
            jp: "Devon House",
            cuisine: "Jamaican · Hope Road",
            text: "A grand colonial mansion with verandas and lawns on Hope Road, with restaurants, a bakery and the famous ice cream parlour in its courtyards.",
            walkLabel: "Hope Road gate → the courtyard",
            mins: 3,
            o: "18.01500,-76.78995",
            d: "18.01440,-76.79040",
          },
        },
      ],
      wrapUp: [
        "Bob Marley's house, the Redemption Song statue, and ice cream at Devon House.",
        "{Big up yuhself!} That means well done!",
        "Tomorrow: the mountains, the sea, and a city of pirates. {Likkle more!} See you later!",
      ],
    },
    {
      id: "day2",
      num: "Day 2",
      title: "Mountains, waterfront and pirates",
      intro: [
        "{Mawnin!} Good morning! Today we drive a lot, so get comfortable.",
        "First up into the cool {Blue Mountains}, where some of the most famous coffee in the world grows.",
        "Then down to the harbour, and out on a long thin strip of land to Port Royal, the old city of pirates!",
      ],
      legs: [
        {
          id: "irishtown",
          rides: [
            {
              line: "mountain",
              name: "Into the Blue Mountains",
              from: ["B", "Papine"],
              to: ["B", "Irish Town"],
              mins: "25 min",
              video: { id: "c4g1k2qG30I" },
            },
          ],
          hana: [
            "From Papine the road winds up and up, with hundreds of curves, through the green forest.",
            "Up here it's much cooler than in the city. Sometimes the mountains are in the clouds!",
            "The {Blue Mountains} are up to 2,256 metres high. Blue Mountain coffee is one of the most expensive coffees in the world.",
          ],
          stop: {
            kind: "sight",
            name: "Irish Town",
            jp: "Blue Mountains",
            text: "A little village high in the Blue Mountains above Kingston, with a café, coffee farms on the slopes and views down to the city and the sea.",
            walkLabel: "Newcastle Road → the village",
            mins: 5,
            o: "18.05038,-76.72614",
            d: "18.05160,-76.72500",
            tip: "Look for the coffee bushes on the hillsides. The red berries are the coffee cherries!",
          },
        },
        {
          id: "waterfront",
          rides: [
            {
              line: "downtown",
              name: "Downtown Kingston",
              from: ["D", "Port Royal Street"],
              to: ["D", "Ocean Boulevard"],
              mins: "10 min",
              video: { id: "-tely0lQg1c" },
            },
          ],
          hana: [
            "Back down the mountain to {downtown Kingston}, by the harbour.",
            "Kingston Harbour is one of the biggest natural harbours in the world. Look at the huge cargo ships!",
            "The new {waterfront} has a promenade by the sea, and the National Gallery is right next to it.",
          ],
          stop: {
            kind: "sight",
            name: "Kingston Waterfront",
            jp: "Ocean Boulevard",
            text: "The renewed seafront of downtown Kingston, with a promenade along the harbour and the National Gallery of Jamaica a block away.",
            walkLabel: "Ocean Boulevard → the National Gallery",
            mins: 5,
            o: "17.96522,-76.79212",
            d: "17.96478,-76.79469",
          },
        },
        {
          id: "portroyal",
          rides: [
            {
              line: "palisadoes",
              name: "Palisadoes Road",
              from: ["P", "Harbour View"],
              to: ["P", "Port Royal"],
              mins: "20 min",
              video: { id: "hVvFdkXvHQ8", start: 37, end: 540 },
            },
          ],
          hana: [
            "This road runs along the {Palisadoes}, a long, thin strip of sand with the sea on both sides. The airport is on it too!",
            "At the very end is {Port Royal}. 350 years ago it was the richest and wildest town in the Caribbean, full of pirates like Henry Morgan!",
            "In 1692 an earthquake sank two thirds of the town into the sea. Divers still find old treasure down there.",
          ],
          stop: {
            kind: "sight",
            name: "Fort Charles",
            jp: "Port Royal",
            text: "A brick fort from the 1650s at the tip of the Palisadoes, with cannons facing the sea and the Giddy House next to it.",
            walkLabel: "Port Royal → Fort Charles",
            mins: 4,
            o: "17.93695,-76.84159",
            d: "17.93660,-76.84300",
            tip: "The Giddy House was tilted by another earthquake in 1907. Walk inside and you'll feel dizzy!",
          },
        },
        {
          id: "glorias",
          hana: [
            "Our farewell dinner is at {Gloria's}, right by the water in Port Royal.",
            "We eat {escovitch fish}: fried fish with spicy pickled onions and carrots, with {festival}, a sweet fried dumpling, and {bammy}, a flat bread of cassava.",
            "And we watch the boats come in. {One love}, my friend!",
          ],
          stop: {
            kind: "dinner",
            name: "Gloria's",
            jp: "Gloria's",
            cuisine: "Jamaican seafood · Port Royal",
            text: "A much-loved seafood restaurant on the waterfront of Port Royal, with tables on a terrace over the water.",
            walkLabel: "Fort Charles → Foreshore Road",
            mins: 5,
            o: "17.93695,-76.84159",
            d: "17.93803,-76.83890",
          },
        },
      ],
      wrapUp: [
        "The cool Blue Mountains, the harbour, the pirates' town and a fort with a crooked house.",
        "And escovitch fish by the sea. {Yeah man!}",
      ],
    },
  ],
  wrapUp: [
    "Two days, four rides, seven stops. You saw Kingston from the mountains to the sea!",
    "Street View pictures are taken on different days, so the sky can change between two steps. But it's always warm in Jamaica!",
    "Thanks for travelling with me. {Walk good!} That means take care!",
  ],
};
