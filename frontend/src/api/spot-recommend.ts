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

type ApiSpot = Omit<Spot, "tag"> & {
  tags?: string | string[] | null;
};

export async function fetchSpotsRecommended(
  query: SpotQuery
): Promise<Spot[]> {
  const res = await axios.get("http://localhost:8000/api/spots/recommended", {
    params: query,
  });

  const data: ApiSpot[] = res.data?.data ?? [];

  return data.map((s) => ({
      ...s,
      tag: Array.isArray(s.tags) ? s.tags : s.tags ? [s.tags] : [],
  }))
}
