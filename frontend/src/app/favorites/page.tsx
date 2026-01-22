"use client";

import { useEffect, useState } from "react";
import { SpotCard } from "@/components/spot-card";
import { NavigationBar } from "@/components/navigation-bar";
import { fetchFavorites } from "@/api/favorite-index";
import { fetchAreas, Area } from "@/api/area-index";
import { fetchSpotsRecommended, Spot } from "@/api/spot-recommend";
import { purposeTags } from "@/constants/tags";


export default function Page() {
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [spots, setSpots] = useState<Spot[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);

  const normalizeTags = (tag: unknown): string[] => {
    if (Array.isArray(tag)) return tag;
    if (typeof tag === "string") return [tag];
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
          const areaName =
            areas.find((a) => a.slug === f.spot.area)?.name ?? f.spot.area;

          return {
            ...f.spot,
            areaName,
            tags: normalizeTags((f.spot as any).tags ?? (f.spot as any).tag).map(tagToLabel),
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
