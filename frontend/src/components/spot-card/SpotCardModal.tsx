"use client";

import Link from "next/link";
import { Spot } from "@/types/spot";
import { FavoriteButton } from "@/components/favorite-button";
import { purposeTags } from "@/app/search/data";

type Props = {
  spot: Spot;
  isFavorite: boolean;
  toggleFavorite: () => Promise<void>;
};

export function SpotCardModal({ spot, isFavorite, toggleFavorite }: Props) {
  const normalizeTags = (raw: unknown): string[] => {
    if (Array.isArray(raw)) {
      return raw
        .map((t: any) => {
          if (typeof t === "string") return t;
          if (t && typeof t === "object") return t.label ?? t.name ?? t.slug;
          return null;
        })
        .filter(Boolean);
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

  return (
    <Link
      href={`/detail/${spot.id}`}
      className="relative h-[162px] w-[353px] bg-card-back rounded-lg p-2 shadow-[0_0_6px_0_rgba(0,0,0,0.3)]"
    >
      <div className="flex items-center gap-2 h-full">
        {hasImage ? (
          <div className="w-[163px] h-[134px] overflow-hidden rounded-md">
            <img
              src={imgSrc}
              alt={spot.name}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-[163px] h-[134px] rounded-md bg-gray-200 flex items-center justify-center text-sm text-gray-500">
            No Image
          </div>
        )}

        <div className="p-2 flex-1">
          <div className="min-h-[68px]">
            <p className="font-semibold text-base mt-1 line-clamp-2">
              {spot.name}
            </p>
            <p className="text-sm">{spot.areaName}エリア</p>
          </div>
          <p className="text-sm mt-1 line-clamp-2">{spot.description}</p>
        </div>
      </div>

      {/* タグ + お気に入り（absolute） */}
      <div className="absolute bottom-2 right-2 max-w-[220px]">
        <div className="flex flex-wrap gap-1">
          {displayTags.map((tag) => (
            <span
              key={tag}
              className="text-xs py-1 px-2 rounded-full bg-card-tag border border-[0.5px]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div
        className="absolute top-2 right-2"
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
    </Link>
  );
}
