"use client";

import { useEffect, useState } from "react";
import { SpotCard } from "@/components/spot-card";
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
          if (t && typeof t === "object") return t.slug ?? t.name;
          return null;
        })
        .filter(Boolean);
    }

    if (typeof raw === "string") {
      return [raw];
    }

    return [];
  };


  const tagToLabel = (slug: string) =>
    purposeTags.find((t) => t.slug === slug)?.label ?? slug;


  useEffect(() => {
    async function loadAreas() {
      try {
        const data = await fetchAreas();
        setAreas(data);
      } catch (e) {
        console.error("loadAreas error", e);
      }
    }

    loadAreas();
  }, []);

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
  }, []);

  useEffect(() => {
    async function loadFavoriteSpots() {
      try {
        const favorites = await fetchFavorites();

        const spotsWithAreaName = favorites.map((f) => {
          const s:any = f.spot;
          const areaName =
            areas.find((a) => a.slug === s.area)?.name ?? s.area;

            const image_url = 
              s.image_url ?? 
              s.imageUrl ??
              s.thumbnail_url ??
              s.thumbnailUrl ??
              (Array.isArray(s.imageUrls) ? s.imageUrls[0] : undefined)
              "";

          return {
            ...s,
            areaName,
            image_url,
            tags: normalizeTags(s.tags ?? s.tag).map(tagToLabel),
        };
      });

        setSpots(spotsWithAreaName);
      } catch (e) {
        console.error("loadFavorites error:", e);
        setSpots([]);
      }
    }

    // 👇 areas が揃ってから実行
    if (areas.length > 0) {
      loadFavoriteSpots();
    }
  }, [areas]);

  return (
    <div className="bg-back min-h-screen pt-10 pb-20 [&>*]:text-fg ">
      <p className="text-center text-lg font-semibold mb-6 pb-2 shadow-[0px_2px_3px_rgba(0,0,0,0.20)]">
        お気に入り一覧
      </p>
      <div className="mx-4">
        <div className="flex justify-center ">
          <div className="grid grid-cols-2 gap-2">
            {spots.map((spot) => (
              <SpotCard
                key={spot.id}
                spot={spot}
                initialIsFavorite={favoriteIds.includes(spot.id)}
              />
            ))}
          </div>
        </div>
      </div>
      <NavigationBar />
    </div>
  );
}
