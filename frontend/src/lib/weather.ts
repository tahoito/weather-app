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

export async function fetchForecastByLatLon(
    lat: string,
    lon: string,
): Promise<ForecastResponse>{
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

    const forecastsRaw = wxdata?.forecasts;
    if (!Array.isArray(forecastsRaw)) {
        throw new Error("Forecast data is missing(forecasts)");

    }

    return { forecasts: forecastsRaw };
}