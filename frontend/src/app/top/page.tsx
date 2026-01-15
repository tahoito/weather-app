"use client";

import { useEffect, useState } from "react";
import { UmbrellaIcon } from "@/components/icon/umbrella-icon";
import { DropletIcon } from "@/components/icon/droplet-icon";
import { WindIcon } from "@/components/icon/wind-icon";
import { PencilLineIcon } from "@/components/icon/pencil-line-icon";
import { SpotCard } from "@/components/spot-card";
import { dummySpots } from "@/data/dummySpots";
import { weatherCodeMap } from "@/types/spot";
import { NavigationBar } from "@/components/navigation-bar";
import { X } from "lucide-react";

type WeatherInfo = {
  precipitation: number;
  humidity: number;
  windSpeed: number;
  temperature: number;
  weatherCode: number;
};

type Area = {
  id: number;
  name: string;
  slug: string;
  lat: number;
  lon: number;
};

// type AreaModalMode = "initial" | "change";

export default function Page() {
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const fmt = (v?: number, suffix = "") =>
    typeof v === "number" ? `${v}${suffix}` : "--";
  const [spots, setSpots] = useState(dummySpots);
  const [spotsLoading, setSpotsLoading] = useState(false);
  const [isAreaModalOpen, setIsAreaModalOpen] = useState(false);
  const [areaModalMode, setAreaModalMode] = useState<"initial" | "change">(
    "change"
  );
  const [areas, setAreas] = useState<Area[]>([]);
  const [currentArea, setCurrentArea] = useState<Area | null>(null);

  useEffect(() => {
    const justEntered = localStorage.getItem("justEnteredApp");

    if (justEntered === "true") {
      setAreaModalMode("initial");
      setIsAreaModalOpen(true);
      localStorage.removeItem("justEnteredApp");
    }
  }, []);

  useEffect(() => {
    async function loadAreas() {
      try {
        const base = process.env.NEXT_PUBLIC_API_BASE_URL;
        const res = await fetch(`${base}/api/areas`);
        if (!res.ok) return;

        const json = await res.json();
        const data: Area[] = Array.isArray(json) ? json : json.data;
        setAreas(data);



        const savedSlug = localStorage.getItem("selectedAreaSlug");
        const saved = savedSlug ? data.find(a => a.slug === savedSlug) : null;
        setCurrentArea(saved ?? data[0]);
      } catch (e) {}
    }

    loadAreas();
  }, []);

  useEffect(() => {
    if (!currentArea) return;

    async function loadWeather() {
      try {
        const res = await fetch(
          `/api/weather?lat=${currentArea.lat}&lon=${currentArea.lon}`
        );
        if (!res.ok) return;

        const data = await res.json();
        setWeather(data);
      } catch (e) {}
    }

    loadWeather();
  }, [currentArea]);

  // useEffect(() => {
  //   if (!currentArea) return;

  //   async function load() {
  //     setSpotsLoading(true);

  //     const res = await fetch(
  //       `/api/spots/recommended?area=${currentArea.slug}`
  //     );
  //     if (!res.ok) return;

  //     const data = await res.json();
  //     setSpots(data);
  //     setSpotsLoading(false);
  //   }

  //   load();
  // }, [currentArea]);

  return (
    <div className="bg-back min-h-screen pb-20 [&>*]:text-fg ">
      <div className="flex items-center pt-15">
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
          {isAreaModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div
                className={`bg-white rounded-2xl p-6 w-[320px] border relative text-sm ${
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
                          setIsAreaModalOpen(false);
                        }}
                      >
                        {area.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
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
                    const weatherInfo = weatherCodeMap[weather.weatherCode];
                    if (!weatherInfo) return <p className="mt-1">情報なし</p>;
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
              <SpotCard key={spot.id} spot={spot} />
            ))}
          </div>
        </div>
      </div>
      <NavigationBar />
    </div>
  );
}
