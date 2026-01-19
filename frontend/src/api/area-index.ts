import axios from "axios";
import Cookies from "js-cookie";

export type Area = {
  id: number;
  name: string;
  slug: string;
  lat: number;
  lon: number;
};

export async function fetchAreas(): Promise<Area[]> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/areas`;
  const token = Cookies.get("authToken");

  const res = await axios.get(apiUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
}
