import axios from "axios";
import Cookies from "js-cookie";

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
  const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/spots/recommended`;
  const token = Cookies.get("authToken");

  const res = await axios.get(apiUrl, {
    params: query,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data.data ?? [];
}
