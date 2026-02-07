"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { areaTags } from "../search/data";
import dynamic from "next/dynamic";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { NavigationBar } from "@/components/navigation-bar";
import Modal from "@/components/Modal";
import type { Spot } from "@/types/spot";
import { SpotCardModal } from "@/components/spot-card/SpotCardModal";
import { SpotCardContainer } from "@/components/spot-card/SpotCardContainer";
import { apiClient } from "@/api/apiClient";

interface Location {
  id: number;
  name: string;
  slug: string;
  is_indoor: boolean;
  lat: string;
  lon: string;
  area: string;
  areaName?: string;
  thumbnailUrl?: string;
  imageUrls?: string[];
  detail?: string;
  description?: string;
  tags?: string[];
  is_favorite?: boolean;
  weather_ok: boolean;
  weatherSuitability: string[];
  highlights: string[];
}

interface InitialMapState {
  lat: number;
  lon: number;
  spotId: number | null;
}

const DEFAULT_LAT = 35.1709;
const DEFAULT_LON = 136.8815;

const MapComponent = dynamic(() => import("@/components/Map"), {
  ssr: false,
});

function locationToSpot(location: Location): Spot {
  return {
    ...location,
    lat: Number(location.lat),
    lon: Number(location.lon),
  } as Spot;
}

