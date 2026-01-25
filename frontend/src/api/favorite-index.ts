import axios from "axios";
import { Spot } from "@/types/spot";

export type Favorite = {
  id: number;
  spot: Spot;
};

type FavoriteItem = { spot: any } | any;


export async function fetchFavorites(): Promise<FavoriteItem[]> {
  const res = await fetch("/api/favorites", { cache: "no-store" });
  if (!res.ok) throw new Error("fetchFavorites failed");

  const json = await res.json();

  
  if (Array.isArray(json)) return json;
  if (json && Array.isArray(json.data)) return json.data;

  return [];
}
