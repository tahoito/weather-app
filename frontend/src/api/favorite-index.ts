import axios from "axios";
import { Spot } from "@/types/spot";

export type Favorite = {
  id: number;
  spot: Spot;
};

type FavoriteItem = { spot: any } | any;


export async function fetchFavorites(): Promise<Spot[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/favorites`,
    { cache: "no-store" }
  );

  if (!res.ok) throw new Error("fetchFavorites failed");

  const json = await res.json();
  const arr = Array.isArray(json) ? json : (json?.data ?? []);

  return arr
    .map((x: any) => x?.spot ?? x)
    .filter((s: any) => s && typeof s.id === "number");
}