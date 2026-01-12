"use client";

import { HeartIcon } from "./icon/heart-icon";
import { Spot } from "@/types/spot";
import { areaLabelMap } from "@/types/area";

type Props = {
  spot: Spot;
};

export function SpotCard({ spot }: Props) {
  return (
    <div className="bg-card-back rounded-lg p-2 shadow-[0_0_6px_0_rgba(0,0,0,0.3)]">
      <img src={spot.thumbnailUrl} alt={spot.name} className="rounded-md" />
      <div className="p-2">
        <div className="min-h-[68px]">
          <p className="font-semibold text-base mt-1 line-clamp-2">
            {spot.name}
          </p>
          <p className="text-sm">{spot.area}</p>
        </div>
        <p className="text-sm mt-1 line-clamp-3">{spot.description}</p>
      </div>
      <div className="grid grid-cols-[5fr_1fr]">
        <div className="flex flex-wrap gap-1 mt-1">
          {spot.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs py-1 px-2  rounded-full bg-card-tag border border-[0.5px]"
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
            className="w-5 h-5 hover:opacity-30" //   likeIds.includes(furniture.id) && "text-error", //   {clsx(
            // )}
          />
        </button>
      </div>
    </div>
  );
}
