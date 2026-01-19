"use client";

import { useState } from "react";
import Link from "next/link";
import { Spot } from "@/types/spot";
import { FavoriteButton } from "@/components/favorite-button";
import { purposeTags } from "@/app/search/data";

type Props = {
  spot: Spot;
  initialIsFavorite: boolean;
};

export function SpotCard({ spot, initialIsFavorite }: Props) {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);

  const toggleFavorite = async () => {
    try {
      if (isFavorite) {
        await fetch(`http://localhost:8011/api/favorites/${spot.id}`, {
          method: "DELETE",
        });
        setIsFavorite(false);
      } else {
        await fetch(`http://localhost:8011/api/favorites`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ spot_id: spot.id }),
        });
        setIsFavorite(true);
      }
    } catch (e) {
      console.error("お気に入り切替失敗", e);
    }
  };

  return (
    <Link
      href={`/detail/${spot.id}`}
      className="bg-card-back rounded-lg p-2 shadow-[0_0_6px_0_rgba(0,0,0,0.3)]"
    >
      <img src={spot.image_url} alt={spot.name} className="rounded-md" />
      <div className="p-2">
        <div className="min-h-[68px]">
          <p className="font-semibold text-base mt-1 line-clamp-2">
            {spot.name}
          </p>
          <p className="text-sm">{spot.areaName}エリア</p>
        </div>
        <p className="text-sm mt-1 line-clamp-3">{spot.description}</p>
      </div>
      <div className="grid grid-cols-[5fr_1fr]">
        <div className="flex flex-wrap gap-1 mt-1">
          {spot.tags?.map((tag) => (
            <span
              key={tag}
              className="text-xs py-1 px-2 rounded-full bg-card-tag border border-[0.5px]"
            >
              {tag}
            </span>
          ))}
        </div>

        <div>
          <FavoriteButton
            isFavorite={isFavorite}
            onToggle={toggleFavorite}
            iconClassName="w-5 h-5"
          />
        </div>
      </div>
    </Link>
  );
}
