// Simplified Tokyo rail network for the ride maps (approximate real positions),
// from reference/tokyo-with-hana.html.

export const STATIONS = {
  tokyo: [35.6812, 139.7671, "Tokyo"], yurakucho: [35.675, 139.763, "Yūrakuchō"], shimbashi: [35.666, 139.7585, "Shimbashi"],
  hamamatsucho: [35.6555, 139.757, "Hamamatsuchō"], tamachi: [35.6457, 139.7476, "Tamachi"], takanawa: [35.6355, 139.7407, "Takanawa Gateway"],
  shinagawa: [35.6285, 139.7388, "Shinagawa"], osaki: [35.6197, 139.7286, "Ōsaki"], gotanda: [35.6262, 139.7236, "Gotanda"],
  meguro: [35.6339, 139.7157, "Meguro"], ebisu: [35.6467, 139.7101, "Ebisu"], shibuya: [35.658, 139.7016, "Shibuya"],
  harajuku: [35.6702, 139.7027, "Harajuku"], yoyogi: [35.6831, 139.702, "Yoyogi"], shinjuku: [35.6896, 139.7006, "Shinjuku"],
  shinokubo: [35.7012, 139.7, "Shin-Ōkubo"], takadanobaba: [35.7128, 139.7038, "Takadanobaba"], mejiro: [35.7212, 139.7066, "Mejiro"],
  ikebukuro: [35.7295, 139.7109, "Ikebukuro"], otsuka: [35.7318, 139.7286, "Ōtsuka"], sugamo: [35.7334, 139.7393, "Sugamo"],
  komagome: [35.7365, 139.747, "Komagome"], tabata: [35.7381, 139.7608, "Tabata"], nishinippori: [35.732, 139.7668, "Nishi-Nippori"],
  nippori: [35.7278, 139.771, "Nippori"], uguisudani: [35.7213, 139.7781, "Uguisudani"], ueno: [35.7138, 139.7773, "Ueno"],
  okachimachi: [35.7075, 139.7748, "Okachimachi"], akihabara: [35.6984, 139.7731, "Akihabara"], kanda: [35.6918, 139.7709, "Kanda"],
  shinjukusanchome: [35.6908, 139.7048, "Shinjuku-sanchōme"], gyoemmae: [35.6884, 139.7108, "Shinjuku-gyoemmae"],
  yotsuyasanchome: [35.688, 139.72, "Yotsuya-sanchōme"], yotsuya: [35.686, 139.73, "Yotsuya"], akasakamitsuke: [35.677, 139.737, "Akasaka-mitsuke"],
  kokkai: [35.674, 139.7451, "Kokkai-gijidōmae"], kasumigaseki: [35.674, 139.7505, "Kasumigaseki"], ginza: [35.6717, 139.764, "Ginza"],
  otemachi: [35.6862, 139.7637, "Ōtemachi"], awajicho: [35.6956, 139.7672, "Awajichō"], ochanomizu: [35.6996, 139.7653, "Ochanomizu"],
  hongosanchome: [35.7069, 139.7604, "Hongō-sanchōme"],
  omotesando: [35.6652, 139.7123, "Omote-sandō"], gaiemmae: [35.6706, 139.7178, "Gaiemmae"], aoyama1: [35.6728, 139.724, "Aoyama-itchōme"],
  tameike: [35.6736, 139.7414, "Tameike-sannō"], toranomon: [35.6703, 139.7499, "Toranomon"], kyobashi: [35.6767, 139.7701, "Kyōbashi"],
  nihombashi: [35.682, 139.7745, "Nihombashi"], mitsukoshimae: [35.6862, 139.7731, "Mitsukoshimae"], suehirocho: [35.7026, 139.7716, "Suehirochō"],
  uenohirokoji: [35.7077, 139.7727, "Ueno-hirokōji"], inaricho: [35.7114, 139.7826, "Inarichō"], tawaramachi: [35.711, 139.7907, "Tawaramachi"],
  asakusa: [35.711, 139.7976, "Asakusa"],
  mita: [35.648, 139.748, "Mita"], daimon: [35.6567, 139.7552, "Daimon"], higashiginza: [35.6694, 139.7671, "Higashi-ginza"],
  takaracho: [35.675, 139.7717, "Takarachō"], ningyocho: [35.6863, 139.7822, "Ningyōchō"], higashinihombashi: [35.6923, 139.7849, "Higashi-nihombashi"],
  asakusabashi: [35.6973, 139.7863, "Asakusabashi"], kuramae: [35.7038, 139.7905, "Kuramae"], honjo: [35.7086, 139.8042, "Honjo-azumabashi"],
  oshiage: [35.7105, 139.813, "Oshiage"],
  kudanshita: [35.6955, 139.7515, "Kudanshita"], jimbocho: [35.696, 139.7577, "Jimbōchō"], suitengumae: [35.6829, 139.7856, "Suitengūmae"],
  kiyosumi: [35.682, 139.799, "Kiyosumi-shirakawa"], sumiyoshi: [35.689, 139.8156, "Sumiyoshi"], kinshicho: [35.697, 139.815, "Kinshichō"],
  shiodome: [35.6623, 139.7612, "Shiodome"], takeshiba: [35.6542, 139.7615, "Takeshiba"], hinode: [35.649, 139.762, "Hinode"],
  shibaurafuto: [35.641, 139.7555, "Shibaura-futō"], odaibakaihin: [35.6297, 139.7787, "Odaiba-kaihinkōen"], daiba: [35.6253, 139.7713, "Daiba"],
  cruiseterm: [35.619, 139.7735, "Cruise Terminal"],
};

/** Lines by station-code prefix: colour key (see TOKYO.lines), number of the
 * first station, whether it's a loop, a sideways offset in px for parallel
 * tracks, and its stations in order. */
export const LINES = {
  JY: { line: "jy", n0: 1, loop: true, off: 0, ids: "tokyo kanda akihabara okachimachi ueno uguisudani nippori nishinippori tabata komagome sugamo otsuka ikebukuro mejiro takadanobaba shinokubo shinjuku yoyogi harajuku shibuya ebisu meguro gotanda osaki shinagawa takanawa tamachi hamamatsucho shimbashi yurakucho" },
  JK: { line: "jk", n0: 20, off: 5, ids: "shinagawa takanawa tamachi hamamatsucho shimbashi yurakucho tokyo kanda akihabara okachimachi ueno" },
  JC: { line: "jc", n0: 1, off: -5, ids: "tokyo kanda ochanomizu yotsuya shinjuku" },
  M: { line: "m", n0: 8, off: 0, ids: "shinjuku shinjukusanchome gyoemmae yotsuyasanchome yotsuya akasakamitsuke kokkai kasumigaseki ginza tokyo otemachi awajicho ochanomizu hongosanchome" },
  G: { line: "g", n0: 1, off: 0, ids: "shibuya omotesando gaiemmae aoyama1 akasakamitsuke tameike toranomon shimbashi ginza kyobashi nihombashi mitsukoshimae kanda suehirocho uenohirokoji ueno inaricho tawaramachi asakusa" },
  A: { line: "a", n0: 8, off: 0, ids: "mita daimon shimbashi higashiginza takaracho nihombashi ningyocho higashinihombashi asakusabashi kuramae asakusa honjo oshiage" },
  Z: { line: "z", n0: 6, off: 0, ids: "kudanshita jimbocho otemachi mitsukoshimae suitengumae kiyosumi sumiyoshi kinshicho oshiage" },
  U: { line: "u", n0: 1, off: 0, ids: "shimbashi shiodome takeshiba hinode shibaurafuto odaibakaihin daiba cruiseterm" },
};
