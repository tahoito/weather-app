import axios, { AxiosHeaders, AxiosError } from "axios";

const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
// 例: https://backend-autumn-pond-8461.fly.dev/api

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
  // cookie運用やめるなら基本不要。残してもOKだけど意味薄い
  withCredentials: false,
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

apiClient.interceptors.response.use(
  (res) => res,
  (error: AxiosError) => {
    const status = error.response?.status;

    if (status === 401 && typeof window !== "undefined") {
      const reqUrl = error.config?.url ?? "";
      const path = window.location.pathname;

      // authページでは飛ばない
      if (path.startsWith("/auth/")) return Promise.reject(error);

      // Laravelの実ルートに合わせる（/me など）
      const needsAuth =
        reqUrl.startsWith("/me") ||
        reqUrl.startsWith("/areas") ||
        reqUrl.startsWith("/favorites") ||
        reqUrl.startsWith("/spots") ||
        reqUrl.startsWith("/weather/current") ||
        reqUrl.startsWith("/logout");

      if (needsAuth) {
        // tokenが壊れてる/期限切れ → 一旦消す
        localStorage.removeItem("token");
        window.location.href = "/auth/login";
      }
    }

    return Promise.reject(error);
  }
);
