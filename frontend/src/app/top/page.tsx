"use client";

import { useEffect, useState } from "react";
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

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    apiClient.get("/me")
      .catch(() => router.push("/auth/login"));
  }, [router]);

  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const fmt = (v?: number, suffix = "") =>
    typeof v === "number" ? `${v}${suffix}` : "--";
  const [spots, setSpots] = useState<Spot[]>([]);
  const [isAreaModalOpen, setIsAreaModalOpen] = useState(false);
  const [areaModalMode, setAreaModalMode] = useState<"initial" | "change">(
    "change"
  );
  const [areas, setAreas] = useState<Area[]>([]);
  const [currentArea, setCurrentArea] = useState<Area | null>(null);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);

  useEffect(() => {
    const shouldShow = localStorage.getItem("showAreaModal") === "true";
    if (shouldShow) {
      setAreaModalMode("initial");
      setIsAreaModalOpen(true);
      localStorage.removeItem("showAreaModal");
    }
  }, []);


  useEffect(() => {
    async function loadAreas() {
      try {
        const data = await fetchAreas();

        setAreas(data);

        const savedSlug = localStorage.getItem("selectedAreaSlug");
        const saved = savedSlug ? data.find((a) => a.slug === savedSlug) : null;

        setCurrentArea(saved ?? data[0] ?? null);
      } catch (e) {
        console.error("loadAreas error", e);
      }
    }

    loadAreas();
  }, []);

  useEffect(() => {
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
  }, [currentArea]);

  useEffect(() => {
    if (!currentArea || areas.length === 0 || !weather) return;

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

        setSpots(
          spotsData.map((spot) => ({
            ...spot,
            areaName:
              areas.find((a) => a.slug === spot.area)?.name || spot.area,
          }))
        );
      } catch (err) {
        console.error("loadSpots error:", err);
      }
    }

    loadSpots();
  }, [
    currentArea?.slug,
    areas.length,
    weather?.precipitation,
    weather?.humidity,
    weather?.windSpeed,
    weather?.temperature,
  ]);

  useEffect(() => {
    async function loadFavorites() {
      try {
        const favorites = await fetchFavorites();
        setFavoriteIds(favorites.map((s: any) => s.id));
      } catch (e) {
        console.error("loadFavorites error:", e);
        setFavoriteIds([]);
      }
    }

    loadFavorites();
  }, []);


  const handleMapClick = () => {
    const slug = localStorage.getItem("selectedAreaSlug") ?? "meieki";
    router.push(`/map?area=${encodeURIComponent(slug)}`);
  };

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
                    {weather?.temperature}
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
                <span className="text-xs">
                  {fmt(weather?.windSpeed, "m/s")}
                </span>
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
