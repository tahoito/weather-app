"use client";

import { useState } from "react";
import { Spot } from "@/types/spot";

type RenderProps = {
  spot: Spot;
  isFavorite: boolean;
  toggleFavorite: () => Promise<void>;
};

type Props = {
  spot: Spot;
  initialIsFavorite?: boolean;
  children: (props: RenderProps) => React.ReactNode;
};

export function SpotCardContainer({
  spot,
  initialIsFavorite = false,
  children,
}: Props) {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);

  const toggleFavorite = async () => {
    try {
      if (isFavorite) {
        const res = await fetch(`/api/favorites/${spot.id}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("DELETE failed");
        setIsFavorite(false);
      } else {
        const res = await fetch(`/api/favorites`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ spot_id: spot.id }),
        });
        if (!res.ok) throw new Error("POST failed");
        setIsFavorite(true);
      }
    } catch (e) {
      console.error("お気に入り切替失敗", e);
    }
  };

  return <>{children({ spot, isFavorite, toggleFavorite })}</>;
}
