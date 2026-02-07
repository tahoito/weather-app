import axios, { AxiosError } from "axios";

const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();

if (!apiBase) {
  console.warn("NEXT_PUBLIC_API_BASE_URL is not set");
}

export const apiClient = axios.create({
  baseURL: apiBase, // https://backend-autumn-pond-8461.fly.dev/api
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 30000,
  withCredentials: true, // ✅ cookie送る
});

// ✅ Bearerは使わない（Laravelがcookie.bearerで処理してるなら不要）
apiClient.interceptors.request.use((config) => config);

apiClient.interceptors.response.use(
  (res) => res,
  (error: AxiosError) => {
    const status = error.response?.status;

    if (status === 401 && typeof window !== "undefined") {
      const reqUrl = error.config?.url ?? "";
      const path = window.location.pathname;

      if (path.startsWith("/auth/")) return Promise.reject(error);

      const needsAuth =
        reqUrl.startsWith("/me") ||
        reqUrl.startsWith("/favorites") ||
        reqUrl.startsWith("/areas") ||
        reqUrl.startsWith("/spots") ||
        reqUrl.startsWith("/weather/current");

      if (needsAuth) window.location.href = "/auth/login";
    }

    return Promise.reject(error);
  }
);
