export type WeatherInfo = {
  precipitation: number; 
  humidity: number;
  windSpeed: number;
  temperature: number;
  weatherCode: number;
};

export type ForecastHour = {
  time: string;   
  temp: number;
  pop: number;    
  wind: number;
  humidity: number;
};

export type ForecastDay = {
  date: string; 
  hourly: ForecastHour[];
};

export type ForecastResponse = {
  forecasts: ForecastDay[];
};

const toNum = (v: any, fallback = 0) => {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : fallback;
};

const toPercent0to100 = (v: any) => {
  const n = toNum(v, 0);
  if (n > 0 && n <= 1) return Math.round(n * 100);
  if (n >= 0 && n <= 100) return Math.round(n);
  return 0;
};

export async function fetchForecastByLatLon(
  lat: string,
  lon: string
): Promise<ForecastResponse> {
  const latNum = Number(lat);
  const lonNum = Number(lon);

  if (isNaN(latNum) || isNaN(lonNum)) {
    throw new Error("lat or lon is not a valid number");
  }

  const url = `https://wxtech.weathernews.com/api/v1/ss1wx?lat=${latNum}&lon=${lonNum}`;

  const res = await fetch(url, {
    headers: { "X-API-Key": process.env.WEATHER_API_KEY! },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`API request failed with status ${res.status}`);
  }

  
  const data: any = await res.json();

  const wx0 = data?.wxdata?.[0];
  const srf = wx0?.srf; 
  const mrf = wx0?.mrf; 

  const map = new Map<string, ForecastHour[]>();

  if (Array.isArray(srf)) {
    for (const item of srf) {
      const iso: string | undefined = item?.date;
      if (!iso) continue;

      const datePart = iso.slice(0, 10);
      const hourPart = iso.slice(11, 13);
      const time = `${hourPart}:00`;

      const popCandidate =
        item?.pop ?? item?.precprob ?? item?.precip_prob ?? item?.prec ?? 0;

      const hour: ForecastHour = {
        time,
        temp: toNum(item?.temp, 0),
        pop: toPercent0to100(popCandidate),
        wind: toNum(item?.wndspd, 0),
        humidity: toNum(item?.rhum, 0),
      };

      const arr = map.get(datePart) ?? [];
      arr.push(hour);
      map.set(datePart, arr);
    }
  }

  let forecasts: ForecastDay[] = [...map.entries()]
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([date, hourly]) => ({
      date,
      hourly: hourly.sort((a, b) => (a.time < b.time ? -1 : 1)),
    }));

  if (Array.isArray(mrf)) {
    for (const d of mrf) {
      const iso: string | undefined = d?.date;
      if (!iso) continue;

      const datePart = iso.slice(0, 10);
      if (forecasts.some((x) => x.date === datePart)) continue;

      forecasts.push({
        date: datePart,
        hourly: [
          {
            time: "12:00",
            temp: toNum(d?.maxtemp ?? d?.mintemp, 0),
            pop: toPercent0to100(d?.pop ?? 0),
            wind: 0,
            humidity: 0,
          },
        ],
      });
    }

    forecasts.sort((a, b) => (a.date < b.date ? -1 : 1));
  }

  return { forecasts };
}

export async function fetchWeatherByLatLon(
  lat: string,
  lon: string
): Promise<WeatherInfo> {
  const latNum = Number(lat);
  const lonNum = Number(lon);

  if (isNaN(latNum) || isNaN(lonNum)) {
    throw new Error("lat or lon is not a valid number");
  }

  const url = `https://wxtech.weathernews.com/api/v1/ss1wx?lat=${latNum}&lon=${lonNum}`;

  const res = await fetch(url, {
    headers: { "X-API-Key": process.env.WEATHER_API_KEY! },
    cache: "no-store",
  });

  if (!res.ok) throw new Error(`API request failed with status ${res.status}`);

  const data: any = await res.json();
  const wx0 = data?.wxdata?.[0];
  const current = wx0?.srf?.[0];

  if (!current) throw new Error("Weather data is missing");

  const todayPop = wx0?.mrf?.[0].pop;

  const popCandidate =
    current?.pop ??
    current?.precprob ??
    current?.precip_prob ??
    current?.prec ??
    0;

  return {
    precipitation: Number.isFinite(Number(todayPop)) ? Number(todayPop) : 0,
    humidity: current?.rhum,
    windSpeed: current?.wndspd,
    temperature: current?.temp,
    weatherCode: current?.wx,
  };
}
