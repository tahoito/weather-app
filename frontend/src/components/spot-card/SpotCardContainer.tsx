"use client";

import { useEffect, useState, useCallback } from "react";
import type { Spot } from "@/types/spot";
import { apiClient } from "@/api/apiClient";

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
  const [isFavorite, setIsFavorite] = useState<boolean>(!!initialIsFavorite);
  const [isToggling, setIsToggling] = useState(false);

  // 親から渡される初期値が変わった時も同期（検索結果更新など）
  useEffect(() => {
    setIsFavorite(!!initialIsFavorite);
  }, [initialIsFavorite]);

  const toggleFavorite = useCallback(async () => {
    if (isToggling) return;

    // token無いならここで止める（401/502連打防止）
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      alert("ログインが必要です");
      return;
    }

    // 楽観的更新：押した瞬間に色変える
    const next = !isFavorite;
    setIsFavorite(next);
    setIsToggling(true);

    try {
      if (next) {
        // お気に入り追加
        await apiClient.post("/api/favorites", { spot_id: spot.id });
      } else {
        // お気に入り削除
        await apiClient.delete(`/api/favorites/${spot.id}`);
      }
    } catch (e: any) {
      // 失敗したら元に戻す
      setIsFavorite(!next);

      const status = e?.response?.status;
      console.error("お気に入り切替失敗", status, e?.response?.data, e);

      if (status === 401) {
        alert("認証が切れてるかログインが必要です");
      } else {
        alert("お気に入りの更新に失敗しました");
      }
    } finally {
      setIsToggling(false);
    }
  }, [isFavorite, isToggling, spot.id]);

  return <>{children({ spot, isFavorite, toggleFavorite })}</>;
}
