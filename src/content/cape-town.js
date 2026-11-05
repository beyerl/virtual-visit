// Cape Town with Thandi: two days, from the harbour up Table Mountain and
// through the colourful Bo-Kaap, then by train along False Bay to the beach
// huts of Muizenberg, the penguins of Boulders Beach and fish and chips in
// Kalk Bay. Coordinates are WGS84 (OpenStreetMap); every walk starts within
// 30 m of a Street View panorama.
//
// In Thandi's lines, {braces} mark isiXhosa and Afrikaans words, shown in red.

export const CAPE_TOWN = {
  id: "capetown",
  title: "Cape Town",
  jp: "iKapa",
  tagline: "2 days · 5 rides · 7 stops",
  guide: { id: "thandi", name: "Thandi Nkosi", short: "Thandi" },
  available: true,
  lines: {
    myciti: { name: "MyCiTi bus", color: "#E4002B" },
    cableway: { name: "Table Mountain Cableway", color: "#3D8A8C" },
    southern: { name: "Metrorail Southern Line", color: "#2F6DB5" },
  },
  days: [
    {
      id: "day1",
      num: "Day 1",
      title: "Harbour, mountain and Bo-Kaap",
      intro: [
        "{Molo!} I'm Thandi, and Cape Town is my home. {Wamkelekile!} Welcome!",
        "South Africa has twelve official languages. Here in Cape Town you'll hear isiXhosa, Afrikaans and English everywhere.",
        "Today: the harbour, a cable car with a spinning floor up Table Mountain, and the most colourful street in Africa.",
      ],
      legs: [
        {
          id: "waterfront",
          rides: [
            {
              line: "myciti",
              name: "MyCiTi bus T01",
              from: ["T01", "Killarney"],
              to: ["T01", "V&A Waterfront"],
              mins: "18 min",
              video: { id: "N3fLS-H_7ag", start: 945, end: 2600 },
            },
          ],
          hana: [
            "The {MyCiTi} buses have their own lanes. They were built for the football World Cup in 2010.",
            "Look up: that flat mountain behind the city is {Table Mountain}. When a cloud lies on top, we say the table is laid with its tablecloth!",
            "We get off at the {V&A Waterfront}, the old harbour. It's named after Queen Victoria and her son Alfred, who started building it in 1860.",
            "Look around with your pad, and when you've seen enough, press {L + R} together.",
          ],
          stop: {
            kind: "sight",
            name: "V&A Waterfront",
            jp: "Clock Tower",
            text: "Cape Town's working harbour with shops, boats and seals, and the red Victorian Clock Tower from 1882 at the entrance to the old dock.",
            walkLabel: "Bus stop → swing bridge → Clock Tower",
            mins: 6,
            o: "-33.90649,18.42008",
            d: "-33.90648,18.42216",
            tip: "Look down into the water by the quay. Cape fur seals like to sleep on the floating platforms!",
          },
        },
        {
          id: "table",
          rides: [
            {
              line: "cableway",
              name: "Table Mountain Cableway",
              from: ["C", "Lower Station"],
              to: ["C", "Upper Station"],
              mins: "5 min",
              video: { id: "pEcZuK6g6b4" },
            },
          ],
          hana: [
            "Up the mountain! The cable car has been running since 1929.",
            "The floor inside turns all the way round on the way up, so everyone gets the view. Hold on!",
            "{Table Mountain} is 1,085 metres high and flat on top, like a giant's table. In 2011 it was chosen as one of the New Seven Wonders of Nature.",
          ],
          stop: {
            kind: "sight",
            name: "Table Mountain",
            jp: "Tafelberg",
            text: "The flat summit high above the city, with paths along the cliff edge, rare fynbos flowers and views of the bay, Robben Island and Lion's Head.",
            walkLabel: "Upper station → along the cliff edge",
            mins: 10,
            o: "-33.95722,18.40278",
            d: "-33.95755,18.40329",
            tip: "Look for the {dassies}: fat little furry animals sunning on the rocks. Believe it or not, their closest relatives are elephants!",
          },
        },
        {
          id: "bokaap",
          hana: [
            "Back down, we walk into the {Bo-Kaap}, the neighbourhood 'above the Cape'.",
            "Its houses are painted pink, lime, turquoise and yellow. Many families here came from Southeast Asia long ago, and kept their food and their faith.",
            "On Dorp Street is the Auwal Mosque from 1794, the oldest mosque in South Africa.",
          ],
          stop: {
            kind: "sight",
            name: "Bo-Kaap",
            jp: "Bo-Kaap",
            text: "Steep cobbled streets of brightly painted houses on the slopes of Signal Hill, the heart of Cape Town's Cape Malay community.",
            walkLabel: "Wale Street → Chiappini Street → Dorp Street",
            mins: 8,
            o: "-33.92160,18.41547",
            d: "-33.92090,18.41690",
          },
        },
        {
          id: "kombuis",
          hana: [
            "Dinner is up the hill at {Bo-Kaap Kombuis}. {Kombuis} is Afrikaans for kitchen!",
            "We eat Cape Malay food: {bobotie}, spiced minced meat baked with an egg topping, with yellow rice and raisins.",
            "And from the terrace you look right at Table Mountain. {Lekker!} That means nice!",
          ],
          stop: {
            kind: "dinner",
            name: "Bo-Kaap Kombuis",
            jp: "Bo-Kaap Kombuis",
            cuisine: "Cape Malay · Bo-Kaap",
            text: "A family restaurant high in the Bo-Kaap with a terrace facing Table Mountain, cooking Cape Malay curries, bredies and bobotie.",
            walkLabel: "Wale Street → up August Street",
            mins: 6,
            o: "-33.92066,18.41458",
            d: "-33.91751,18.41291",
            tip: "For dessert, try a {koesister}: a spicy doughnut rolled in coconut.",
          },
        },
      ],
      wrapUp: [
        "Seals in the harbour, a spinning cable car, dassies on the mountain, and the colourful Bo-Kaap.",
        "And bobotie with a view of the tablecloth. {Enkosi} for a lovely day! That means thank you.",
        "Tomorrow we take the train along the sea, to see penguins! {Ulale kakuhle!} Sleep well!",
      ],
    },
    {
      id: "day2",
      num: "Day 2",
      title: "The train along False Bay",
      intro: [
        "{Molweni!} Good morning, everyone! Today we take one of the most beautiful train rides in the world.",
        "The Southern Line runs from the city to the sea, and then right along the water of {False Bay}.",
        "Beach huts, penguins, and fish and chips by the harbour. Bring your swimsuit!",
      ],
      legs: [
        {
          id: "muizenberg",
          rides: [
            {
              line: "southern",
              name: "Southern Line",
              from: ["S", "Cape Town"],
              to: ["S", "Muizenberg"],
              mins: "50 min",
              video: { id: "4IVpGk9H1TQ", start: 2140, end: 2470 },
            },
          ],
          hana: [
            "The train runs through the suburbs below the back of Table Mountain, and then, suddenly: the sea!",
            "False Bay got its name because old sailors mixed it up with Table Bay and sailed in by mistake.",
            "At {Muizenberg} the water is warmer than on the other side of the Cape. It's the best beach to learn surfing!",
          ],
          stop: {
            kind: "sight",
            name: "Muizenberg",
            jp: "Muizenberg",
            text: "A long surfing beach with a row of colourful Victorian beach huts, next to the old station building on the shore of False Bay.",
            walkLabel: "Muizenberg Station → Surfer's Corner → the beach huts",
            mins: 6,
            o: "-34.10965,18.46763",
            d: "-34.10760,18.47110",
            tip: "Count the beach huts: yellow, red, blue, green… Which colour is your favourite?",
          },
        },
        {
          id: "boulders",
          rides: [
            {
              line: "southern",
              name: "Southern Line",
              from: ["S", "Muizenberg"],
              to: ["S", "Simon's Town"],
              mins: "35 min",
              video: { id: "4IVpGk9H1TQ", start: 3365, end: 3849 },
            },
          ],
          hana: [
            "Now the train runs so close to the water that the waves sometimes splash the tracks!",
            "At the end of the line is {Simon's Town}, the home of South Africa's navy.",
            "And just past it, on {Boulders Beach}, live African penguins! In 1982 only two pairs came here. Now there are thousands.",
            "They bray like donkeys. That's why people used to call them jackass penguins!",
          ],
          stop: {
            kind: "sight",
            name: "Boulders Beach",
            jp: "Boulders Beach",
            text: "A sheltered beach between giant granite boulders, home to a colony of African penguins, seen from wooden boardwalks.",
            walkLabel: "Kleintuin Road → the boardwalk → penguin beach",
            mins: 6,
            o: "-34.19621,18.45042",
            d: "-34.19808,18.45234",
            tip: "Penguins can't fly, but underwater they 'fly' with their wings, faster than you can swim!",
          },
        },
        {
          id: "kalky",
          rides: [
            {
              line: "southern",
              name: "Southern Line",
              from: ["S", "Simon's Town"],
              to: ["S", "Kalk Bay"],
              mins: "20 min",
              video: { id: "QNXm01ymIM4", start: 0, end: 863 },
            },
          ],
          hana: [
            "Back along the coast to {Kalk Bay}, a little fishing harbour with colourful boats.",
            "Our farewell dinner is at {Kalky's}: fish and chips, fresh from the boats, eaten at long wooden tables.",
            "Watch the harbour wall: seals swim around the fishing boats, waiting for leftovers!",
          ],
          stop: {
            kind: "dinner",
            name: "Kalky's",
            jp: "Kalky's",
            cuisine: "Fish & chips · Kalk Bay harbour",
            text: "A busy fish-and-chips place right on Kalk Bay harbour, serving hake, calamari and snoek fresh from the fishing boats.",
            walkLabel: "Kalk Bay Station → the harbour",
            mins: 5,
            o: "-34.12607,18.44984",
            d: "-34.12905,18.44882",
          },
        },
      ],
      wrapUp: [
        "A train along the sea, colourful beach huts, penguins that bray like donkeys, and seals in the harbour.",
        "And fish and chips by the water. {Lekker!}",
      ],
    },
  ],
  wrapUp: [
    "Two days, five rides, seven stops. You saw Cape Town from the mountain top to the penguin beach!",
    "Street View pictures are taken on different days, so the weather can change between two steps. Sometimes the tablecloth is on, sometimes it's off!",
    "{Enkosi} for travelling with me. {Hamba kakuhle!} Go well!",
  ],
};
