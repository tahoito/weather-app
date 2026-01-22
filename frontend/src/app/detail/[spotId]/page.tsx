"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon, MapPinIcon, StarIcon } from "lucide-react";
import { MapPinSimpleIcon } from "@/components/icon/map-pin-simple-icon";
import { FavoriteButton } from "@/components/favorite-button";
import { fetchAreas, Area } from "@/api/area-index";

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
}

export default function Page() {
  const [spot, setSpot] = useState<Spot | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [areas, setAreas] = useState<Area[]>([]);
  const [currentArea, setCurrentArea] = useState<Area | null>(null);

  const params = useParams();
  const spotId = params.spotId;

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
        const res = await fetch(`http://localhost:8011/api/spot/${spotId}`);
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

  if (loading) return <div>読み込み中...</div>;
  if (!spot) return <div>スポットが見つかりません</div>;

  return (
    <div className="bg-back w-full h-full">
      <div className="mx-9 pt-5 pb-24">
        <div className="relative py-3">
          <Link
            href="/top"
            className="absolute top-1/2 left-5 -translate-y-1/2"
          >
            <ArrowLeftIcon className="w-7 h-7" />
          </Link>
          <p className="text-center font-semibold">{spot.name}</p>
          <div className="absolute top-1/2 right-5 -translate-y-1/2">
            <FavoriteButton
              isFavorite={isFavorite}
              onToggle={() => setIsFavorite((v) => !v)}
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
              天気適正
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
