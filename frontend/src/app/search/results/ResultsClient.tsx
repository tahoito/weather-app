"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { ArrowLeft, X } from "lucide-react";

import { NavigationBar } from "@/components/navigation-bar";
import { SpotCard } from "@/components/spot-card";
import Modal from "@/components/Modal";

import type { Spot } from "@/types/spot";
import { apiClient } from "@/api/apiClient";
import { fetchAreas } from "@/api/area-index";

import {
  purposeTags,
  getDateOptions,
  getTimeOptions,
  getNearestTimeOption,
  getOneHourLaterTime,
  type AreaTag,
} from "../data";

import { AreaFilter } from "../_components/area-filter";
import { DateTimeFilter } from "../_components/date-time-filter";
import { PurposeFilter } from "../_components/purpose-filter";

type IndoorState = "both" | "outdoor" | "indoor";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL params
  const queryParam = searchParams.get("query") ?? undefined;
  const areasParam = searchParams.getAll("area"); // ← URLは area=... を複数
  const dateParam = searchParams.get("date") ?? undefined;
  const startParam = searchParams.get("start_time") ?? undefined;
  const endParam = searchParams.get("end_time") ?? undefined;
  const purposeParam = searchParams.get("purpose") ?? undefined;
  const indoorParam = searchParams.get("is_indoor") ?? undefined; // "1"/"0" or undefined

  // options
  const dateOptions = getDateOptions();
  const timeOptions = getTimeOptions();

  // areas from API
  const [areaTagsState, setAreaTagsState] = useState<AreaTag[]>([]);
  const [areaTagsLoaded, setAreaTagsLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const areas = await fetchAreas(); // auth付き(apiClient)の想定
        setAreaTagsState(
          areas.map((a) => ({
            slug: a.slug,
            label: a.name,
            lat: Number(a.lat),
            lon: Number(a.lon),
          }))
        );
      } catch (e) {
        console.error("fetchAreas error", e);
        setAreaTagsState([]);
      } finally {
        setAreaTagsLoaded(true);
      }
    })();
  }, []);

  // UI state (search pageと合わせる)
  const [areaSlugs, setAreaSlugs] = useState<string[]>(() => {
    return areasParam.length ? areasParam : ["meieki"];
  });

  const [date, setDate] = useState<string>(dateParam ?? (dateOptions[0]?.value || ""));
  const initialStartTime = startParam ?? getNearestTimeOption(timeOptions);
  const [startTime, setStartTime] = useState<string>(initialStartTime);
  const [endTime, setEndTime] = useState<string>(
    endParam ?? getOneHourLaterTime(initialStartTime, timeOptions)
  );
  const [isAllDay, setIsAllDay] = useState<boolean>(!startParam && !endParam);

  const [purposeSlug, setPurposeSlug] = useState<string>(purposeParam ?? "date");

  const [indoor, setIndoor] = useState<IndoorState>(() => {
    // URLは 1/0 に寄せる
    if (indoorParam === "1") return "indoor";
    if (indoorParam === "0") return "outdoor";
    return "both";
  });

  // results
  const [spots, setSpots] = useState<Spot[]>([]);
  const [loading, setLoading] = useState(false);

  // modal (条件変更)
  const [showModal, setShowModal] = useState(false);

  // areaのトグル
  const toggleAreaSelection = (slug: string) => {
    setAreaSlugs((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  // 検索オプション（API用）
  const searchOptions = useMemo(() => {
    // テキスト検索
    if (queryParam) {
      return {
        query: queryParam,
        area: undefined as string[] | undefined,
        purpose: undefined as string | undefined,
        is_indoor: undefined as "1" | "0" | undefined, // テキスト検索では使わない
      };
    }

    // 日付検索（recommendedに寄せる）
    if (dateParam) {
      return {
        query: undefined,
        area: areaSlugs.length > 0 ? areaSlugs : undefined,
        purpose: purposeSlug,
        is_indoor:
          indoor === "both" ? undefined : (indoor === "indoor" ? "1" : "0"),
      };
    }

    // エリア検索（通常search）
    return {
      query: undefined,
      area: areaSlugs.length > 0 ? areaSlugs : undefined,
      purpose: purposeSlug,
      is_indoor:
        indoor === "both" ? undefined : (indoor === "indoor" ? "1" : "0"),
    };
  }, [queryParam, dateParam, areaSlugs, purposeSlug, indoor]);

  // fetch results
  useEffect(() => {
    const fetchSpots = async () => {
      setLoading(true);

      try {
        // --- 日付検索: 天気予報 → recommended ---
        if (dateParam) {
          // areas がロードされてないと lat/lon が取れない
          if (!areaTagsLoaded) return;

          const targetTime = isAllDay ? "12:00" : (startTime || "12:00");
          const primaryArea = areaSlugs[0] ?? "meieki";

          const areaMeta = areaTagsState.find((a) => a.slug === primaryArea);
          if (!areaMeta) throw new Error("area not found");

          // Next API: weather/forecast はフロント側（同一オリジン）でOK
          const wxRes = await fetch(
            `/api/weather/forecast?lat=${areaMeta.lat}&lon=${areaMeta.lon}&date=${date}&time=${targetTime}`,
            { cache: "no-store" }
          );
          if (!wxRes.ok) throw new Error("forecast failed");
          const wx = await wxRes.json();

          const recRes = await apiClient.get("/api/spots/recommended", {
            params: {
              temp: wx.temp,
              pop: wx.pop,
              wind: wx.wind,
              humidity: wx.humidity,
              limit: 20,
              purpose: purposeSlug,
              // 複数エリア
              "area[]": areaSlugs,
              ...(searchOptions.is_indoor ? { is_indoor: searchOptions.is_indoor } : {}),
            },
          });

          const items = Array.isArray(recRes.data?.data) ? recRes.data.data : [];

          setSpots(
            items.map((spot: any) => ({
              id: spot.id,
              name: spot.name,
              image_url: spot.image_url ?? spot.imageUrl ?? "",
              area: typeof spot.area === "string" ? spot.area : spot.area?.slug ?? "",
              areaName:
                areaTagsState.find((a) => a.slug === (typeof spot.area === "string" ? spot.area : spot.area?.slug))
                  ?.label ??
                spot.areaName ??
                (typeof spot.area === "string"
                  ? spot.area
                  : spot.area?.label ?? spot.area?.name ?? spot.area?.slug ?? ""),
              description: spot.description ?? "",
              tags: Array.isArray(spot.tags)
                ? spot.tags.map((t: any) => t.label ?? t.name ?? t.slug ?? t).filter(Boolean)
                : [],
              // is_favorite は Spot 型に無いかもだけど SpotCard に渡すため残す
              ...(typeof spot.is_favorite !== "undefined" ? { is_favorite: spot.is_favorite } : {}),
            })) as any
          );

          return;
        }

        // --- 通常検索: /spots/search ---
        const res = await apiClient.get("/api/spots/search", {
          params: {
            ...(searchOptions.query ? { query: searchOptions.query } : {}),
            ...(searchOptions.purpose ? { purpose: searchOptions.purpose } : {}),
            ...(searchOptions.area ? { "area[]": searchOptions.area } : {}),
            ...(searchOptions.is_indoor ? { is_indoor: searchOptions.is_indoor } : {}),
          },
        });

        const items = Array.isArray(res.data?.data)
          ? res.data.data
          : Array.isArray(res.data)
            ? res.data
            : [];

        const normalized: Spot[] = items.map((spot: any) => ({
          id: spot.id,
          name: spot.name,
          image_url: spot.image_url ?? spot.imageUrl ?? "",
          area: typeof spot.area === "string" ? spot.area : spot.area?.slug ?? "",
          areaName:
            areaTagsState.find(
              (a) => a.slug === (typeof spot.area === "string" ? spot.area : spot.area?.slug)
            )?.label ??
            spot.areaName ??
            (typeof spot.area === "string"
              ? spot.area
              : spot.area?.label ?? spot.area?.name ?? spot.area?.slug ?? ""),
          description: spot.description ?? "",
          tags: Array.isArray(spot.tags)
            ? spot.tags.map((t: any) => t.label ?? t.name ?? t.slug ?? t).filter(Boolean)
            : [],
          ...(typeof spot.is_favorite !== "undefined" ? { is_favorite: spot.is_favorite } : {}),
        })) as any;

        setSpots(normalized);
      } catch (e) {
        console.error("fetchSpots error", e);
        setSpots([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSpots();
  }, [
    // 日付検索の再計算
    dateParam,
    date,
    startTime,
    endTime,
    isAllDay,
    // 共通
    searchOptions,
    areaSlugs,
    purposeSlug,
    indoor,
    // areas
    areaTagsLoaded,
    areaTagsState,
  ]);

  return (
    <>
      <div className="relative bg-back min-h-screen pb-18 pt-5">
        {/* ヘッダー */}
        <div className="relative py-3">
          <button
            onClick={() => router.push("/search")}
            className="absolute top-1/2 left-5 -translate-y-1/2"
          >
            <ArrowLeft size={28} />
          </button>
          <h2 className="text-base font-medium text-center">場所一覧</h2>
        </div>

        {/* ラベルエリア */}
        <div className="flex items-center justify-between h-14 bg-[#FFFEF7] px-5 border-y border-holder">
          <div className="flex items-center gap-3">
            <p className="text-base">
              {spots.length}
              <span className="text-xs">件</span>
            </p>

            <div className="flex flex-col gap-1 ml-3 text-sm">
              {(() => {
                if (queryParam) {
                  return <p>{queryParam}</p>;
                }

                if (dateParam) {
                  const dateLabel = `${new Date(date).getMonth() + 1}/${new Date(date).getDate()}`;
                  const hasTime = !isAllDay && (startTime || endTime);
                  const timeLabel = hasTime ? `${startTime ?? ""} ~ ${endTime ?? ""}` : "";
                  const firstLine = [dateLabel, timeLabel].filter(Boolean).join(" ");

                  const purposeLabel =
                    purposeTags.find((tag) => tag.slug === purposeSlug)?.label ?? purposeSlug;
                  const indoorLabel = indoor !== "both" ? (indoor === "indoor" ? "屋内" : "屋外") : "";
                  const secondLine = [purposeLabel, indoorLabel].filter(Boolean).join(" / ");

                  return (
                    <>
                      <p>{firstLine}</p>
                      {secondLine && <p>{secondLine}</p>}
                    </>
                  );
                }

                // エリア検索
                const areaLabels =
                  areaSlugs.length > 0
                    ? areaSlugs
                        .map((slug) => areaTagsState.find((tag) => tag.slug === slug)?.label ?? slug)
                        .join(" ")
                    : "";

                const purposeLabel =
                  purposeTags.find((tag) => tag.slug === purposeSlug)?.label ?? purposeSlug;

                const indoorLabel = indoor !== "both" ? (indoor === "indoor" ? "屋内" : "屋外") : "";
                const secondLine = [purposeLabel, indoorLabel].filter(Boolean).join(" / ");

                return (
                  <>
                    {areaLabels && <p>{areaLabels}</p>}
                    {secondLine && <p>{secondLine}</p>}
                  </>
                );
              })()}
            </div>
          </div>

          {!queryParam && (
            <button
              onClick={() => setShowModal(true)}
              className="px-3 py-2 text-sm font-medium text-sub border border-sub rounded-full"
            >
              条件変更
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 p-5">
          {loading && <p className="col-span-2">読み込み中...</p>}

          {!loading && spots.length === 0 && (
            <p className="col-span-2 text-center text-sm">
              条件に一致するスポットが見つかりませんでした
            </p>
          )}

          {!loading &&
            spots.map((spot) => (
              <SpotCard
                key={spot.id}
                spot={spot}
                initialIsFavorite={Boolean((spot as any).is_favorite)}
              />
            ))}
        </div>
      </div>

      <NavigationBar />

      {showModal && (
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
          <div className="px-9 pt-4 pb-8">
            <button onClick={() => setShowModal(false)} className="flex ml-auto">
              <X size={28} />
            </button>

            {dateParam ? (
              <>
                <DateTimeFilter
                  dateOptions={dateOptions}
                  timeOptions={timeOptions}
                  date={date}
                  setDate={setDate}
                  startTime={startTime}
                  setStartTime={setStartTime}
                  endTime={endTime}
                  setEndTime={setEndTime}
                  isAllDay={isAllDay}
                  setIsAllDay={setIsAllDay}
                />
                <PurposeFilter
                  purposeTags={purposeTags}
                  purposeSlug={purposeSlug}
                  setPurposeSlug={setPurposeSlug}
                  indoor={indoor}
                  setIndoor={setIndoor}
                />
              </>
            ) : (
              <>
                <AreaFilter
                  areaTags={areaTagsState}
                  areaSlugs={areaSlugs}
                  toggleAreaSelection={toggleAreaSelection}
                />
                <PurposeFilter
                  purposeTags={purposeTags}
                  purposeSlug={purposeSlug}
                  setPurposeSlug={setPurposeSlug}
                  indoor={indoor}
                  setIndoor={setIndoor}
                />
              </>
            )}
          </div>
        </Modal>
      )}
    </>
  );
}
