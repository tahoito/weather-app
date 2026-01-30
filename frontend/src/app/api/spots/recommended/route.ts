import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: Request) {
  try {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL; // 例: https://...fly.dev/api
    if (!base) {
      console.error("NEXT_PUBLIC_API_BASE_URL is not set");
      return NextResponse.json({ error: "server misconfig" }, { status: 500 });
    }

    const incomingUrl = new URL(req.url);
    const qs = incomingUrl.searchParams.toString();
    const url = `${base}/spots/recommended${qs ? `?${qs}` : ""}`;

    const auth = req.headers.get("authorization") ?? "";

    const res = await fetch(url, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
        ...(auth ? { Authorization: auth } : {}),
      },
    });

    const text = await res.text();

    if (!res.ok) {
      console.error("[recommended] upstream error:", res.status, text);
      return NextResponse.json(
        { error: "upstream error", status: res.status, detail: text },
        { status: res.status }
      );
    }

    const data = text ? JSON.parse(text) : null;
    return NextResponse.json(data, { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    console.error("[recommended] route error:", e);
    return NextResponse.json({ error: "internal error" }, { status: 500 });
  }
}
