export type WeatherInfo = {
  precipitation: number;
  humidity: number;
  windSpeed: number;
  temperature: number;
  weatherCode: number;
};


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

  if (!res.ok) {
    throw new Error(`API request failed with status ${res.status}`);
  }

  const data: any = await res.json();

  const wxdata = data.wxdata?.[0];
  const current = wxdata?.srf?.[0];
  console.log("current:", current);

  if (!current) {
    throw new Error("Weather data is missing");
  }

  return {
    precipitation: current.prec,
    humidity: current.rhum,
    windSpeed: current.wndspd,
    temperature: current.temp,
    weatherCode: current.wx ?? 0,
  };
}


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
}

export async function fetchForecastByLatLon(lat: string, lon: string): Promise<ForecastResponse> {
  const latNum = Number(lat);
  const lonNum = Number(lon);

  if (isNaN(latNum) || isNaN(lonNum)) {
    throw new Error("lat or lon is not a valid number");
  }

  const url = `https://wxtech.weathernews.com/api/v1/ss1wx?lat=${latNum}&lon=${lonNum}`;
  console.log("[forecast] request url =", url);

  const res = await fetch(url, {
    headers: { "X-API-Key": process.env.WEATHER_API_KEY! },
    cache: "no-store",
  });

  console.log("[forecast] status =", res.status, res.statusText);

  const text = await res.text();
  console.log("[forecast] raw body =", text.slice(0, 500));

  let data: any;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error("Weather API returned non-JSON");
  }

  const wx0 = data?.wxdata?.[0];
  const srf = wx0?.srf;

  console.log("[forecast] has wxdata[0].srf =", Array.isArray(srf), "len =", srf?.length);

  if (!Array.isArray(srf)) {
    console.log("[forecast] data snapshot =", data);
    throw new Error("Forecast data is missing(srf)");
  }

  const map = new Map<string, ForecastHour[]>();

  for (const item of srf) {
    const iso: string | undefined = item?.date;
    if (!iso) continue;

    const datePart = iso.slice(0, 10);
    const hourPart = iso.slice(11, 13);
    const time = `${hourPart}:00`;

    const hour: ForecastHour = {
      time,
      temp: Number(item?.temp ?? 0),
      pop: Number(item?.prec ?? 0),
      wind: Number(item?.wndspd ?? 0),
      humidity: Number(item?.rhum ?? 0),
    };

    const arr = map.get(datePart) ?? [];
    arr.push(hour);
    map.set(datePart, arr);
  }

  const forecasts: ForecastDay[] = [...map.entries()]
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([date, hourly]) => ({
      date,
      hourly: hourly.sort((a, b) => (a.time < b.time ? -1 : 1)),
    }));

  console.log("[forecast] built days =", forecasts.length, "first =", forecasts[0]);

  return { forecasts };
}
