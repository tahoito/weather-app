"use client";

import { useState } from "react";
import Link from "next/link";
import { Spot } from "@/types/spot";
import { FavoriteButton } from "@/components/favorite-button";
import { purposeTags } from "@/app/search/data";
import { apiClient } from "@/api/apiClient";

type Props = {
  spot: Spot;
  initialIsFavorite?: boolean;
};

export function SpotCard({ spot, initialIsFavorite }: Props) {
  const [isFavorite, setIsFavorite] = useState(!!initialIsFavorite);
  const [isToggling, setIsToggling] = useState(false);

  const normalizeTags = (raw: unknown): string[] => {
    if (Array.isArray(raw)) {
      return raw
        .map((t: any) => {
          if (typeof t === "string") return t;
          if (t && typeof t === "object") return t.label ?? t.name ?? t.slug;
          return null;
        })
        .filter(Boolean) as string[];
    }
    if (typeof raw === "string") return [raw];
    return [];
  };

  const tagToLabel = (slug: string) =>
    purposeTags.find((t) => t.slug === slug)?.label ?? slug;

  const tags = normalizeTags((spot as any).tags ?? (spot as any).tag).map(
    tagToLabel
  );
  const displayTags = tags.slice(0, 1);

  const imgSrc: string | null =
    (spot as any).thumbnailUrl ??
    (spot as any).thumbnail_url ??
    (spot as any).image_url ??
    (spot as any).imageUrl ??
    (Array.isArray((spot as any).imageUrls)
      ? (spot as any).imageUrls[0]
      : undefined) ??
    null;

  const hasImage = typeof imgSrc === "string" && imgSrc.trim() !== "";

  const toggleFavorite = async () => {
    if (isToggling) return;

    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      alert("ログインが必要です");
      return;
    }

    // 先に反映（楽観的更新）
    const next = !isFavorite;
    setIsFavorite(next);
    setIsToggling(true);

    try {
      if (!next) {
        await apiClient.delete(`/favorites/${spot.id}`);
      } else {
        await apiClient.post(`/favorites`, { spot_id: spot.id });
      }
    } catch (e: any) {
      // 失敗したら戻す
      setIsFavorite(!next);

      const status = e?.response?.status;
      console.error("お気に入り切替失敗", status, e?.response?.data, e);

      if (status === 401) alert("認証が切れてるかログインが必要です");
      else alert("お気に入りの更新に失敗しました");
    } finally {
      setIsToggling(false);
    }
  };


  return (
    <Link
      href={`/detail/${spot.id}`}
      className="bg-card-back rounded-lg p-2 shadow-[0_0_6px_0_rgba(0,0,0,0.3)]"
    >
      <div className="relative w-full aspect-[3/2] rounded-md overflow-hidden bg-gray-200">
        {hasImage ? (
          <img
            src={imgSrc!}
            alt={spot.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-sm text-gray-500">
            No Image
          </div>
        )}
      </div>


      <div className="p-2">
        <div className="min-h-[68px]">
          <p className="font-semibold text-base mt-1 line-clamp-2">
            {spot.name}
          </p>
          <p className="text-sm">{spot.areaName}エリア</p>
        </div>
        <p className="text-sm mt-1 line-clamp-2">{spot.description}</p>
      </div>

      <div className="grid grid-cols-[5fr_1fr]">
        <div className="flex flex-wrap gap-1 mt-1">
          {displayTags.map((tag) => (
            <span
              key={tag}
              className="text-xs py-1 px-2 rounded-full bg-card-tag border border-[0.5px]"
            >
              {tag}
            </span>
          ))}
        </div>

        <div
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
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
