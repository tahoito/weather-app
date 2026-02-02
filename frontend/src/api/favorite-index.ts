import { apiClient } from "./apiClient";

export async function fetchFavorites() {
  const res = await apiClient.get("/favorites");

  const json = res.data;
  const arr = Array.isArray(json) ? json : (json?.data ?? []);

  return arr
    .map((x: any) => x?.spot ?? x)
    .filter((s: any) => s && typeof s.id === "number");
}
