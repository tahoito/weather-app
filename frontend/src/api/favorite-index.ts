import axios from "axios";
import Cookies from "js-cookie";
import { Spot } from "./spot-recommend";

export type Favorite = {
  id: number;
  spot: Spot;
};

export async function fetchFavorites(): Promise<Favorite[]> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/favorites`;
  const token = Cookies.get("authToken");

  if (!token) {
    console.warn("authToken が存在しません");
    return [];
  }

  try {
    const res = await axios.get(apiUrl, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    console.error("fetchFavorites error:", err);
    return [];
  }
}
