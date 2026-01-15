"use client";

import { useEffect, useState } from "react";
import { SpotCard } from "@/components/spot-card";
import { dummySpots } from "@/data/dummySpots";
import { NavigationBar } from "@/components/navigation-bar";

export default function Page() {
  const [spots, setSpots] = useState(dummySpots);

  return (
    <div className="bg-back min-h-screen pt-10 pb-20 [&>*]:text-fg ">
      <p className="text-center text-lg font-semibold mb-6 pb-2 shadow-[0px_2px_3px_rgba(0,0,0,0.20)]">
        お気に入り一覧
      </p>
      <div className="mx-4">
        <div className="flex justify-center ">
          <div className="grid grid-cols-2 gap-2">
            {spots.map((spot) => (
              <SpotCard key={spot.id} spot={spot} />
            ))}
          </div>
        </div>
      </div>
      <NavigationBar />
    </div>
  );
}
