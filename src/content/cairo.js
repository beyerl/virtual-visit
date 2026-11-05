// Cairo with Omar: two days, from the metro under Tahrir Square over the
// lion bridge and onto the Nile in a felucca, then down Pyramids Street to
// Giza and the Sphinx, and back to the old bazaar of Khan el-Khalili.
// Coordinates are WGS84 (OpenStreetMap); every walk starts within 60 m of a
// Street View panorama (most of Cairo's are user photospheres).
//
// In Omar's lines, {braces} mark Arabic words, shown in red.

export const CAIRO = {
  id: "cairo",
  title: "Cairo",
  jp: "القاهرة",
  tagline: "2 days · 4 rides · 8 stops",
  guide: { id: "omar", name: "Omar Hassan", short: "Omar" },
  available: true,
  lines: {
    m1: { name: "Cairo Metro Line 1", color: "#D32F2F" },
    felucca: { name: "Felucca on the Nile", color: "#3D8A8C" },
    car: { name: "By car", color: "#E0A540" },
    scooter: { name: "By scooter", color: "#7FB356" },
  },
  days: [
    {
      id: "day1",
      num: "Day 1",
      title: "Tahrir, the Nile and the tower",
      intro: [
        "{Ahlan wa sahlan!} Welcome! I'm Omar, and this is my city, Cairo.",
        "We call it {Umm al-Dunya}, the Mother of the World. More than 20 million people live in and around it, the biggest city in Africa!",
        "Today: the metro, a bridge with four lions, a sailboat on the Nile and a tower shaped like a flower. {Yalla!} Let's go!",
      ],
      legs: [
        {
          id: "tahrir",
          rides: [
            {
              line: "m1",
              name: "Cairo Metro Line 1",
              from: ["1", "Mar Girgis"],
              to: ["1", "Sadat"],
              mins: "8 min",
              video: { id: "QFeOM9Xbgfw" },
            },
          ],
          hana: [
            "We start in Coptic Cairo, one of the oldest parts of the city, with churches built on Roman walls.",
            "The Cairo Metro opened in 1987, the very first metro in Africa! Some cars are only for women. Look for the signs.",
            "We come up at {Tahrir Square}, 'Liberation Square', the big round square in the middle of the city.",
            "Look around with your pad, and when you've seen enough, press {L + R} together.",
          ],
          stop: {
            kind: "sight",
            name: "Tahrir Square",
            jp: "ميدان التحرير",
            text: "Cairo's central square, with an obelisk in the middle, and on its north side the pink Egyptian Museum from 1902.",
            walkLabel: "Sadat Station → the obelisk → Egyptian Museum",
            mins: 6,
            o: "30.04465,31.23516",
            d: "30.04797,31.23361",
            tip: "The pink museum holds more than 100,000 ancient objects. Some of the most famous ones moved to the new Grand Egyptian Museum near the pyramids.",
          },
        },
        {
          id: "qasrnil",
          hana: [
            "A few steps west and we're at the {Nile}, the longest river in Africa. Without it there would be only desert here!",
            "We cross the {Qasr al-Nil Bridge}. At each end sit two big bronze lions, guarding it since the 1870s.",
            "In the evening families come here to walk, eat corn on the cob and watch the boats.",
          ],
          stop: {
            kind: "sight",
            name: "Qasr al-Nil Bridge",
            jp: "كوبري قصر النيل",
            text: "The bridge from Tahrir to Gezira Island, with four bronze lions at its ends and wide views up and down the Nile.",
            walkLabel: "Tahrir → the lions → onto the bridge",
            mins: 6,
            o: "30.04420,31.23295",
            d: "30.04369,31.22983",
          },
        },
        {
          id: "tower",
          rides: [
            {
              line: "felucca",
              name: "Felucca on the Nile",
              from: ["F", "Corniche"],
              to: ["F", "Gezira"],
              mins: "30 min",
              video: { id: "G7e1--68Dpg" },
            },
          ],
          hana: [
            "Now a {felucca}: a wooden sailboat with one big triangle sail. Egyptians have sailed boats like this on the Nile for thousands of years.",
            "There's no motor. The wind pushes us, and the captain steers with a long wooden rudder.",
            "Ahead on Gezira Island stands the {Cairo Tower}, 187 metres high. Its shape is a lotus flower, the old symbol of Egypt!",
          ],
          stop: {
            kind: "sight",
            name: "Cairo Tower",
            jp: "برج القاهرة",
            text: "A slender concrete tower from 1961 covered in a lattice like a lotus, on Gezira Island, with a lookout over the whole city.",
            walkLabel: "Gezira riverside → the tower gardens",
            mins: 8,
            o: "30.04349,31.22800",
            d: "30.04601,31.22431",
            tip: "On a clear day you can see the pyramids from the top of the tower!",
          },
        },
        {
          id: "abouelsid",
          hana: [
            "Dinner is in {Zamalek}, the leafy north end of the island, at {Abou El Sid}.",
            "It looks like an old Cairo living room, with lamps, carpets and old photos.",
            "Try {molokhia}, a green soup with rice, and {ta'ameya}: our Egyptian falafel, made from broad beans. {Bil hana wa shifa!} Enjoy your meal!",
          ],
          stop: {
            kind: "dinner",
            name: "Abou El Sid",
            jp: "أبو السيد",
            cuisine: "Egyptian home cooking · Zamalek",
            text: "A cosy restaurant in Zamalek decorated like an old Cairo home, serving Egyptian classics like molokhia, stuffed pigeon and koshari.",
            walkLabel: "26th of July Street → Abou El Sid",
            mins: 4,
            o: "30.05724,31.22466",
            d: "30.05944,31.22425",
          },
        },
      ],
      wrapUp: [
        "The first metro in Africa, a bridge with lions, a sailboat on the Nile, and a lotus tower.",
        "And molokhia for dinner. {Shukran} for a wonderful day! That means thank you.",
        "Tomorrow: the pyramids! {Tisbah 'ala khair!} Good night!",
      ],
    },
    {
      id: "day2",
      num: "Day 2",
      title: "Pyramids, the Sphinx and the old bazaar",
      intro: [
        "{Sabah al-khair!} Good morning! Today is the big day.",
        "We drive down Pyramids Street to Giza, to the only one of the Seven Wonders of the Ancient World that still stands.",
        "Then we ride through old Cairo to a bazaar more than 600 years old.",
      ],
      legs: [
        {
          id: "pyramids",
          rides: [
            {
              line: "car",
              name: "Pyramids Street",
              from: ["G", "Giza"],
              to: ["G", "Pyramids"],
              mins: "18 min",
              video: { id: "HYb15vLpjIA", start: 12, end: 1067 },
            },
          ],
          hana: [
            "This is {Shari' al-Haram}, Pyramids Street. {Haram} means pyramid!",
            "It's busy and loud: cars, buses, donkey carts and everyone honking. That's Cairo!",
            "And then, behind the houses: the {pyramids}. The Great Pyramid of Khufu is about 4,500 years old.",
            "It's made of over two million stone blocks, and for almost 4,000 years it was the tallest building in the world.",
          ],
          stop: {
            kind: "sight",
            name: "Pyramids of Giza",
            jp: "أهرامات الجيزة",
            text: "The pyramids of Khufu, Khafre and Menkaure on the desert plateau at the edge of the city, built as tombs for three pharaohs.",
            walkLabel: "Great Pyramid → across the plateau → Pyramid of Khafre",
            mins: 12,
            o: "29.97918,31.13426",
            d: "29.97599,31.13074",
            tip: "Look at the top of Khafre's pyramid: a bit of the smooth white stone that once covered all of them is still there!",
          },
        },
        {
          id: "sphinx",
          hana: [
            "Downhill, guarding the pyramids, lies the {Great Sphinx}: the body of a lion with the head of a king.",
            "It's 73 metres long and 20 metres high, carved from one single piece of rock.",
            "Its nose is missing. Nobody knows for sure where it went!",
          ],
          stop: {
            kind: "sight",
            name: "Great Sphinx",
            jp: "أبو الهول",
            text: "The great stone lion with a pharaoh's face, lying in front of the Valley Temple of Khafre and looking east towards the rising sun.",
            walkLabel: "Valley Temple → the Sphinx terrace",
            mins: 5,
            o: "29.97527,31.13757",
            d: "29.97441,31.13855",
            tip: "In Arabic the Sphinx is called {Abu al-Hol}, the 'Father of Terror'. But I think it looks friendly!",
          },
        },
        {
          id: "khan",
          rides: [
            {
              line: "scooter",
              name: "Scooter through old Cairo",
              from: ["S", "Al-Azhar"],
              to: ["S", "Al-Hussein"],
              mins: "6 min",
              video: { id: "Oq-wIne9reE" },
            },
          ],
          hana: [
            "Hold on tight, we're riding a scooter through {Islamic Cairo}, past mosques with tall minarets!",
            "Al-Azhar Mosque, from the year 970, is also one of the oldest universities in the world.",
            "We stop at the {Khan el-Khalili}, a maze of little lanes full of lanterns, spices, copper pots and perfume bottles.",
          ],
          stop: {
            kind: "sight",
            name: "Khan el-Khalili",
            jp: "خان الخليلي",
            text: "Cairo's great bazaar since the 14th century, around Al-Hussein Mosque, with lantern shops, spice stalls and the old El Fishawy café.",
            walkLabel: "Al-Hussein Square → into the bazaar → El Fishawy",
            mins: 5,
            o: "30.04787,31.26317",
            d: "30.04729,31.26229",
            tip: "At El Fishawy café, open for more than 200 years, the walls are covered in giant mirrors. Order a mint tea!",
          },
        },
        {
          id: "mahfouz",
          hana: [
            "Our farewell dinner is right in the bazaar, at the {Naguib Mahfouz Café}.",
            "Naguib Mahfouz wrote stories about these very lanes. In 1988 he won the Nobel Prize for Literature!",
            "We eat {koshari}: rice, lentils, pasta and crispy onions with tomato sauce. Every Egyptian loves it. {Ma'a salama}, my friend!",
          ],
          stop: {
            kind: "dinner",
            name: "Naguib Mahfouz Café",
            jp: "مقهى نجيب محفوظ",
            cuisine: "Egyptian · Khan el-Khalili",
            text: "A restaurant and café in an old building of carved wood and coloured lamps, deep in the bazaar, named after Egypt's Nobel Prize writer.",
            walkLabel: "El Fishawy → Badestan Lane",
            mins: 3,
            o: "30.04757,31.26201",
            d: "30.04800,31.26170",
          },
        },
      ],
      wrapUp: [
        "Pyramids Street, the last wonder of the ancient world, the Sphinx, and a scooter ride through old Cairo.",
        "And koshari in the bazaar. {Habibi}, you're a real Cairene now!",
      ],
    },
  ],
  wrapUp: [
    "Two days, four rides, eight stops. You saw 4,500 years of Cairo, from the pyramids to the metro!",
    "Street View pictures are taken on different days, so the light can change between two steps. But in Cairo, the sun almost always shines!",
    "{Shukran} for travelling with me. {Ma'a salama!} Goodbye!",
  ],
};
