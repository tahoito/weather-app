import type { Spot } from "@/types/spot";

export const dummySpots: Spot[] = [
  {
    id: 1,
    name: "名古屋城",
    area: "名駅",
    description: "名古屋を代表する歴史的な城。金のしゃちほこが有名。",
    imageUrl: "https://placehold.jp/300x200.png",
    tags: ["友達", "ゆったり"],
  },
  {
    id: 2,
    name: "大須商店街",
    area: "大須",
    description: "食べ歩きやショッピングが楽しめる活気ある商店街。",
    imageUrl: "https://placehold.jp/300x200.png",
    tags: ["アクティブ", "屋外"],
  },
  {
    id: 3,
    name: "オアシス21",
    area: "栄",
    description: "ガラスの大屋根が特徴的な栄のランドマーク。",
    imageUrl: "https://placehold.jp/300x200.png",
    tags: ["友達", "ゆったり", "屋外"],
  },
  {
    id: 4,
    name: "熱田神宮",
    area: "熱田",
    description: "三種の神器の一つを祀る由緒ある神社。",
    imageUrl: "https://placehold.jp/300x200.png",
    tags: ["一人", "アクティブ", "屋外"],
  },
];
