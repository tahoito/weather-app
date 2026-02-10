"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeftIcon, MapPinIcon, StarIcon, X, Disc2 } from "lucide-react";
import { RainCouponIcon } from "@/components/icon/rain-coupon-icon";

import { MapPinSimpleIcon } from "@/components/icon/map-pin-simple-icon";
import { FavoriteButton } from "@/components/favorite-button";
import { NavigationBar } from "@/components/navigation-bar";

import { apiClient } from "@/api/apiClient";
import { fetchAreas, Area } from "@/api/area-index";
import { fetchFavorites } from "@/api/favorite-index";
import { Spot } from "@/types/spot";

type WeatherInfo = {
  precipitation: number;
  humidity: number;
  windSpeed: number;
  temperature: number;
  weatherCode: number;
};

export default function Page() {
  const params = useParams();
  const router = useRouter();
  const spotId = params?.spotId as string;

  const [spot, setSpot] = useState<Spot | null>(null);
  const [loading, setLoading] = useState(true);

  const [areas, setAreas] = useState<Area[]>([]);
  const [currentArea, setCurrentArea] = useState<Area | null>(null);

  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const [rainBenefitOpen, setRainBenefitOpen] = useState(false);

  // areas 読み込み（エリア名正規化用）
  useEffect(() => {
    (async () => {
      try {
        const data = await fetchAreas();
        setAreas(data);

        const savedSlug = localStorage.getItem("selectedAreaSlug");
        const saved = savedSlug ? data.find((a) => a.slug === savedSlug) : null;
        setCurrentArea(saved ?? data[0] ?? null);
      } catch (e) {
        console.error("loadAreas error", e);
      }
    })();
  }, []);

  // お気に入りID読み込み（表示用）
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

  // Spot 取得（areas が揃ってから実行して、areaName を確実に付ける）
  useEffect(() => {
    if (!spotId) return;
    if (areas.length === 0) return;

    const fetchSpot = async () => {
      setLoading(true);
      try {
        const res = await apiClient.get(`/spot/${spotId}`);
        const apiSpot = res.data?.data ?? res.data;

        const areaName =
          areas.find((a) => a.slug === apiSpot.area)?.name ?? apiSpot.area;

        const normalizedTags: string[] = Array.isArray(apiSpot.tags)
          ? apiSpot.tags
              .map((t: any) => (typeof t === "string" ? t : t?.name ?? t?.slug ?? t?.label))
              .filter((v: any): v is string => typeof v === "string" && v.length > 0)
          : [];

        const imageUrls: string[] = Array.isArray(apiSpot.imageUrls)
          ? apiSpot.imageUrls.filter((u: any) => typeof u === "string")
          : [];

        const weatherSuitability = normalizeWeatherSuitability(
          apiSpot.weatherSuitability ?? apiSpot.weather_suitability
        );


        const highlights: string[] = Array.isArray(apiSpot.highlights)
          ? apiSpot.highlights.filter((v: any) => typeof v === "string")
          : [];

        setSpot({
          ...apiSpot,
          lat: Number(apiSpot.lat),
          lon: Number(apiSpot.lon),
          is_indoor: Boolean(apiSpot.is_indoor),
          weather_ok: Boolean(apiSpot.weather_ok),
          imageUrls,
          tags: normalizedTags,
          areaName,
          weatherSuitability,
          highlights,
        } as Spot);
      } catch (error) {
        console.error("fetchSpot error", error);
        setSpot(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSpot();
  }, [spotId, areas.length]);

  // isFavorite 反映
  useEffect(() => {
    if (!spot) return;
    setIsFavorite(favoriteIds.includes(spot.id));
  }, [favoriteIds, spot?.id]);

  // 画像自動スライド
  useEffect(() => {
    if (!spot || !spot.imageUrls || spot.imageUrls.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === spot.imageUrls.length - 1 ? 0 : prev + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [spot?.imageUrls?.length]);

  // お気に入り切替（apiClientでtoken付き）
  const toggleFavorite = async () => {
    if (!spot) return;

    const next = !isFavorite;

    setIsFavorite(next);
    setFavoriteIds((prev) => 
      next ? [...prev, spot.id] : prev.filter((id) => id !== spot.id)
    );

    try {
      if (next) {
        await apiClient.post(`/favorites`, { spot_id: spot.id });
      } else {
        await apiClient.delete(`/favorites/${spot.id}`);
      }
    } catch (e) {
      // 失敗したら元に戻す
      setIsFavorite(!next);
      setFavoriteIds((prev) =>
        !next ? [...prev, spot.id] : prev.filter((id) => id !== spot.id)
      );
      console.error("お気に入り切替失敗", e);
    }
  };

  function parseWeatherLine(s: string) {
    const t = (s ?? "").trim();

    const m = t.match(/^([^:：｜|]+)\s*[:：｜|]\s*(.+)$/);
    if (!m) return { label: "", text: t};
    return { label: m[1].trim(), text: m[2].trim() };
  }

  function normalizeWeatherSuitability(raw: unknown): string[] {
    if (Array.isArray(raw)) {
      // すでに配列なら、その中身が "晴れ：..." を含む場合もあるので平坦化
      return raw
        .flatMap((v) => normalizeWeatherSuitability(v))
        .filter((v): v is string => typeof v === "string" && v.trim().length > 0);
    }

    if (typeof raw !== "string") return [];

    // 例: "晴れ：...｜くもり：...｜雨：..."
    // 区切りが "|" の時もあるので両対応
    return raw
      .split(/[｜|]/)
      .map((s) => s.trim())
      .filter(Boolean);
  }

  function parsePriceLines(price?: string) {
    const s = (price ?? "").trim();
    if (!s || s === "なし") return [];

    // 区切り：改行 / ・ / 　/ スペース多め
    // CSVだと全角スペースや "　" が混ざりやすいので雑に対応
    const rough = s
      .replace(/　/g, " ")
      .replace(/・/g, "\n")
      .replace(/\s{2,}/g, "\n")
      .split(/\n+/)
      .map((x) => x.trim())
      .filter(Boolean);

    // "一般:2900円" みたいなのを key/value に
    return rough.map((line) => {
      const m = line.match(/^(.+?)[:：]\s*(.+)$/);
      if (!m) return { label: "", value: line };
      return { label: m[1].trim(), value: m[2].trim() };
    });
  }

  function loadCachedWeather(): WeatherInfo | null {
    if (typeof window === "undefined") return null;

    try {
      const raw = sessionStorage.getItem("top_cache_v1");
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return parsed?.weather ?? null;
    } catch {
      return null;
    }
  }

  const [weather, setWeather] = useState<WeatherInfo | null>(null);

  useEffect(() => {
    setWeather(loadCachedWeather());
  }, []);

  const isRain = (weather?.precipitation ?? 0) > 0;

  if (loading) return <div className="bg-back min-h-screen p-6">読み込み中...</div>;
  if (!spot) return <div className="bg-back min-h-screen p-6">スポットが見つかりません</div>;

  const images = spot.imageUrls ?? [];

  const modalUi = isRain
    ? {
        iconColor: "text-rainy",
        titleColor: "text-fg",
        statusText: "利用できます",
        statusColor: "text-rainy",
        mainText: "本日来店すると10%オフ！",
        subText: "この画面を店舗で提示してください",
      }
    : {
        iconColor: "text-sub",
        titleColor: "text-fg",
        statusText: "今日は対象外です",
        statusColor: "text-sub",
        mainText: "雨の日に来店すると10%オフ！",
        subText: "雨の日にこの画面が使えるようになります",
      };

  return (
    <div className="bg-back w-full min-h-screen pb-24">
      <div className="mx-9 pt-5">
        {/* ヘッダー */}
        <div className="relative py-3">
          <div className="absolute top-1/2 -translate-y-1/2">
            <button onClick={() => router.back()}>
              <ArrowLeftIcon className="w-7 h-7" />
            </button>
          </div>

          <p className="text-center font-semibold text-lg px-14">{spot.name}</p>

          <div className="absolute top-1/2 right-0 -translate-y-1/2 flex justify-end">
            <FavoriteButton
              isFavorite={isFavorite}
              onToggle={toggleFavorite}
              iconClassName="w-7 h-7"
            />
          </div>
        </div>

        {/* 画像スライダー */}
        <div
          className="overflow-hidden w-full touch-pan-y"
          onTouchStart={(e) => setTouchStartX(e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchStartX === null) return;
            const touchEndX = e.changedTouches[0].clientX;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > 50 && images.length > 0) {
              if (diff > 0) {
                setCurrentIndex((prev) =>
                  Math.min(prev + 1, images.length - 1)
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
            {(images.length ? images : [""]).map((src, index) => (
              <img
                key={index}
                src={src || "/images/no-image.png"}
                alt={`${spot.name}-${index + 1}`}
                className="w-full h-[160px] object-cover flex-shrink-0 rounded-md"
              />
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-2 my-3">
          {(images.length ? images : [""]).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full ${
                currentIndex === index ? "bg-holder" : "border border-holder bg-transparent"
              }`}
            />
          ))}
        </div>

        {/* 基本情報 */}
        <div className="[&>*]:mb-1 mb-2">
          <div className="relative">
            <p className="font-bold text-2xl leading-tight pr-16">{spot.name}</p>
            <div className="absolute top-0 right-0">
              <Link href={`/map?lat=${spot.lat}&lon=${spot.lon}&spotId=${spot.id}`}>
                <div className="border border-[0.5px] rounded-xl bg-white p-2 flex flex-col items-center gap-0.5 active:scale-[0.98] transition">
                  <MapPinIcon className="w-6 h-6 text-sub" />
                  <p className="text-sm leading-none">マップ</p>
                </div>
              </Link>
            </div>
          </div>
          <p className="text-xl">{spot.areaName}エリア</p>

          <div className="flex items-center gap-2 mt-1">
            <span className="text-base text-text">
              {spot.is_indoor ? "屋内" : "屋外"}
            </span>

            {spot.is_indoor && (
              <button
                type="button"
                onClick={() => setRainBenefitOpen(true)}
                className={`inline-flex items-center gap-1 rounded-xl px-2 py-1
                  border border-[0.5px] border-fg bg-white text-sm
                  active:scale-[0.98] transition
                  ${isRain ? "text-rainy" : "text-placeholder"}
                `}
              >
                <RainCouponIcon
                  className={`w-4 h-4 ${isRain ? "text-rainy" : "text-sub"}`}
                />
                <span>雨の日特典</span>
              </button>
            )}
          </div>
          <p>{spot.detail}</p>
        </div>

        {/* タグ */}
        <div className="flex justify-end gap-2 flex-wrap">
          {(spot.tags ?? []).map((tag) => (
            <span key={tag} className="text-sm py-2.5 px-4 rounded-full bg-main">
              {tag}
            </span>
          ))}
        </div>

        <div className="[&>*]:mt-7">
          {/* 天気適正 */}
          <div className="relative border rounded-2xl p-4 pt-6">
            <div className="absolute -top-3 left-6 bg-back px-3 text-lg">
              <div className="flex items-center gap-1 text-lg">
                <Image src="/images/weather.svg" alt="weather" width={24} height={18} />
                <span>天気適正</span>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-3">
              <div className="flex flex-col items-center gap-1">
                <Image src="/images/rainy.svg" alt="rainy" width={19} height={16} />
                <div className="flex items-center justify-center">
                  {spot.is_indoor ? <Disc2 className="w-5 h-5" /> : <X className="w-5 h-5" />}
                </div>
              </div>

              <div className="flex flex-col items-center gap-1">
                <Image src="/images/sun-icon.svg" alt="sun" width={16} height={16} />
                <div className="flex items-center justify-center">
                  {spot.weather_ok ? <Disc2 className="w-5 h-5" /> : <X className="w-5 h-5" />}
                </div>
              </div>
            </div>

            {(spot.weatherSuitability ?? []).length === 0 ? (
              <p className="text-sm text-holder">情報がありません</p>
            ) : (
              <div className="grid gap-2">
                {(spot.weatherSuitability ?? []).map((w) => {
                  const { label, text } = parseWeatherLine(w);
                  return (
                    <div
                      key={w}
                      className="rounded-xl border border-holder/50 bg-white/70 px-3 py-2"
                    >
                      {label ? (
                        <div className="flex items-start gap-2">
                          <span className="shrink-0 rounded-full bg-main px-2 py-0.5 text-xs">
                            {label}
                          </span>
                          <p className="text-sm leading-relaxed">{text}</p>
                        </div>
                      ) : (
                        <p className="text-sm leading-relaxed">{text}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* おすすめポイント */}
          <div className="relative border rounded-2xl p-4 pt-6">
            <div className="absolute -top-3 left-6 bg-back px-3 text-lg flex items-center gap-1">
              <StarIcon className="w-5 h-5 stroke-main fill-main" />
              <span>おすすめポイント</span>
            </div>

            {(spot.highlights ?? []).length === 0 ? (
              <p className="text-sm text-holder">情報がありません</p>
            ) : (
              <ul className="list-disc list-inside">
                {(spot.highlights ?? []).map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            )}
          </div>

          {/* 基本情報 */}
          <div className="relative border rounded-2xl p-4 pt-6">
            <div className="absolute -top-3 left-6 bg-back px-3 text-lg flex items-center gap-1">
              <MapPinSimpleIcon className="w-5 h-5" />
              <span>基本情報</span>
            </div>

            {(() => {
              const lines = parsePriceLines(spot.price);

              const priceText =
                lines.length === 0
                  ? "情報がありません"
                  : lines
                      .map((r) => (r.label ? `${r.label} ${r.value}` : r.value))
                      .join(" / ");

              const hoursText = spot.openingHours?.trim()
                ? spot.openingHours
                : "情報がありません";

              return (
                <div className="grid gap-2 text-base">
                  <p className="flex items-baseline gap-3">
                    <span className="whitespace-nowrap text-fg/80">料金：</span>
                    <span className="font-medium">{priceText}</span>
                  </p>

                  <p className="flex items-baseline gap-3">
                    <span className="whitespace-nowrap text-fg/80">営業時間：</span>
                    <span className="font-medium">{hoursText}</span>
                  </p>
                </div>
              );
            })()}
          </div>
        </div>
      </div>

      {rainBenefitOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center">
          <button
            className="absolute inset-0 bg-black/40"
            onClick={() => setRainBenefitOpen(false)}
            aria-label="close"
          />

          <div className="relative w-[320px] rounded-2xl bg-back p-5 border border-holder">
            <button
              onClick={() => setRainBenefitOpen(false)}
              className="absolute top-3 right-3"
              aria-label="close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex justify-center items-center gap-3">
              <RainCouponIcon className={`w-12 h-12 ${modalUi.iconColor}`} />
              <div>
                <p className={`text-lg ${modalUi.titleColor}`}>雨の日限定特典</p>
                <p className={`text-base ${modalUi.statusColor}`}>
                  {modalUi.statusText}
                </p>
              </div>
            </div>

            <p className="text-center mt-4 text-base">{modalUi.mainText}</p>

            <p className="text-center mt-2 text-xs text-holder">
              {modalUi.subText}
            </p>
          </div>
        </div>
      )}
      <NavigationBar />
    </div>
  );
}
