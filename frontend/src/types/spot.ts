import { SunIcon } from "@/components/icon/sun-icon";
import { CloudIcon } from "@/components/icon/cloud-icon";
import { CloudRainIcon } from "@/components/icon/cloud-rain-icon";
import { CloudSnowIcon } from "@/components/icon/cloud-snow-icon";
import { CloudHeilIcon } from "@/components/icon/cloud-hail-icon";
import { FlameIcon } from "@/components/icon/flame-icon";
import { CloudDrizzleIcon } from "@/components/icon/cloud-drizzle-icon";
import { CloudRainWindIcon } from "@/components/icon/cloud-rain-wind-icon";
import { SnowflakeIcon } from "@/components/icon/snowflake-icon";

export const weatherCodeMap: Record<
  number,
  { label: string; Icon: React.ComponentType<{ className?: string }> }
> = {
  100: { label: "晴れ", Icon: SunIcon },
  200: { label: "くもり", Icon: CloudIcon },
  300: { label: "雨", Icon: CloudRainIcon },
  400: { label: "雪", Icon: CloudSnowIcon },
  430: { label: "みぞれ", Icon: CloudHeilIcon },
  500: { label: "快晴", Icon: SunIcon },
  550: { label: "猛暑", Icon: FlameIcon },
  600: { label: "うすぐもり", Icon: SunIcon },
  650: { label: "小雨", Icon: CloudDrizzleIcon },
  850: { label: "大雨・嵐", Icon: CloudRainWindIcon },
  950: { label: "大雪", Icon: SnowflakeIcon },
};

export type Spot = {
  id: number;
  name: string;
  area: string;
  areaName?: string;
  image_url?: string;
  description?: string;
  tags?: string[];
  is_favorite?: boolean;
};