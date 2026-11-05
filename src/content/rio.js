// Rio de Janeiro with Thiago: two days, from the airport tram to the Selarón
// steps, the yellow tram of Santa Teresa and the Sugarloaf, then up the
// rack railway to Christ the Redeemer and down to Ipanema and Copacabana.
// Coordinates are WGS84 (OpenStreetMap); every walk starts within 70 m of a
// Street View panorama.
//
// In Thiago's lines, {braces} mark Portuguese words, shown in red.

export const RIO = {
  id: "rio",
  title: "Rio",
  jp: "Rio de Janeiro",
  tagline: "2 days · 6 rides · 8 stops",
  guide: { id: "thiago", name: "Thiago Santos", short: "Thiago" },
  available: true,
  lines: {
    vlt: { name: "VLT Carioca", color: "#2F7FC1" },
    bonde: { name: "Bonde de Santa Teresa", color: "#F2B705" },
    bondinho: { name: "Sugarloaf Cable Car", color: "#D2603F" },
    corcovado: { name: "Corcovado Rack Railway", color: "#3B8A4F" },
    m1: { name: "Metrô Line 1", color: "#F37021" },
  },
  days: [
    {
      id: "day1",
      num: "Day 1",
      title: "Steps, trams and the Sugarloaf",
      intro: [
        "{Olá!} I'm Thiago, a real {carioca}, that's what we call people from Rio. {Bem-vindo!} Welcome!",
        "Rio is called the {Cidade Maravilhosa}, the Marvellous City: mountains, forest and beaches, all in one city.",
        "Today: a tram from the airport, colourful steps, an old yellow tram over an aqueduct, and a cable car up the Sugarloaf. {Vamos!}",
      ],
      legs: [
        {
          id: "selaron",
          rides: [
            {
              line: "vlt",
              name: "VLT Carioca light rail",
              from: ["1", "Santos Dumont"],
              to: ["1", "Carioca"],
              mins: "15 min",
              video: { id: "EZSjaOERpy4" },
            },
          ],
          hana: [
            "We land at Santos Dumont, an airport right by the bay. It's named after a Brazilian who flew one of the first aeroplanes!",
            "The {VLT} is a modern tram, built for the Olympic Games in 2016. Look up: there are no wires! It gets its power from the ground.",
            "It glides through the old centre, past churches and squares. We get off at Carioca and walk to {Lapa}.",
            "Look around with your pad, and when you've seen enough, press {L + R} together.",
          ],
          stop: {
            kind: "sight",
            name: "Selarón Steps",
            jp: "Escadaria Selarón",
            text: "215 steps covered in more than 2,000 colourful tiles from all over the world, climbing from Lapa up to Santa Teresa.",
            walkLabel: "Arcos da Lapa → foot of the steps",
            mins: 6,
            o: "-22.91227,-43.17897",
            d: "-22.91544,-43.17945",
            tip: "The artist Jorge Selarón worked on the steps for over 20 years. Look for tiles from your own country!",
          },
        },
        {
          id: "santateresa",
          rides: [
            {
              line: "bonde",
              name: "Santa Teresa tram",
              from: ["B", "Carioca"],
              to: ["B", "Largo dos Guimarães"],
              mins: "15 min",
              video: { id: "N66wAJLpi4g" },
            },
          ],
          hana: [
            "Now the {bondinho}, the little yellow tram of Santa Teresa. Trams have climbed this hill since the 1870s!",
            "First it rolls over the {Arcos da Lapa}: white arches from 1750 that once carried water into the city. Now they carry the tram!",
            "Up the hill there are old villas, artists' houses and little bars. It feels like a village above the city.",
          ],
          stop: {
            kind: "sight",
            name: "Santa Teresa",
            jp: "Santa Teresa",
            text: "A hilltop neighbourhood of winding cobbled streets, old mansions and studios, with the ruins of a villa turned into a park with a view.",
            walkLabel: "Largo dos Guimarães → Parque das Ruínas",
            mins: 10,
            o: "-22.92166,-43.18608",
            d: "-22.91660,-43.18260",
            tip: "Climb the iron stairs in the Parque das Ruínas. From the top you see the whole bay!",
          },
        },
        {
          id: "sugarloaf",
          rides: [
            {
              line: "bondinho",
              name: "Sugarloaf cable car",
              from: ["1", "Praia Vermelha"],
              to: ["2", "Pão de Açúcar"],
              mins: "10 min",
              video: { id: "i0msXSquovA", start: 0, end: 165 },
            },
          ],
          hana: [
            "Now up the {Pão de Açúcar}, the Sugarloaf! The cable car has been running since 1912, one of the first in the world.",
            "It goes in two steps: first to Urca Hill, then over the sea to the top, 396 metres high.",
            "From up here you see Copacabana, the bay, the planes landing, and Christ the Redeemer on the other mountain.",
          ],
          stop: {
            kind: "sight",
            name: "Sugarloaf Mountain",
            jp: "Pão de Açúcar",
            text: "The granite dome at the mouth of Guanabara Bay, with paths and lookouts at the top over the beaches, the bay and the city.",
            walkLabel: "Cable car station → the lookout",
            mins: 5,
            o: "-22.94931,-43.15672",
            d: "-22.94860,-43.15600",
            tip: "Watch out for the little monkeys in the trees. They're called {micos} and they love fruit!",
          },
        },
        {
          id: "barurca",
          hana: [
            "Back down, we walk along the water in quiet {Urca} to {Bar Urca}.",
            "Everyone sits on the low sea wall, the {mureta}, with snacks, and watches the sun go down behind the mountains.",
            "Order {pastéis}, crispy pockets with cheese, and {bolinhos de bacalhau}, little fish balls. {Delícia!}",
          ],
          stop: {
            kind: "dinner",
            name: "Bar Urca",
            jp: "Bar Urca",
            cuisine: "Brazilian snacks & seafood · Urca",
            text: "A small bar and restaurant from 1939 on a corner by the bay, famous for its snacks eaten on the sea wall at sunset.",
            walkLabel: "Praia Vermelha → Avenida João Luís Alves → Bar Urca",
            mins: 20,
            o: "-22.95486,-43.16525",
            d: "-22.94351,-43.16020",
          },
        },
      ],
      wrapUp: [
        "Steps of tiles from all over the world, a tram over an aqueduct, and a cable car up the Sugarloaf.",
        "And snacks on the sea wall at sunset. Now you're a real {carioca}!",
        "Tomorrow: the most famous statue in Brazil, and the most famous beaches. {Boa noite!}",
      ],
    },
    {
      id: "day2",
      num: "Day 2",
      title: "Christ the Redeemer and the beaches",
      intro: [
        "{Bom dia!} Today we go really high, and then to the sea.",
        "A little train through the forest up to Christ the Redeemer, then Ipanema and Copacabana.",
        "And we finish in a café with giant mirrors, more than 125 years old.",
      ],
      legs: [
        {
          id: "cristo",
          rides: [
            {
              line: "corcovado",
              name: "Corcovado train",
              from: ["T", "Cosme Velho"],
              to: ["T", "Corcovado"],
              mins: "20 min",
              video: { id: "gdylbkGLnnY" },
            },
          ],
          hana: [
            "This train has a toothed rail in the middle, so it can climb the steep mountain. It's been running since 1884!",
            "We ride through the {Floresta da Tijuca}, one of the biggest forests in any city in the world.",
            "At the top stands {Cristo Redentor}, Christ the Redeemer: 30 metres tall, with arms 28 metres wide.",
            "He has stood here since 1931, and in 2007 he was chosen as one of the New Seven Wonders of the World.",
          ],
          stop: {
            kind: "sight",
            name: "Christ the Redeemer",
            jp: "Cristo Redentor",
            text: "The great statue of Christ with open arms on top of Corcovado mountain, 710 metres above the city, the bay and the beaches.",
            walkLabel: "Upper station → the terrace",
            mins: 3,
            o: "-22.95196,-43.21021",
            d: "-22.95192,-43.21046",
            tip: "Lie down on the ground for your photo, so the whole statue fits in. Everyone does it!",
          },
        },
        {
          id: "ipanema",
          rides: [
            {
              line: "m1",
              name: "Metrô Line 1",
              from: ["1", "Largo do Machado"],
              to: ["1", "General Osório"],
              mins: "15 min",
              video: { id: "-pJtgUWy-DE", start: 1500, end: 2340 },
            },
          ],
          hana: [
            "Down the mountain and onto the orange {metrô}. Line 1 takes us south to {Ipanema}.",
            "You might know a song about it: 'The Girl from Ipanema', from 1962. It's one of the most played songs in the world!",
            "At the end of the beach is the {Arpoador} rock. In the evening people sit on it and clap when the sun goes down.",
          ],
          stop: {
            kind: "sight",
            name: "Ipanema & Arpoador",
            jp: "Praia de Ipanema",
            text: "The long beach of Ipanema with the Two Brothers mountain at its end, and the Arpoador rock between Ipanema and Copacabana.",
            walkLabel: "General Osório → the beach → Arpoador rock",
            mins: 10,
            o: "-22.98425,-43.19814",
            d: "-22.98940,-43.19080",
          },
        },
        {
          id: "copacabana",
          hana: [
            "Around the corner is {Copacabana}, four kilometres of sand!",
            "Look down at the pavement: black and white stones in waves. The famous design is by the artist Roberto Burle Marx.",
            "On New Year's Eve, millions of people in white clothes come here for the fireworks.",
          ],
          stop: {
            kind: "sight",
            name: "Copacabana",
            jp: "Praia de Copacabana",
            text: "The world-famous beach and Avenida Atlântica, with kiosks, beach football and the wave-patterned promenade.",
            walkLabel: "Copacabana Fort → along the promenade",
            mins: 25,
            o: "-22.98578,-43.18933",
            d: "-22.97200,-43.18410",
            tip: "Buy a cold coconut from a kiosk and drink {água de coco} right out of it with a straw.",
          },
        },
        {
          id: "colombo",
          rides: [
            {
              line: "m1",
              name: "Metrô Line 1",
              from: ["1", "Cantagalo"],
              to: ["1", "Carioca"],
              mins: "15 min",
              video: { id: "q8_T8r_AQYI" },
            },
          ],
          hana: [
            "For our farewell dinner we ride back to the old centre, to {Confeitaria Colombo}.",
            "It opened in 1894. The huge mirrors on the walls came by ship all the way from Belgium!",
            "Try a {coxinha}, a chicken snack shaped like a drop, and a {pastel de nata} for dessert. {Obrigado} for coming with me!",
          ],
          stop: {
            kind: "dinner",
            name: "Confeitaria Colombo",
            jp: "Confeitaria Colombo",
            cuisine: "Brazilian & Portuguese · Centro",
            text: "A grand Belle Époque café in the old centre, with carved wood, giant mirrors and a stained-glass skylight.",
            walkLabel: "Rua Gonçalves Dias → Confeitaria Colombo",
            mins: 3,
            o: "-22.90498,-43.17736",
            d: "-22.90517,-43.17874",
          },
        },
      ],
      wrapUp: [
        "Christ the Redeemer, Ipanema at sunset, and the waves of Copacabana.",
        "And a farewell dinner in a palace of mirrors. {Que lindo!}",
      ],
    },
  ],
  wrapUp: [
    "Two days, six rides, eight stops. You saw Rio from the mountains, from the trams and from the beach!",
    "Street View pictures are taken on different days, so the sky can change between two steps. Rio is lovely in every weather.",
    "{Obrigado} for travelling with me. {Até logo!} See you soon!",
  ],
};
