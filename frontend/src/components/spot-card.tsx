"use client";

import { HeartIcon } from "./icon/heart-icon";
import { Spot } from "@/types/spot";

type Props = {
  spot: Spot;
};

export function SpotCard({ spot }: Props) {
  return (
    <div className="bg-card-back rounded-lg p-2 shadow-[0_0_10px_0_rgba(0,0,0,0.3)]">
      <img src={spot.imageUrl} alt={spot.name} className="rounded-md" />

      <div className="p-2">
        <p className="font-medium text-sm mt-1">{spot.name}</p>
        <p className="text-xs ">{spot.area}</p>
        <p className="text-xs mt-1 line-clamp-3">{spot.description}</p>
      </div>
      <div className="grid grid-cols-[5fr_1fr]">
        <div className="flex flex-wrap gap-1 mt-1">
          {spot.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] px-2  rounded-full bg-card-tag border border-[0.5px]"
            >
              {tag}
            </span>
          ))}
        </div>

        <button
          onClick={() => {
            // if (likeIds.includes(furniture.id)) {
            //   likeDestroyApi(furniture.id);
            // } else {
            //   likeStoreApi(furniture.id);
            // }
          }}
        >
          <HeartIcon
            className="w-4 h-4 hover:opacity-30" //   likeIds.includes(furniture.id) && "text-error", //   {clsx(
            // )}
          />
        </button>
      </div>
    </div>
  );
}
