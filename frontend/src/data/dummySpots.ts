import type { Spot } from "@/types/spot";

export const dummySpots: Spot[] = [
  {
    id: 1,
    name: "名古屋城",
    area: "名駅",
    description: "名古屋を代表する歴史的な城。金のしゃちほこが有名。",
    detail:
      "1612年に徳川家康によって築城された名古屋城は、江戸時代の政治・文化の中心として栄えました。天守閣や本丸御殿は復元されており、当時の暮らしや建築技術を間近で感じることができます。季節ごとに表情を変える城内の景観も魅力です。",
    thumbnailUrl: "https://placehold.jp/600x400.png?text=Nagoya+Castle+Thumb",
    imageUrls: [
      "https://placehold.jp/600x400.png?text=Nagoya+Castle+1",
      "https://placehold.jp/600x400.png?text=Nagoya+Castle+2",
      "https://placehold.jp/600x400.png?text=Nagoya+Castle+3",
    ],
    tag: ["友達"],
    weatherSuitability: [
      "雨の日でも屋内展示があるので楽しめる",
      "晴れの日は城と空のコントラストが美しい",
    ],

    highlights: ["金のしゃちほこは必見", "本丸御殿の障壁画が見どころ"],
    price: "大人：500円 / 中学生以下：無料",
    openingHours: "9:00〜16:30（最終入場 16:00）",
  },
  {
    id: 2,
    name: "JRセントラルタワー",
    area: "大須",
    description: "食べ歩きやショッピングが楽しめる活気ある商店街。",
    detail:
      "名古屋駅直結のJRセントラルタワーは、ショッピング、グルメ、ホテル、オフィスが集まる複合施設です。高層階からは名古屋市内を一望でき、夜景スポットとしても人気があります。雨の日でも快適に過ごせるのが魅力です。",
    thumbnailUrl: "https://placehold.jp/600x400.png?text=Central+Tower+Thumb",
    imageUrls: [
      "https://placehold.jp/600x400.png?text=Nagoya+Castle+1",
      "https://placehold.jp/600x400.png?text=Nagoya+Castle+2",
      "https://placehold.jp/600x400.png?text=Nagoya+Castle+3",
      "https://placehold.jp/600x400.png?text=Nagoya+Castle+4",
    ],
    tag: ["アクティブ"],
    weatherSuitability: [
      "雨の日でも屋内展示があるので楽しめる",
      "晴れの日は城と空のコントラストが美しい",
    ],

    highlights: ["金のしゃちほこは必見", "本丸御殿の障壁画が見どころ"],
    price: "無料",
    openingHours: "終日開放",
  },
  {
    id: 3,
    name: "オアシス21",
    area: "栄",
    description: "ガラスの大屋根が特徴的な栄のランドマーク。",
    detail:
      "オアシス21は「水の宇宙船」と呼ばれるガラスの大屋根が象徴的な複合施設です。屋上からは栄の街並みを見渡すことができ、夜にはライトアップされた幻想的な景色を楽しめます。地下にはショップや飲食店もあり、休憩スポットとしても便利です。",
    thumbnailUrl: "https://placehold.jp/600x400.png?text=Central+Tower+Thumb",
    imageUrls: ["https://placehold.jp/300x200.png"],
    tag: ["友達"],
    weatherSuitability: [
      "雨の日でも屋内展示があるので楽しめる",
      "晴れの日は城と空のコントラストが美しい",
    ],

    highlights: ["金のしゃちほこは必見", "本丸御殿の障壁画が見どころ"],
    price: "店舗により異なる",
    openingHours: "10:00〜21:00",
  },
  {
    id: 4,
    name: "熱田神宮",
    area: "熱田",
    description: "三種の神器の一つを祀る由緒ある神社。",
    detail:
      "熱田神宮は日本有数の古社で、三種の神器の一つである草薙神剣を祀っていることで知られています。広大な境内は自然に囲まれており、都会にいながら静かで厳かな時間を過ごすことができます。参拝だけでなく、散策にもおすすめの場所です。",
    thumbnailUrl: "https://placehold.jp/600x400.png?text=Central+Tower+Thumb",
    imageUrls: ["https://placehold.jp/300x200.png"],
    tag: ["一人"],
    weatherSuitability: [
      "雨の日でも屋内展示があるので楽しめる",
      "晴れの日は城と空のコントラストが美しい",
    ],

    highlights: ["金のしゃちほこは必見", "本丸御殿の障壁画が見どころ"],
    price: "無料",
    openingHours: "終日開放",
  },
];
