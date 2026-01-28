"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { areaTags } from "../search/data";
import dynamic from "next/dynamic";
import { Search, SlidersHorizontal } from "lucide-react";
import { NavigationBar } from "@/components/navigation-bar";
import Modal from "@/components/Modal";
import { X } from "lucide-react";
import type { Spot } from "@/types/spot";
import { SpotCardModal } from "@/components/spot-card/SpotCardModal";
import { SpotCardContainer } from "@/components/spot-card/SpotCardContainer";

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
  };
}

export default function Page() {
  const searchParams = useSearchParams();
  const [spots, setSpots] = useState<Location[]>([]);

  const [isInputFocused, setIsInputFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [indoorFilter, setIndoorFilter] = useState<boolean | null>(null);
  const [selectedSpotId, setSelectedSpotId] = useState<number | null>(null); // ピンを押すとspotIdを状態として保持します
  const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null);
  const [initialMapState, setInitialMapState] =
    useState<InitialMapState | null>(null);

  useEffect(() => {
    const DEFAULT_LAT = 35.1815;
    const DEFAULT_LON = 136.9066;

    // 1. URLパラメータから取得を試みる
    const urlLat = searchParams.get("lat");
    const urlLon = searchParams.get("lon");
    const urlSpotId = searchParams.get("spotId");

    if (urlLat && urlLon) {
      const spotId = urlSpotId ? parseInt(urlSpotId) : null;
      setInitialMapState({
        lat: parseFloat(urlLat),
        lon: parseFloat(urlLon),
        spotId: urlSpotId ? parseInt(urlSpotId) : null,
      });
      if (spotId) {
        handleSpotSelect(spotId); // ← ★ これが重要
      }
      return;
    }

    // 2. localStorageから selectedAreaSlug を取得
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

    // 3. どちらも存在しない場合はデフォルト値
    setInitialMapState({
      lat: DEFAULT_LAT,
      lon: DEFAULT_LON,
      spotId: null,
    });
  }, [searchParams]);

  useEffect(() => {
    const fetchSpots = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (searchQuery) {
          params.append("query", searchQuery);
        }
        if (indoorFilter !== null) {
          params.append("is_indoor", indoorFilter ? "1" : "0");
        }

        const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/spots/search${
          params.toString() ? "?" + params.toString() : ""
        }`;

        const res = await fetch(url);
        const data = await res.json();
        setSpots(data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchSpots();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, indoorFilter]);

  const handleFilterToggle = (isIndoor: boolean) => {
    if (indoorFilter === isIndoor) {
      setIndoorFilter(null);
    } else {
      setIndoorFilter(isIndoor);
    }
  };
  const handleSpotSelect = async (spotId: number) => {
    setSelectedSpotId(spotId);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/spot/${spotId}`
    );
    const json = await res.json();
    const apiSpot = json.data ?? json;

    const areaName =
      areaTags.find((a) => a.slug === apiSpot.area)?.label ?? apiSpot.area;

      setSelectedSpot({
        ...apiSpot, 
        lat: Number(apiSpot.lat),
        lon: Number(apiSpot.lon),
        areaName, 
        imageUrls: apiSpot.imageUrls ?? [],
        tags: Array.isArray(apiSpot.tags)
          ? apiSpot.tags.map((t:any) => 
            typeof t === "string" ? t: t?.name
          )
          : [],
      });
  };
  useEffect(() => {
    console.log("selectedSpot:", selectedSpot);
  }, [selectedSpot]);

  if (!initialMapState) {
    return null;
  }

  const handleCloseModal = () => {
    setSelectedSpotId(null);
    setSelectedSpot(null);
  };

  const modalSpots =
    selectedSpotId !== null
      ? spots.filter(
          (location) => locationToSpot(location).id === selectedSpotId
        )
      : spots;

  return (
    <>
      <div className="fixed top-5 left-0 flex items-center gap-4 w-full h-12 px-5 z-10">
        <div className="relative w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
            className={`w-full bg-white rounded-[12px] font-medium transition-all ${
              isInputFocused ? "px-4 py-3" : "py-3 pl-13 pr-3"
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
              indoorFilter === false
                ? "border-blue-500 bg-blue-50"
                : "border-fg"
            }`}
          >
            <img src="/images/map-pin-1.svg" alt="" className="w-8 h-8" />
            <p>屋外</p>
          </button>
          <button
            onClick={() => handleFilterToggle(true)}
            className={`flex items-center gap-2 py-1 px-2 border rounded-[12px] transition-colors ${
              indoorFilter === true ? "border-blue-500 bg-blue-50" : "border-fg"
            }`}
          >
            <img src="/images/map-pin-2.svg" alt="" className="w-8 h-8" />
            <p>屋内</p>
          </button>
        </div>
      </div>
      <MapComponent
        spots={spots}
        selectedSpotId={selectedSpotId}
        onSpotSelect={handleSpotSelect}
        initialLat={initialMapState.lat}
        initialLon={initialMapState.lon}
      />

      {selectedSpot && (
        <div className="fixed inset-0 z-9 pointer-events-none">
          <div className="pointer-events-auto">
            <Modal isOpen onClose={handleCloseModal} showOverlay={false}>
              <div className="pb-[80px]">
                <div className="max-h-[80vh] flex flex-col">
                  <div className="shrink-0 relative">
                    <button
                      onClick={handleCloseModal}
                      className="absolute top-4 right-4 z-10"
                    >
                      <X size={28} />
                    </button>
                    <p className="text-2xl my-4 mx-6">{selectedSpot?.name}</p>
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

      <NavigationBar />
    </>
  );
}
