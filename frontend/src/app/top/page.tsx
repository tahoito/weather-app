"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchAreas, Area } from "@/api/area-index";
import { fetchFavorites } from "@/api/favorite-index";
import { UmbrellaIcon } from "@/components/icon/umbrella-icon";
import { DropletIcon } from "@/components/icon/droplet-icon";
import { WindIcon } from "@/components/icon/wind-icon";
import { PencilLineIcon } from "@/components/icon/pencil-line-icon";
import { weatherCodeMap } from "@/types/spot";
import { NavigationBar } from "@/components/navigation-bar";
import { X } from "lucide-react";
import type { Spot } from "@/types/spot";
import { useRouter } from "next/navigation";
import { fetchSpotsRecommended } from "@/api/spot-recommend";
import { SpotCardTop } from "@/components/spot-card/SpotCardTop";
import { SpotCardContainer } from "@/components/spot-card/SpotCardContainer";
import { apiClient } from "@/api/apiClient";
import { createPortal } from "react-dom";

type WeatherInfo = {
  precipitation: number;
  humidity: number;
  windSpeed: number;
  temperature: number;
  weatherCode: number;
};

type TopCache = {
  savedAt: number;
  areas: Area[];
  currentAreaSlug: string | null;
  weather: WeatherInfo | null;
  spots: Spot[];
  favoriteIds: number[];
};

const TOP_CACHE_KEY = "top_cache_v1";
const TOP_CACHE_TTL_MS = 1000 * 60 * 10; // 10分

function loadTopCache(): TopCache | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(TOP_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as TopCache;
    if (!parsed?.savedAt) return null;
    if (Date.now() - parsed.savedAt > TOP_CACHE_TTL_MS) return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveTopCache(data: Omit<TopCache, "savedAt">) {
  if (typeof window === "undefined") return;
  const payload: TopCache = { savedAt: Date.now(), ...data };
  sessionStorage.setItem(TOP_CACHE_KEY, JSON.stringify(payload));
}


const AUTH_CACHE_KEY = "auth_ok_v1";
const AUTH_CACHE_TTL_MS = 1000 * 60 * 10; // 10分

function loadAuthOk(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = sessionStorage.getItem(AUTH_CACHE_KEY);
    if (!raw) return false;
    const { ok, savedAt } = JSON.parse(raw);
    if (!ok || !savedAt) return false;
    if (Date.now() - savedAt > AUTH_CACHE_TTL_MS) return false;
    return true;
  } catch {
    return false;
  }
}

function saveAuthOk() {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(AUTH_CACHE_KEY, JSON.stringify({ ok: true, savedAt: Date.now() }));
}

function clearAuthOk() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(AUTH_CACHE_KEY);
}


