"use client";

import { useEffect, useMemo, useState } from "react";
import { SpotCardTop } from "@/components/spot-card/SpotCardTop";
import { SpotCardContainer } from "@/components/spot-card/SpotCardContainer";
import { NavigationBar } from "@/components/navigation-bar";
import { fetchFavorites } from "@/api/favorite-index";
import { fetchAreas, Area } from "@/api/area-index";
import type { Spot } from "@/types/spot";
import { purposeTags } from "@/constants/tags";

type FavCache = {
  favoriteIds: number[];
  spots: Spot[];
  savedAt: number;
};

export default function Page() {
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [spots, setSpots] = useState<Spot[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);

  const [loading, setLoading] = useState(true);
  const [loadingAreas, setLoadingAreas] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const FAV_CACHE_KEY = "favorite_spots_v1";
  const FAV_CACHE_TTL = 1000 * 60 * 10; // 10分

  function loadFavCache(): FavCache | null {
    try {
      if (typeof window === "undefined") return null;

      const raw = sessionStorage.getItem(FAV_CACHE_KEY);
      if (!raw) return null;

      const parsed = JSON.parse(raw) as FavCache;
      if (!parsed?.savedAt) return null;

      if (Date.now() - parsed.savedAt > FAV_CACHE_TTL) return null;
      return parsed;
    } catch {
      return null;
    }
  }

  function saveFavCache(data: { favoriteIds: number[]; spots: Spot[] }) {
    try {
      if (typeof window === "undefined") return;
      sessionStorage.setItem(
        FAV_CACHE_KEY,
        JSON.stringify({ ...data, savedAt: Date.now() } satisfies FavCache)
      );
    } catch {
      // sessionStorageが使えない環境もあるので握りつぶす
    }
  }

  const normalizeTags = (raw: unknown): string[] => {
    if (Array.isArray(raw)) {
      return raw
        .map((t: any) => {
          if (typeof t === "string") return t;
          if (t && typeof t === "object") return t.slug ?? t.name ?? t.label;
          return null;
        })
        .filter(Boolean) as string[];
    }
    if (typeof raw === "string") return [raw];
    return [];
  };

  const tagToLabel = useMemo(
    () => (slug: string) =>
      purposeTags.find((t) => t.slug === slug)?.label ?? slug,
    []
  );

  // ① まずキャッシュがあれば即表示（体感爆速）
  useEffect(() => {
    const cache = loadFavCache();
    if (!cache) return;

    setFavoriteIds(cache.favoriteIds ?? []);
    setSpots(cache.spots ?? []);
  }, []);

  // ② エリア取得（別で持っときたい場合用）
  useEffect(() => {
    (async () => {
      try {
        setLoadingAreas(true);
        const data = await fetchAreas();
        setAreas(data);
      } catch (e) {
        console.error("loadAreas error", e);
      } finally {
        setLoadingAreas(false);
      }
    })();
  }, []);

  // ③ 本命：お気に入り＋エリアを並列取得して整形 → state更新 → キャッシュ保存
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const [areasData, favorites] = await Promise.all([
          fetchAreas(),
          fetchFavorites(),
        ]);

        if (!mounted) return;

        setAreas(areasData);

        const favIds = (favorites ?? []).map((s: any) => Number(s.id)).filter(Boolean);
        setFavoriteIds(favIds);

        const spotsWithAreaName: Spot[] = (favorites ?? []).map((s: any) => {
          const areaName =
            areasData.find((a) => a.slug === s.area)?.name ?? s.area;

          const image_url =
            s.image_url ??
            s.imageUrl ??
            s.thumbnail_url ??
            s.thumbnailUrl ??
            (Array.isArray(s.imageUrls) ? s.imageUrls[0] : "") ??
            "";

          const tags = normalizeTags(s.tags ?? s.tag).map(tagToLabel);

          return {
            ...s,
            areaName,
            image_url,
            tags,
          } as Spot;
        });

        setSpots(spotsWithAreaName);

        saveFavCache({
          favoriteIds: favIds,
          spots: spotsWithAreaName,
        });
      } catch (e) {
        console.error("loadFavoriteSpots error:", e);
        if (mounted) setError("読み込みに失敗しました。通信状況を確認してね。");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [tagToLabel]);

  const filteredSpots = useMemo(() => {
    const set = new Set(favoriteIds);
    return (spots ?? []).filter((spot) => set.has(spot.id));
  }, [spots, favoriteIds]);

  return (
    <div className="bg-back min-h-screen pt-10 pb-20 [&>*]:text-fg">
      <p className="text-center text-lg font-semibold mb-6 pb-2 shadow-[0px_2px_3px_rgba(0,0,0,0.20)]">
        お気に入り一覧
      </p>

      {/* 読み込み表示 */}
      {(loading || loadingAreas) && (
        <div className="mx-4 mb-4">
          <div className="rounded-xl border border-black/10 bg-white/60 p-4">
            <div className="flex items-center gap-3">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-black/60" />
              <p className="text-sm">読み込み中…</p>
            </div>
          </div>
        </div>
      )}

      {/* エラー表示 */}
      {error && (
        <div className="mx-4 mb-4">
          <div className="rounded-xl border border-black/10 bg-white/60 p-4">
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      <div className="mx-4">
        {(!loading && filteredSpots.length === 0) ? (
          <div className="rounded-xl border border-black/10 bg-white/60 p-6 text-center">
            <p className="text-sm">まだお気に入りがないよ。</p>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="grid grid-cols-2 gap-2">
              {filteredSpots.map((spot) => (
                <SpotCardContainer
                  key={spot.id}
                  spot={spot}
                  initialIsFavorite={true}
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
        )}
      </div>

      <NavigationBar />
    </div>
  );
}
