import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const area = searchParams.get("area") ?? "";
  const limit = searchParams.get("limit") ?? "4";

  const backend = process.env.BACKEND_URL ?? "http://127.0.0.1:8000";

  const url = `${backend}/api/spots/recommended?area=${encodeURIComponent(area)}&limit=${encodeURIComponent(limit)}`;

  const res = await fetch(url, { cache: "no-store" });


  const text = await res.text();
  return new NextResponse(text, {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
}
