"use client";

import { HeartIcon } from "@/components/icon/heart-icon";
import clsx from "clsx";

type Props = {
  isFavorite: boolean;
  onToggle: () => void;
  className?: string;
  iconClassName?: string;
};

export function FavoriteButton({
  isFavorite,
  onToggle,
  className,
  iconClassName,
}: Props) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggle();
      }}
      className={className}
    >
      <HeartIcon
        className={clsx(
          "transition-colors",
          isFavorite ? "text-favorite fill-favorite" : "text-fg stroke-[2]",
          iconClassName
        )}
      />
    </button>
  );
}
