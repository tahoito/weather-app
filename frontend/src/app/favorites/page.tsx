"use client";

import { useEffect, useState } from "react";
import { SpotCardTop } from "@/components/spot-card/SpotCardTop";
import { SpotCardContainer } from "@/components/spot-card/SpotCardContainer";
import { NavigationBar } from "@/components/navigation-bar";
import { fetchFavorites } from "@/api/favorite-index";
import { fetchAreas, Area } from "@/api/area-index";
import { Spot } from "@/types/spot";
import { purposeTags } from "@/constants/tags";

export default function Page() {
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [spots, setSpots] = useState<Spot[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);

  const normalizeTags = (raw: unknown): string[] => {
    if (Array.isArray(raw)) {
      return raw
        .map((t: any) => {
          if (typeof t === "string") return t;
          if (t && typeof t === "object") return t.slug ?? t.name ?? t.label;
          return null;
        })
        .filter(Boolean);
    }
    if (typeof raw === "string") return [raw];
    return [];
  };

  const tagToLabel = (slug: string) =>
    purposeTags.find((t) => t.slug === slug)?.label ?? slug;

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchAreas();
        setAreas(data);
      } catch (e) {
        console.error("loadAreas error", e);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const favorites = await fetchFavorites();
        setFavoriteIds(favorites.map((s: any) => s.id));
      } catch (e) {
        console.error("loadFavorites error:", e);
        setFavoriteIds([]);
      }
    })();
  }, []);

  useEffect(() => {
    async function loadFavoriteSpots() {
      try {
        const favorites = await fetchFavorites();

        const spotsWithAreaName = favorites.map((s: any) => {
          const areaName = areas.find((a) => a.slug === s.area)?.name ?? s.area;

          const image_url =
            s.image_url ??
            s.imageUrl ??
            s.thumbnail_url ??
            s.thumbnailUrl ??
            (Array.isArray(s.imageUrls) ? s.imageUrls[0] : undefined) ??
            "";

          const tags = normalizeTags(s.tags ?? s.tag).map(tagToLabel);

          return {
            ...s,
            areaName,
            image_url,
            tags,
          };
        });

        setSpots(spotsWithAreaName);
      } catch (e) {
        console.error("loadFavoriteSpots error:", e);
        setSpots([]);
      }
    }

    if (areas.length > 0) loadFavoriteSpots();
  }, [areas]);

  return (
    <div className="bg-back min-h-screen pt-10 pb-20 [&>*]:text-fg ">
      <p className="text-center text-lg font-semibold mb-6 pb-2 shadow-[0px_2px_3px_rgba(0,0,0,0.20)]">
        お気に入り一覧
      </p>

      <div className="mx-4">
        <div className="flex justify-center">
          <div className="grid grid-cols-2 gap-2">
            {spots
              .filter((spot) => favoriteIds.includes(spot.id)) // ★ お気に入りだけ
              .map((spot) => (
                <SpotCardContainer
                  key={spot.id}
                  spot={spot}
                  initialIsFavorite={true} // お気に入り一覧なので true 固定でOK
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
