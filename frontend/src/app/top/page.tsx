"use client";

import { useEffect, useState } from "react";
import { UmbrellaIcon } from "@/components/icon/umbrella-icon";
import { DropletIcon } from "@/components/icon/droplet-icon";
import { WindIcon } from "@/components/icon/wind-icon";
import { PencilLineIcon } from "@/components/icon/pencil-line-icon";
import { SpotCard } from "@/components/spot-card";
import { dummySpots } from "@/data/dummySpots";
import { weatherCodeMap } from "@/types/spot";

type WeatherInfo = {
  precipitation: number;
  humidity: number;
  windSpeed: number;
  temperature: number;
  weatherCode: number;
};

export default function Page() {
  const [weather, setWeather] = useState<WeatherInfo | null>(null);

  useEffect(() => {
    async function loadWeather() {
      try {
        const res = await fetch("/api/weather?lat=32&lon=130");
        if (!res.ok) {
          return;
        }
        const data = await res.json();
        setWeather(data);
      } catch (e) {}
    }
    loadWeather();
  }, []);

  return (
    <div className="bg-back min-h-screen [&>*]:text-fg ">
      <div className="flex items-center pt-15 text-[14px]">
        <div className="flex-1 flex justify-center gap-8">
          <p>現在のエリア</p>
          <p className="font-semibold text-base">名駅</p>
        </div>
        <div className="mr-6">
          <button className="flex justify-center gap-2 w-20 py-0.5 rounded-full border border-sub text-sub">
            <PencilLineIcon className="h-4 w-4" />
            変更
          </button>
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
                <span className="text-xs">{weather?.precipitation}%</span>
              </div>
              <div className="flex justify-center items-center gap-1">
                <DropletIcon className="h-5 w-5" />
                <span className="text-xs">{weather?.humidity}%</span>
              </div>
              <div className="flex justify-center items-center gap-1">
                <WindIcon className="h-5 w-5" />
                <span className="text-xs">{weather?.windSpeed}m/s</span>
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
            {dummySpots.map((spot) => (
              <SpotCard key={spot.id} spot={spot} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
