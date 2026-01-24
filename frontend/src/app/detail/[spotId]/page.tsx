"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon, MapPinIcon, StarIcon, X, Disc2 } from "lucide-react";
import { MapPinSimpleIcon } from "@/components/icon/map-pin-simple-icon";
import { FavoriteButton } from "@/components/favorite-button";
import { fetchAreas, Area } from "@/api/area-index";
import { fetchFavorites } from "@/api/favorite-index";
import Image from "next/image";

interface Spot {
  id: number;
  name: string;
  detail: string;
  area: string;
  areaName?: string;
  tags: string[];
  price?: string;
  openingHours?: string;
  imageUrls: string[];
  weatherSuitability: string[];
  highlights: string[];
  is_indoor: string;
  weather_ok: string;
}

export default function Page() {
  const [spot, setSpot] = useState<Spot | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [areas, setAreas] = useState<Area[]>([]);
  const [currentArea, setCurrentArea] = useState<Area | null>(null);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);

  const params = useParams();
  const spotId = params?.spotId as string;

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
    const fetchSpot = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/spot/${spotId}`);
        if (!res.ok) throw new Error("Failed to fetch spot");

        const data = await res.json();
        const apiSpot = data.data;

        const areaName =
          areas.find((a) => a.slug === apiSpot.area)?.name ?? apiSpot.area;

        setSpot({
          ...apiSpot,
          tags: apiSpot.tags ?? [],
          areaName,
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSpot();
  }, [spotId, areas]);

  useEffect(() => {
    if (!spot || spot.imageUrls.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === spot.imageUrls.length - 1 ? 0 : prev + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [spot]);

  useEffect(() => {
    async function loadFavorites() {
      try {
        const favorites = await fetchFavorites();
        setFavoriteIds(favorites.map((f) => f.spot.id));
      } catch (e) {
        console.error("loadFavorites error:", e);
        setFavoriteIds([]);
      }
    }

    loadFavorites();
  }, [currentArea?.slug]);

  useEffect(() => {
    if (!spot) return;

    setIsFavorite(favoriteIds.includes(spot.id));
  }, [favoriteIds, spot]);

  const toggleFavorite = async () => {
    try {
      if (isFavorite) {
        const res = await fetch(`/api/favorites/${spot.id}`, {
          method: "DELETE",
        });
        if (!res.ok) {
          const detail = await res.text();
          console.error("DELETE failed:", res.status, detail);
          throw new Error(`DELETE failed: ${res.status}`);
        }
        setIsFavorite(false);
      } else {
        const res = await fetch(`/api/favorites`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ spot_id: spot.id }),
        });
        if (!res.ok) throw new Error(`POST failed: ${res.status}`);
        setIsFavorite(true);
      }
    } catch (e) {
      console.error("お気に入り切替失敗", e);
    }
  };

  if (loading) return <div>読み込み中...</div>;
  if (!spot) return <div>スポットが見つかりません</div>;

  return (
    <div className="bg-back w-full h-full">
      <div className="mx-9 pt-5 pb-24">
        <div className="relative py-3">

          <div className="absolute top-1/2 -translate-y-1/2">
            <Link href="/top">
              <ArrowLeftIcon className="w-7 h-7" />
            </Link>
          </div>

          <p className="text-center font-semibold text-lg px-14">
            {spot.name}
          </p>

          <div className="absolute top-1/2 right-0 -translate-y-1/2 flex justify-end">
            <FavoriteButton
              isFavorite={isFavorite}
              onToggle={toggleFavorite}
              iconClassName="w-7 h-7"
            />
          </div>
        </div>
        
        <div
          className="overflow-hidden w-full touch-pan-y"
          onTouchStart={(e) => setTouchStartX(e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchStartX === null) return;
            const touchEndX = e.changedTouches[0].clientX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
              if (diff > 0) {
                setCurrentIndex((prev) =>
                  Math.min(prev + 1, spot.imageUrls.length - 1)
                );
              } else {
                setCurrentIndex((prev) => Math.max(prev - 1, 0));
              }
            }
            setTouchStartX(null);
          }}
        >
          <div
            className="flex transition-transform duration-300"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {spot.imageUrls.map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`${spot.name}-${index + 1}`}
                className="w-full h-[160px] object-cover flex-shrink-0 rounded-md"
              />
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-2 my-3">
          {spot.imageUrls.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full ${currentIndex === index
                ? "bg-holder"
                : "border border-holder bg-transparent"
                }`}
            />
          ))}
        </div>

        <div className="[&>*]:mb-1 mb-2">
          <div className="relative">
            <p className="font-bold text-2xl leading-tight pr-16">
              {spot.name}
            </p>
            <div className="absolute top-0 right-0">
              <div className="border rounded-lg bg-white p-2 flex flex-col items-center gap-0.5">
                <MapPinIcon className="w-6 h-6 text-sub" />
                <p className="text-sm leading-none">マップ</p>
              </div>
            </div>
          </div>
          <p className="text-xl">{spot.areaName}エリア</p>
          <p>{spot.detail}</p>
        </div>

        <div className="flex justify-end gap-2 flex-wrap">
          {spot.tags?.map((tag) => (
            <span
              key={tag}
              className="text-sm py-2.5 px-4 rounded-full bg-main"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="[&>*]:mt-7">
          <div className="relative border rounded-2xl p-4 pt-6">
            <div className="absolute -top-3 left-6 bg-back px-3 text-lg">
              <div className="flex items-center gap-1 text-lg">
                <Image
                  src="/images/weather.svg"
                  alt="weather"
                  width={24}
                  height={18}
                />
                <span>天気適正</span>
              </div>
            </div>
            <div className="flex items-center gap-4 mb-3">
              <div className="flex flex-col items-center gap-1">
                <Image
                  src="/images/rainy.svg"
                  alt="rainy"
                  width={19}
                  height={16}
                />
                <div className="flex items-center justify-center">
                  {spot.is_indoor ? (
                    <Disc2 className="w-5 h-5" />
                  ) : (
                    <X className="w-5 h-5" />
                  )}
                </div>
              </div>

              <div className="flex flex-col items-center gap-1">
                <Image
                  src="/images/sun-icon.svg"
                  alt="sun"
                  width={16}
                  height={16}
                />
                <div className="flex items-center justify-center">
                  {spot.weather_ok ? (
                    <Disc2 className="w-5 h-5" />
                  ) : (
                    <X className="w-5 h-5" />
                  )}
                </div>
              </div>
            </div>

            <ul className="list-disc list-inside">
              {spot.weatherSuitability.map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
          </div>

          <div className="relative border rounded-2xl p-4 pt-6">
            <div className="absolute -top-3 left-6 bg-back px-3 text-lg flex items-center gap-1">
              <StarIcon className="w-5 h-5 stroke-main fill-main" />
              <span>おすすめポイント</span>
            </div>
            <ul className="list-disc list-inside">
              {spot.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </div>

          <div className="relative border rounded-2xl p-4 pt-6">
            <div className="absolute -top-3 left-6 bg-back px-3 text-lg flex items-center gap-1">
              <MapPinSimpleIcon className="w-5 h-5" />
              <span>基本情報</span>
            </div>
            <div>
              <p>
                <span className="mr-4">料金：</span>
                {spot.price}
              </p>
              <p>
                <span className="mr-4">営業時間：</span>
                {spot.openingHours}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