export default function Page() {
  const searchParams = useSearchParams();

  const [spots, setSpots] = useState<Location[]>([]);

  // 入力中（確定前）
  const [inputValue, setInputValue] = useState("");

  // 確定した検索ワード（Enterで更新 → APIはこれだけ見て走る）
  const [searchQuery, setSearchQuery] = useState("");

  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [indoorFilter, setIndoorFilter] = useState<boolean | null>(null);

  const [selectedSpotId, setSelectedSpotId] = useState<number | null>(null);
  const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null);

  const [modalTitle, setModalTitle] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [initialMapState, setInitialMapState] =
    useState<InitialMapState | null>(null);

  // 初期位置
  useEffect(() => {
    const fallbackLat = 35.1815;
    const fallbackLon = 136.9066;

    const urlLat = searchParams.get("lat");
    const urlLon = searchParams.get("lon");
    const urlSpotId = searchParams.get("spotId");

    if (urlLat && urlLon) {
      const spotId = urlSpotId ? parseInt(urlSpotId) : null;
      setInitialMapState({
        lat: parseFloat(urlLat),
        lon: parseFloat(urlLon),
        spotId,
      });
      if (spotId) {
        handleSpotSelect(spotId);
      }
      return;
    }

    const savedSlug = localStorage.getItem("selectedAreaSlug");
    if (savedSlug) {
      const area = areaTags.find((a) => a.slug === savedSlug);
      if (area) {
        setInitialMapState({
          lat: area.lat,
          lon: area.lon,
          spotId: null,
        });
        return;
      }
    }

    setInitialMapState({
      lat: fallbackLat ?? DEFAULT_LAT,
      lon: fallbackLon ?? DEFAULT_LON,
      spotId: null,
    });
  }, [searchParams]);

  // 検索（Enterで searchQuery が変わった時だけ）
  useEffect(() => {
    const fetchSpots = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (searchQuery) params.append("query", searchQuery);
        if (indoorFilter !== null) {
          params.append("is_indoor", indoorFilter ? "1" : "0");
        }

        const res = await apiClient.get("/spots/search", { params });
        const list: Location[] = res.data.data ?? [];

        setSpots(
          list.map((s) => ({
            ...s,
            areaName: areaTags.find((a) => a.slug === s.area)?.label ?? s.area,
          }))
        );
      } catch (error) {
        console.log(error);
        setSpots([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSpots();
  }, [searchQuery, indoorFilter]);

  useEffect(() => {
    if (!searchQuery || searchQuery.trim() === "") {
      setIsModalOpen(false);
    }
  }, [searchQuery]);

  const handleFilterToggle = (isIndoor: boolean) => {
    setIsModalOpen(true);
    setModalTitle(isIndoor ? "屋内" : "屋外");

    if (indoorFilter === isIndoor) setIndoorFilter(null);
    else setIndoorFilter(isIndoor);

    setIsFilterOpen(false);
  };

  const handleSpotSelect = async (spotId: number) => {
    setIsModalOpen(true);
    setSelectedSpotId(spotId);

    const res = await apiClient.get(`/spot/${spotId}`);
    const apiSpot = res.data.data;

    const areaName =
      areaTags.find((a) => a.slug === apiSpot.area)?.label ?? apiSpot.area;

    setSelectedSpot({
      ...apiSpot,
      lat: Number(apiSpot.lat),
      lon: Number(apiSpot.lon),
      areaName,
      imageUrls: apiSpot.imageUrls ?? [],
      tags: Array.isArray(apiSpot.tags)
        ? apiSpot.tags.map((t: any) => (typeof t === "string" ? t : t?.name))
        : [],
    });

    setModalTitle(apiSpot.name);
  };

  if (!initialMapState) {
    return null;
  }

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSpotId(null);
    setSelectedSpot(null);
  };

  if (!initialMapState) return null;

  const modalSpots =
    selectedSpotId !== null
      ? spots.filter((s) => s.id === selectedSpotId)
      : spots;

  return (
    <div className="relative h-[100dvh] overflow-hidden">
      {/* map は最背面で全画面 */}
      <div className="absolute inset-0">
        <MapComponent
          spots={spots}
          selectedSpotId={selectedSpotId}
          onSpotSelect={handleSpotSelect}
          initialLat={initialMapState.lat}
          initialLon={initialMapState.lon}
        />
      </div>

      <div className="fixed top-5 left-0 flex items-center gap-4 w-full h-12 px-5 z-10">
        <div className="relative w-full">
          <input
            type="text"
            value={inputValue} // ★ここが超重要：inputValueにする
            onChange={(e) => {
              setInputValue(e.target.value);
              // 入力中はタイトルもモーダルも触らない
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                const q = (e.currentTarget.value || "").trim();
                setSearchQuery(q);
                setModalTitle(q || "検索"); // 入力確定した文字をタイトルに
                setIsModalOpen(!!q); // ここで初めてモーダルを開く
              }
            }}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
            className={`w-full bg-white rounded-[12px] font-medium transition-all 
              outline-none border border-holder focus-visible:border-sub focus-visible:ring-2 focus-visible:ring-sub/30
              ${isInputFocused ? "px-4 py-3" : "py-3 pl-13 pr-3"
            }`}
            placeholder="検索"
          />

          {!isInputFocused && (
            <Search
              size={24}
              className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400"
            />
          )}

          {isLoading && (
            <div className="absolute top-1/2 right-4 -translate-y-1/2">
              <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
            </div>
          )}
        </div>

        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="flex items-center justify-center w-12 h-12 bg-white rounded-[12px] shrink-0"
        >
          <SlidersHorizontal size={28} />
        </button>

        <div
          className={`absolute top-[calc(100%+8px)] right-5 flex flex-col gap-1 bg-white p-3 border border-fg rounded-[12px] transition-all duration-200 ${
            isFilterOpen
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 -translate-y-2 pointer-events-none"
          }`}
        >
          <p className="font-medium mb-1">絞り込み</p>

          <button
            onClick={() => handleFilterToggle(false)}
            className={`flex items-center gap-2 py-1 px-2 border rounded-[12px] transition-colors ${
              indoorFilter === false ? "border border-sub" : "border-fg"
            }`}
          >
            <img src="/images/map-pin-1.svg" alt="" className="w-8 h-8" />
            <p>屋外</p>
          </button>

          <button
            onClick={() => handleFilterToggle(true)}
            className={`flex items-center gap-2 py-1 px-2 border rounded-[12px] transition-colors ${
              indoorFilter === true ? "border border-sub" : "border-fg"
            }`}
          >
            <img src="/images/map-pin-2.svg" alt="" className="w-8 h-8" />
            <p>屋内</p>
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-9 pointer-events-none">
          <div className="pointer-events-auto">
            <Modal isOpen onClose={handleCloseModal} showOverlay={false}>
              <div className="pb-[80px] max-h-[90vh] flex flex-col">
                <div className="max-h-[80vh] flex flex-col">
                  <div className="shrink-0 relative">
                    <button
                      onClick={handleCloseModal}
                      className="absolute top-4 right-4 z-10"
                    >
                      <X size={28} />
                    </button>
                    <p className="text-2xl my-4 mx-6">{modalTitle}</p>
                  </div>
                </div>

                <div className="overflow-y-auto px-6 pb-6">
                  <div className="grid gap-6">
                    {modalSpots.map((location) => {
                      const spot = locationToSpot(location);
                      return (
                        <SpotCardContainer
                          key={spot.id}
                          spot={spot}
                          initialIsFavorite={true}
                        >
                          {({ spot, isFavorite, toggleFavorite }) => (
                            <SpotCardModal
                              spot={spot}
                              isFavorite={isFavorite}
                              toggleFavorite={toggleFavorite}
                            />
                          )}
                        </SpotCardContainer>
                      );
                    })}
                  </div>
                </div>
              </div>
            </Modal>
          </div>
        </div>
      )}

      <div className="fixed inset-x-0 bottom-0 z-20">
        <NavigationBar />
      </div>
    </div>
  );
}
