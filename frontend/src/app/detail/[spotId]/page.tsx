"use client";

import { useEffect, useState } from "react";
import { dummySpots } from "@/data/dummySpots";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { HeartIcon } from "lucide-react";
import { MapPinIcon } from "lucide-react";
import { StarIcon } from "lucide-react";
import { MapPinSimpleIcon } from "@/components/icon/map-pin-simple-icon";
import { FavoriteButton } from "@/components/favorite-button";

export default function Page() {
  const [spots, setSpots] = useState(dummySpots);
  const params = useParams();
  const spotId = Number(params.spotId);
  const spot = dummySpots.find((s) => s.id === spotId);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  if (!spot) {
    return <div>スポットが見つかりません</div>;
  }

  useEffect(() => {
    if (spot.imageUrls.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === spot.imageUrls.length - 1 ? 0 : prev + 1
      );
    }, 4000); 

    return () => clearInterval(interval);
  }, [spot.imageUrls.length]);

  return (
    <div className="bg-back w-full h-full">
      <div className="mx-9 pt-16 pb-24">
        <div>
          <Link href="/top" className="absolute top-15 left-9">
            <ArrowLeftIcon className="w-7 h-7" />
          </Link>
          <FavoriteButton
            isFavorite={isFavorite}
            onToggle={() => setIsFavorite((v) => !v)}
            className="absolute top-15 right-9"
            iconClassName="w-7 h-7"
          />
        </div>
        <div className="text-center mb-4">
          <p className="font-semibold">{spot.name}</p>
        </div>
        <div
          className="overflow-hidden w-full touch-pan-y"
          onTouchStart={(e) => {
            setTouchStartX(e.touches[0].clientX);
          }}
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
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
            }}
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
              className={`w-2 h-2 rounded-full ${
                currentIndex === index
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
                <MapPinIcon className="w-6 h-6  text-sub" />
                <p className="text-sm leading-none">マップ</p>
              </div>
            </div>
          </div>
          <p className="text-xl">{spot.area}</p>
          <p>屋内</p>
          <p>{spot.description}</p>
        </div>
        <div className="flex justify-end gap-2">
          {spot.tag && (
            <span className="text-sm py-2.5 px-4 rounded-full bg-main">
              {spot.tag}
            </span>
          )}
        </div>
        <div className="[&>*]:mt-7">
          <div className="relative border rounded-2xl p-4 pt-6">
            <div className="absolute -top-3 left-6 bg-back px-3 text-lg ">
              天気適正
            </div>
            <ul className="list-disc list-inside">
              {spot.weatherSuitability.map((weatherSuitability) => (
                <li key={weatherSuitability}>{weatherSuitability}</li>
              ))}
            </ul>
          </div>
          <div className="relative border rounded-2xl p-4 pt-6">
            <div className="absolute -top-3 left-6 bg-back px-3 text-lg ">
              <div className="flex items-center gap-1 text-lg">
                <StarIcon className="w-5 h-5 stroke-main fill-main" />
                <span>おすすめポイント</span>
              </div>
            </div>
            <ul className="list-disc list-inside">
              {spot.highlights.map((highlights) => (
                <li key={highlights}>{highlights}</li>
              ))}
            </ul>
          </div>
          <div className="relative border rounded-2xl p-4 pt-6">
            <div className="absolute -top-3 left-6 bg-back px-3 text-lg ">
              <div className="flex items-center gap-1 text-lg">
                <MapPinSimpleIcon className="w-5 h-5" />
                <span>基本情報</span>
              </div>
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
