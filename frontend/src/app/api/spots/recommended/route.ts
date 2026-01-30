import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: Request) {
  try {
    // Nextがローカルで動いてるなら、api じゃなく localhost を使う
    const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

    const incomingUrl = new URL(req.url);
    const qs = incomingUrl.searchParams.toString();
    const url = `${base}/api/spots/recommended${qs ? `?${qs}` : ""}`;

    const res = await fetch(url, { cache: "no-store" });
    const text = await res.text();

    if (!res.ok) {
      console.error("[recommended] upstream error:", res.status, text);
      return NextResponse.json(
        { error: "upstream error", status: res.status, detail: text },
        { status: 502 }
      );
    }

    // JSON parse安全化
    try {
      const data = text ? JSON.parse(text) : null;
      return NextResponse.json(data, { headers: { "Cache-Control": "no-store" } });
    } catch {
      console.error("[recommended] invalid json:", text);
      return NextResponse.json(
        { error: "invalid json from upstream", detail: text },
        { status: 502 }
      );
    }
  } catch (e) {
    console.error("[recommended] route error:", e);
    return NextResponse.json({ error: "internal error" }, { status: 500 });
  }
}
