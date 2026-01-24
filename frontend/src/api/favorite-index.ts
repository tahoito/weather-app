import axios from "axios";
import { Spot } from "./spot-recommend";

export type Favorite = {
  id: number;
  spot: Spot;
};

export async function fetchFavorites(): Promise<Favorite[]> {
  const res = await axios.get("http://localhost:8000/api/favorites");
  return res.data;
}
