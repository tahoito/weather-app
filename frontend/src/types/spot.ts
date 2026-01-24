import { SunnyIcon } from "@/components/icon/sunny-icon";
import { CloudIcon } from "@/components/icon/cloud-icon";
import { RainIcon } from "@/components/icon/rain-icon";
import { SnowIcon } from "@/components/icon/snow-icon";
import { CloudHeilIcon } from "@/components/icon/cloud-hail-icon";
import { SunIcon } from "@/components/icon/sun-icon";
import { HazeIcon } from "@/components/icon/haze-icon";
import { CloudDrizzleIcon } from "@/components/icon/cloud-drizzle-icon";
import { CloudRainWindIcon } from "@/components/icon/cloud-rain-wind-icon";
import { SnowflakeIcon } from "@/components/icon/snowflake-icon";

export const weatherCodeMap: Record<
  number,
  { label: string; Icon: React.ComponentType<{ className?: string }> }
> = {
  100: { label: "晴れ", Icon: SunnyIcon },
  200: { label: "くもり", Icon: CloudIcon },
  300: { label: "雨", Icon: RainIcon },
  400: { label: "雪", Icon: SnowIcon },
  430: { label: "みぞれ", Icon: CloudHeilIcon },
  500: { label: "快晴", Icon: SunIcon },
  550: { label: "猛暑", Icon: SunIcon },
  600: { label: "うすぐもり", Icon: HazeIcon },
  650: { label: "小雨", Icon: CloudDrizzleIcon },
  850: { label: "大雨・嵐", Icon: CloudRainWindIcon },
  950: { label: "大雪", Icon: SnowflakeIcon },
};

export type Spot = {
  id: number;
  name: string;
  area: string;
  areaName?: string;
  thumbnailUrl?: string;
  imageUrls?: string[];
  detail?: string;
  description?: string;
  tag?: string[];
  is_favorite?: boolean;
  weatherSuitability: string[];
  highlights: string[];
  price?: string;
  openingHours?: string;
};
