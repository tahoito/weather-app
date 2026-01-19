import axios from "axios";

export type Area = {
  id: number;
  name: string;
  slug: string;
  lat: number;
  lon: number;
};

export async function fetchAreas(): Promise<Area[]> {
  const res = await axios.get("/api/areas");
  return res.data;
}
