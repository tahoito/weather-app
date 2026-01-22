import axios from "axios";

export type Area = {
  id: number;
  name: string;
  slug: string;
  lat: number;
  lon: number;
};

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

export async function fetchAreas(): Promise<Area[]> {
  const res = await api.get("/api/areas");
  return Array.isArray(res.data) ? res.data : (res.data?.data ?? []);
}
