import { apiClient } from "./apiClient";

export type Area = {
  id: number;
  name: string;
  slug: string;
  lat: number;
  lon: number;
};


export async function fetchAreas(): Promise<Area[]> {
  const res = await apiClient.get("/api/areas");
  return Array.isArray(res.data) ? res.data : (res.data?.data ?? []);
}
