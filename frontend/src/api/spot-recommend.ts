import axios from "axios";
import type { Spot } from "@/types/spot";

export type SpotQuery = {
  area: string;
  pop: number;
  wind: number;
  temp: number;
  humidity: number;
  limit: number;
};

export async function fetchSpotsRecommended(
  query: SpotQuery
): Promise<Spot[]> {
  const res = await axios.get("http://localhost:8000/api/spots/recommended", {
    params: query,
  });

  const data = (res.data?.data ?? []) as Spot[];

  return data.map((s) => ({
      ...s,
      tag: Array.isArray(s.tag) ? s.tag : s.tag ? [s.tag] : [],
  }))
}
