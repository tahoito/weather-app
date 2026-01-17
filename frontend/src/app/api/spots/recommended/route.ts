import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const area = searchParams.get("area");

    if (!area) {
      return NextResponse.json(
        { error: "area is required" },
        { status: 400 }
      );
    }
    const base = process.env.NEXT_PUBLIC_API_BASE_URL;

    if (!base) {
      console.error("NEXT_PUBLIC_API_BASE_URL is missing");
      return NextResponse.json(
        { error: "server env missing: NEXT_PUBLIC_API_BASE_URL" },
        { status: 500 }
      );
    }

    const url = `${base}/api/spots/recommended?area=${encodeURIComponent(area)}`;
    const res = await fetch(url, { cache: "no-store" });

    if (!res.ok) {
      const text = await res.text();
      console.error("Laravel recommended error:", res.status, text);
      return NextResponse.json(
        { error: "upstream error", status: res.status, detail: text },
        { status: 502 } 
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (e) {
    console.error("recommended route error:", e);
    return NextResponse.json({ error: "internal error" }, { status: 500 });
  }
}