export default function Page() {
  const router = useRouter();

  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const [spots, setSpots] = useState<Spot[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [currentArea, setCurrentArea] = useState<Area | null>(null);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);

  const [isAreaModalOpen, setIsAreaModalOpen] = useState(false);
  const [areaModalMode, setAreaModalMode] = useState<"initial" | "change">(
    "change"
  );

  const [authed, setAuthed] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [pendingInitialAreaModal, setPendingInitialAreaModal] = useState(false);


  const fmt = (v?: number, suffix = "") =>
    typeof v === "number" ? `${v}${suffix}` : "--";

  // ----------------------------
  // 1) ログインチェック（cookie反映ズレ対策で軽くリトライ）
  // ----------------------------
  useEffect(() => {
    let alive = true;

    // まずはキャッシュがあれば即表示（塞がない）
    const cachedOk = loadAuthOk();
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (cachedOk && token) {
      setAuthed(true);
      setAuthChecking(false);
    }

    if (!token) {
      clearAuthOk();
      router.replace("/auth/login");
      setAuthChecking(false);
      return;
    }


    async function verify() {
      try {
        await apiClient.get("/me");
        if (!alive) return;
        setAuthed(true);
        saveAuthOk();
      } catch {
        if (!alive) return;
        clearAuthOk();
        router.replace("/auth/login");
      } finally {
        if (!alive) return;
        // キャッシュで既に false にしてても、最後に念押し
        setAuthChecking(false);
      }
    }

    verify();
    return () => {
      alive = false;
    };
  }, [router]);


  // ----------------------------
  // 2) 初回：キャッシュ復元（※API叩かないので authed 前でもOK）
  // ----------------------------
  useEffect(() => {
    const cache = loadTopCache();
    if (!cache) return;

    setAreas(cache.areas ?? []);
    const saved = cache.currentAreaSlug
      ? cache.areas.find((a) => a.slug === cache.currentAreaSlug) ?? null
      : null;

    setCurrentArea(saved ?? cache.areas[0] ?? null);
    setWeather(cache.weather ?? null);
    setSpots(cache.spots ?? []);
    setFavoriteIds(cache.favoriteIds ?? []);
  }, []);


  useEffect(() => {
    if (typeof window === "undefined") return;

    const shouldShow = localStorage.getItem("showAreaModal") === "true";
    const selected = localStorage.getItem("selectedAreaSlug");

    if (shouldShow || !selected) {
      setPendingInitialAreaModal(true);
    }
  }, []);



  // ----------------------------
  // 3) 初回：エリアモーダル表示フラグ（ログイン後のみ）
  // ----------------------------
  useEffect(() => {
    if (!authed) return;
    if (!pendingInitialAreaModal) return;

    // areasがまだなら待つ（ボタン空を防ぐ）
    if (areas.length === 0) return;

    setAreaModalMode("initial");
    setIsAreaModalOpen(true);

    localStorage.removeItem("showAreaModal"); // ここで初めて消す
    setPendingInitialAreaModal(false);
  }, [authed, pendingInitialAreaModal, areas.length]);


  // ----------------------------
  // 4) areas取得（ログイン後のみ）
  // ----------------------------
  useEffect(() => {
    if (!authed) return;

    let mounted = true;

    async function loadAreas() {
      try {
        const data = await fetchAreas();
        if (!mounted) return;

        setAreas(data);

        const DEFAULT_AREA_SLUG = "meieki"; 

        const savedSlug =
          localStorage.getItem("selectedAreaSlug") ?? DEFAULT_AREA_SLUG;

        const saved =
          data.find((a) => a.slug === savedSlug) ??
          data.find((a) => a.slug === DEFAULT_AREA_SLUG) ??
          null;

        setCurrentArea(saved);

      } catch (e) {
        console.error("loadAreas error", e);
      }
    }

    loadAreas();
    return () => {
      mounted = false;
    };
  }, [authed]);

  // ----------------------------
  // 5) favorites取得（ログイン後のみ）
  // ----------------------------
  useEffect(() => {
    if (!authed) return;

    let mounted = true;

    async function loadFavorites() {
      try {
        const favorites = await fetchFavorites();
        if (!mounted) return;

        const ids = Array.isArray(favorites)
          ? favorites
              .map((s: any) => Number(s.id))
              .filter((n) => !Number.isNaN(n))
          : [];

        setFavoriteIds(ids);
      } catch (e) {
        console.error("loadFavorites error:", e);
        setFavoriteIds([]);
      }
    }

    loadFavorites();
    return () => {
      mounted = false;
    };
  }, [authed]);

  // ----------------------------
  // 6) currentAreaが変わったら天気取得（ログイン後のみ）
  // ----------------------------
  useEffect(() => {
    if (!authed) return;
    if (!currentArea) return;

    const controller = new AbortController();

    async function loadWeather() {
      try {
        const res = await apiClient.get("/weather/current", {
          params: { lat: currentArea.lat, lon: currentArea.lon },
          signal: controller.signal,
        });

        const payload = res.data?.data ?? res.data;
        setWeather(payload);
      } catch (e: any) {
        if (e?.name !== "CanceledError") console.error("loadWeather error", e);
      }
    }

    loadWeather();
    return () => controller.abort();
  }, [authed, currentArea?.slug]); // slugで十分

  // ----------------------------
  // 7) 天気が取れたらおすすめスポット取得（ログイン後のみ）
  // ----------------------------
  useEffect(() => {
    if (!authed) return;
    if (!currentArea || areas.length === 0 || !weather) return;

    let mounted = true;

    async function loadSpots() {
      try {
        const spotsData: Spot[] = await fetchSpotsRecommended({
          area: currentArea.slug,
          pop: weather.precipitation,
          wind: weather.windSpeed,
          temp: weather.temperature,
          humidity: weather.humidity,
          limit: 10,
        });

        if (!mounted) return;

        const areaNameMap = new Map(areas.map((a) => [a.slug, a.name] as const));

        const normalized = spotsData.map((spot) => ({
          ...spot,
          areaName: areaNameMap.get(spot.area) || spot.area,
        }));

        setSpots(normalized);
      } catch (err) {
        console.error("loadSpots error:", err);
      }
    }

    loadSpots();
    return () => {
      mounted = false;
    };
  }, [
    authed,
    currentArea?.slug,
    areas,
    weather?.precipitation,
    weather?.humidity,
    weather?.windSpeed,
    weather?.temperature,
  ]);

  // ----------------------------
  // 8) キャッシュ保存
  // ----------------------------
  useEffect(() => {
    saveTopCache({
      areas,
      currentAreaSlug: currentArea?.slug ?? null,
      weather,
      spots,
      favoriteIds,
    });
  }, [areas, currentArea?.slug, weather, spots, favoriteIds]);

  const handleMapClick = () => {
    const slug = localStorage.getItem("selectedAreaSlug") ?? "meieki";
    router.push(`/map?area=${encodeURIComponent(slug)}`);
  };

  // 認証確認中のチラつき防止
  if (authChecking && !authed) {
    return (
      <div className="bg-back min-h-screen pb-20 [&>*]:text-fg">
        {/* 最低限の骨組みだけ出す */}
        <div className="pt-10 text-center">読み込み中...</div>
        <NavigationBar />
      </div>
    );
  }

  return (
    <div className="bg-back min-h-screen pb-20 [&>*]:text-fg ">
      <div className="flex items-center pt-5">
        <div className="flex-1 flex justify-center gap-8">
          <p>現在のエリア</p>
          <p className="font-semibold text-base">
            {currentArea?.name ?? "読み込み中"}
          </p>
        </div>

        <div className="mr-6">
          <button
            onClick={() => {
              setAreaModalMode("change");
              setIsAreaModalOpen(true);
            }}
            className="flex justify-center gap-2 w-20 py-0.5 rounded-full border border-sub text-sub"
          >
            <PencilLineIcon className="h-4 w-4" />
            変更
          </button>

          {typeof window !== "undefined" &&
            isAreaModalOpen &&
            createPortal(
              <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40">
                <div
                  className={`relative z-[100000] bg-white rounded-2xl p-6 w-[320px] border text-sm ${
                    areaModalMode === "change" ? "pt-12" : ""
                  }`}
                >
                  {areaModalMode === "initial" ? (
                    <p className="pb-6 text-base whitespace-nowrap text-center">
                      設定するエリアを選択してください。
                    </p>
                  ) : (
                    <button
                      onClick={() => setIsAreaModalOpen(false)}
                      className="absolute top-3 right-3"
                    >
                      <X />
                    </button>
                  )}

                  <ul className="grid grid-cols-3 gap-2 gap-x-[15px] gap-y-[16px]">
                    {areas.map((area) => (
                      <li key={area.id}>
                        <button
                          className="w-20 px-2 py-1 rounded-full border bg-card-back shadow-[1px_2px_1px_rgba(0,0,0,0.20)]"
                          onClick={() => {
                            setCurrentArea(area);
                            setWeather(null);
                            setSpots([]);
                            localStorage.setItem("selectedAreaSlug", area.slug);
                            setIsAreaModalOpen(false);
                          }}
                        >
                          {area.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>,
              document.body
            )}
        </div>
      </div>

      <div className="flex justify-center mt-4 m-6">
        <div className="bg-white w-84 min-h-48 rounded-xl flex justify-center shadow-[0_0_6px_0_rgba(0,0,0,0.3)]">
          <div className="m-4">
            <p className="text-center mb-2">今日の天気</p>

            <div className="grid grid-cols-2 gap-4 w-52">
              <div className="flex flex-col items-center">
                {weather ? (
                  (() => {
                    const code = Number(weather.weatherCode);
                    const weatherInfo = (weatherCodeMap as any)[code];

                    if (!weatherInfo) {
                      return (
                        <p className="mt-1 text-xs text-red-500">
                          unknown code: {String(weather.weatherCode)}
                        </p>
                      );
                    }

                    const IconComponent = weatherInfo.Icon;
                    return (
                      <>
                        <IconComponent className="h-16 w-16" />
                        <p className="mt-1">{weatherInfo.label}</p>
                      </>
                    );
                  })()
                ) : (
                  <p className="mt-1">読み込み中...</p>
                )}
              </div>

              <div className="flex flex-col items-center">
                <div className="flex items-end justify-center h-16">
                  <span className="text-6xl leading-none">
                    {weather?.temperature ?? "--"}
                  </span>
                  <span className="text-2xl">℃</span>
                </div>
                <p className="mt-1">現在</p>
              </div>
            </div>

            <div className="grid grid-cols-3 mx-auto mt-4 w-52">
              <div className="flex justify-center items-center gap-1">
                <UmbrellaIcon className="h-5 w-5" />
                <span className="text-xs">
                  {fmt(weather?.precipitation, "%")}
                </span>
              </div>
              <div className="flex justify-center items-center gap-1">
                <DropletIcon className="h-5 w-5" />
                <span className="text-xs">{fmt(weather?.humidity, "%")}</span>
              </div>
              <div className="flex justify-center items-center gap-1">
                <WindIcon className="h-5 w-5" />
                <span className="text-xs">{fmt(weather?.windSpeed, "m/s")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-[0_0_6px_0_rgba(0,0,0,0.3)]">
        <p className="text-center text-lg font-semibold mb-8">
          今日のおすすめスポット
        </p>

        <div className="flex justify-center ">
          <div className="grid grid-cols-2 gap-2">
            {spots.map((spot) => (
              <SpotCardContainer
                key={spot.id}
                spot={spot}
                initialIsFavorite={favoriteIds.includes(spot.id)}
              >
                {({ spot, isFavorite, toggleFavorite }) => (
                  <SpotCardTop
                    spot={spot}
                    isFavorite={isFavorite}
                    toggleFavorite={toggleFavorite}
                  />
                )}
              </SpotCardContainer>
            ))}
          </div>
        </div>
      </div>

      <NavigationBar />
    </div>
  );
}
