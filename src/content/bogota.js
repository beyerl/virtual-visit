// Bogotá with Valentina: two days in the city high in the Andes, from the
// old town of La Candelaria and the Gold Museum up to Monserrate, over the
// hills of Ciudad Bolívar in a cable car, and north to the Zona T.
// Coordinates are WGS84 (OpenStreetMap); every walk starts within 25 m of a
// Street View panorama.
//
// In Valentina's lines, {braces} mark Spanish words, shown in red.

export const BOGOTA = {
  id: "bogota",
  title: "Bogotá",
  jp: "Bogotá D.C.",
  tagline: "2 days · 4 rides · 8 stops",
  guide: { id: "vale", name: "Valentina Rojas", short: "Valentina" },
  available: true,
  lines: {
    tm: { name: "TransMilenio", color: "#C8102E" },
    funicular: { name: "Monserrate Funicular", color: "#3D8A8C" },
    cable: { name: "TransMiCable", color: "#7FB356" },
  },
  days: [
    {
      id: "day1",
      num: "Day 1",
      title: "Gold, graffiti and the old town",
      intro: [
        "{¡Hola!} I'm Valentina, but everyone calls me Vale. {¡Bienvenidos a Bogotá!}",
        "Bogotá lies 2,640 metres up in the Andes mountains. That's higher than many ski resorts! So walk slowly and drink a lot of water.",
        "Today: the red buses of TransMilenio, a museum full of gold, the place where Bogotá was born, and soup for dinner. {¡Vamos!}",
      ],
      legs: [
        {
          id: "oro",
          rides: [
            {
              line: "tm",
              name: "TransMilenio",
              from: ["TM", "Av. Jiménez"],
              to: ["TM", "Las Aguas"],
              mins: "8 min",
              video: { id: "obYZtAgIs-4" },
            },
          ],
          hana: [
            "This is {TransMilenio}: long red buses with their own lanes and stations, like a metro on the street. More than two million rides a day!",
            "We ride along the {Eje Ambiental}. Look at the little stream running next to the road. It's the old San Francisco river, brought back to the surface.",
            "At Las Aguas we get out and walk to the {Museo del Oro}, the Gold Museum.",
            "Look around with your pad, and when you've seen enough, press {L + R} together.",
          ],
          stop: {
            kind: "sight",
            name: "Gold Museum",
            jp: "Museo del Oro",
            text: "The world's largest collection of pre-Columbian gold, more than 30,000 pieces, at the corner of Parque Santander.",
            walkLabel: "Las Aguas → Eje Ambiental → Parque Santander",
            mins: 10,
            o: "4.60082,-74.06656",
            d: "4.60184,-74.07185",
            tip: "Inside is the golden Muisca raft. It tells the story of a chief covered in gold dust: the legend of {El Dorado}!",
          },
        },
        {
          id: "chorro",
          hana: [
            "Now uphill into {La Candelaria}, the oldest part of the city, with colourful colonial houses.",
            "The walls are covered in graffiti. In Bogotá, street art is so loved that people come on special graffiti tours!",
            "We're going to the {Chorro de Quevedo}, a little square. The story goes that Bogotá was founded right here, in 1538.",
          ],
          stop: {
            kind: "sight",
            name: "Chorro de Quevedo",
            jp: "Chorro de Quevedo",
            text: "A tiny square with a white chapel and a fountain, where street performers, students and storytellers meet, next to the graffiti alley of El Embudo.",
            walkLabel: "Parque Santander → La Candelaria → Chorro de Quevedo",
            mins: 12,
            o: "4.60185,-74.07183",
            d: "4.59723,-74.06971",
            tip: "Peek into the Callejón del Embudo, the 'funnel alley'. Every wall is painted!",
          },
        },
        {
          id: "bolivar",
          hana: [
            "Down the hill to the biggest square in town, the {Plaza de Bolívar}.",
            "In the middle stands Simón Bolívar, who freed Colombia and five other countries from Spanish rule. People call him {El Libertador}.",
            "Around the square: the cathedral, the Capitol, the town hall and the Palace of Justice. And hundreds of pigeons!",
          ],
          stop: {
            kind: "sight",
            name: "Plaza de Bolívar",
            jp: "Plaza de Bolívar",
            text: "Bogotá's main square, with the Primatial Cathedral, the columns of the National Capitol and a bronze statue of Bolívar from 1846.",
            walkLabel: "Chorro de Quevedo → Calle 11 → the square",
            mins: 10,
            o: "4.59723,-74.06970",
            d: "4.59817,-74.07600",
          },
        },
        {
          id: "puertafalsa",
          hana: [
            "Dinner is just around the corner, at {La Puerta Falsa}, the 'false door'. It's been cooking since 1816!",
            "We eat {ajiaco}: a soup with chicken, corn and three kinds of potato, with cream and capers on top.",
            "And for dessert, {chocolate santafereño}: hot chocolate with a piece of cheese in it. Yes, really, it's delicious!",
          ],
          stop: {
            kind: "dinner",
            name: "La Puerta Falsa",
            jp: "La Puerta Falsa",
            cuisine: "Bogotá classics · La Candelaria",
            text: "A tiny restaurant next to the cathedral, one of the oldest in Colombia, famous for tamales, ajiaco and hot chocolate.",
            walkLabel: "Plaza de Bolívar → Calle 11",
            mins: 2,
            o: "4.59818,-74.07598",
            d: "4.59792,-74.07468",
            tip: "Drop the cheese into your hot chocolate, wait until it melts, then fish it out with your spoon.",
          },
        },
      ],
      wrapUp: [
        "A museum full of gold, the graffiti of La Candelaria, the square of the Liberator, and soup with three kinds of potato.",
        "{¡Qué chévere!} How cool! You're already a real {rolo}, that's what we call people from Bogotá.",
        "Tomorrow we go up into the mountains, twice! {¡Buenas noches!}",
      ],
    },
    {
      id: "day2",
      num: "Day 2",
      title: "Up the mountain and over the hills",
      intro: [
        "{¡Buenos días!} Have a {tinto}, a little cup of black coffee. Colombia grows some of the best coffee in the world!",
        "This morning we ride up Monserrate, the mountain above the city. Then a cable car over the hills of the south.",
        "In the evening we go north for a big party dinner.",
      ],
      legs: [
        {
          id: "monserrate",
          rides: [
            {
              line: "funicular",
              name: "Monserrate funicular",
              from: ["F", "Lower station"],
              to: ["F", "Monserrate"],
              mins: "4 min",
              video: { id: "a322RScS7Eg" },
            },
          ],
          hana: [
            "This little train is pulled up the mountain on a cable. It has been climbing since 1929, and it's really steep!",
            "{Monserrate} is 3,152 metres high. On top stands a white church from the 17th century.",
            "Pilgrims climb all the way on foot, up 1,500 steps. We'll take the train today!",
          ],
          stop: {
            kind: "sight",
            name: "Monserrate",
            jp: "Cerro de Monserrate",
            text: "The mountain above Bogotá with its white sanctuary, gardens and market stalls, and a view over the whole city spread across the plateau.",
            walkLabel: "Funicular station → the sanctuary",
            mins: 6,
            o: "4.60359,-74.05522",
            d: "4.60562,-74.05549",
            tip: "Look for the stalls with {obleas}: thin wafers filled with sweet caramel called {arequipe}.",
          },
        },
        {
          id: "paraiso",
          rides: [
            {
              line: "cable",
              name: "TransMiCable",
              from: ["C", "Portal Tunal"],
              to: ["C", "Mirador del Paraíso"],
              mins: "13 min",
              video: { id: "G1hgP614WXU" },
            },
          ],
          hana: [
            "Now a cable car that's part of the bus network: {TransMiCable}, opened in 2018.",
            "It flies over the steep hills of {Ciudad Bolívar}, where houses climb up the slopes. The trip down used to take an hour on bumpy roads, now it takes about 13 minutes!",
            "At the top station, the neighbours have painted murals and built a lookout over the city.",
          ],
          stop: {
            kind: "sight",
            name: "Mirador del Paraíso",
            jp: "Mirador del Paraíso",
            text: "The top station of the TransMiCable, high above Ciudad Bolívar, with colourful houses, murals and a view across the whole of Bogotá.",
            walkLabel: "Cable car station → the lookout",
            mins: 4,
            o: "4.55022,-74.15891",
            d: "4.55008,-74.15877",
          },
        },
        {
          id: "parque93",
          rides: [
            {
              line: "tm",
              name: "TransMilenio",
              from: ["TM", "Concejo de Bogotá"],
              to: ["TM", "Calle 76"],
              mins: "20 min",
              video: { id: "PZ1nWJtlMjo" },
            },
          ],
          hana: [
            "Back on a red {TransMilenio} bus, all the way north. Watch for the building sites: Bogotá is building its first metro line!",
            "The north is modern: glass towers, shopping streets and lots of parks.",
            "We walk through the {Zona T}, a T-shaped street full of shops, to the {Parque de la 93}.",
          ],
          stop: {
            kind: "sight",
            name: "Parque de la 93",
            jp: "Parque de la 93",
            text: "A green square in the north of the city, ringed by cafés and restaurants, with big trees and lawns where families play.",
            walkLabel: "Calle 76 → Zona T → Parque de la 93",
            mins: 25,
            o: "4.66335,-74.05801",
            d: "4.67677,-74.04829",
          },
        },
        {
          id: "andres",
          hana: [
            "Our farewell dinner is at {Andrés D.C.}, the craziest restaurant in town!",
            "It has four floors called Hell, Earth, Purgatory and Heaven, full of lanterns, hearts and old signs.",
            "We eat {arepas}, grilled meat and {patacones}, crispy fried plantain. And sometimes the waiters start dancing!",
          ],
          stop: {
            kind: "dinner",
            name: "Andrés D.C.",
            jp: "Andrés Carne de Res",
            cuisine: "Colombian grill · Zona T",
            text: "The city branch of the famous Andrés Carne de Res: a restaurant and party hall decorated from floor to ceiling, with music and dancing.",
            walkLabel: "Parque de la 93 → Calle 82",
            mins: 18,
            o: "4.67678,-74.04830",
            d: "4.66608,-74.05397",
          },
        },
      ],
      wrapUp: [
        "A train up the mountain, a cable car over the hills, and the parks of the north.",
        "And dinner in heaven, or was it hell? {¡Qué chévere!}",
      ],
    },
  ],
  wrapUp: [
    "Two days, four rides, eight stops. You saw Bogotá from the old town to the mountain tops!",
    "Street View pictures are taken on different days, so the weather can change between two steps. In Bogotá that happens anyway: sun, rain and sun again in one afternoon!",
    "{¡Gracias!} Thank you for travelling with me. {¡Chao!}",
  ],
};
