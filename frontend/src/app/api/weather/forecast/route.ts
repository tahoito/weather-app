import { NextResponse } from "next/server";
import { fetchForecastByLatLon } from "@/lib/weather";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");
  const date = searchParams.get("date");
  const time = searchParams.get("time");

  if (!lat || !lon || !date) {
    return NextResponse.json({ error: "missing params" }, { status: 400 });
  }

  const targetHour = time ? Number(time.split(":")[0]) : 12;

  const forecast = await fetchForecastByLatLon(lat, lon);

  const day = forecast.forecasts.find(f => f.date === date);
  if (!day) {
    return NextResponse.json({ error: "no forecast for date" }, { status: 404 });
  }

  const selected = day.hourly.reduce((prev, curr) => {
    const prevDiff = Math.abs(Number(prev.time.slice(0, 2)) - targetHour);
    const currDiff = Math.abs(Number(curr.time.slice(0, 2)) - targetHour);
    return currDiff < prevDiff ? curr : prev;
  });

  return NextResponse.json({
    date: day.date,
    time: selected.time,
    temp: selected.temp, 
    pop: selected.pop, 
    wind: selected.wind, 
    humidity: selected.humidity, 
  });
}
