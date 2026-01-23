import axios from "axios";

export type Spot = {
  id: number;
  name: string;
  area: string;
  description: string;
  image_url: string;
  tag: string | null;
  is_indoor?: boolean;
  weather_ok?: boolean;
};

export type SpotQuery = {
  area: string;
  pop: number;
  wind: number;
  temp: number;
  humidity: number;
  limit: number;
};

export async function fetchSpotsRecommended(query: SpotQuery): Promise<Spot[]> {
  const res = await axios.get("/api/spots/recommended", {
    params: query,
  });

  return res.data?.data ?? [];
}
