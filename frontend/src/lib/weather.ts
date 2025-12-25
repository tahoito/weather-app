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

  let res: Response;
  try {
    res = await fetch(url, {
      headers: { "X-API-Key": process.env.WEATHER_API_KEY! },
    });
  } catch (err) {
    throw new Error("Failed to fetch weather API: " + String(err));
  }

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`API request failed with status ${res.status}`);
  }

  let data: any;
  try {
    data = await res.json();
  } catch (err) {
    throw new Error("Failed to parse API response JSON");
  }

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
