import axios, { AxiosHeaders, AxiosError } from "axios";

// NEXT_PUBLIC_API_BASE_URL = "https://backend-autumn-pond-8461.fly.dev/api"
const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!apiBase) {
  console.warn("NEXT_PUBLIC_API_BASE_URL is not set");
}

export const apiClient = axios.create({
  baseURL: apiBase,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 30000,
  withCredentials: true,
});


apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");

    if (token) {
      const headers = AxiosHeaders.from(config.headers);
      headers.set("Authorization", `Bearer ${token}`);
      config.headers = headers;
    }
  }
  return config;
});

// レスポンス後：401ならログインへ
apiClient.interceptors.response.use(
  (res) => res,
  (error: AxiosError) => {
    const status = error.response?.status;

    if (status === 401 && typeof window !== "undefined") {
      window.location.href = "/auth/login";
    }

    return Promise.reject(error);
  }
);
