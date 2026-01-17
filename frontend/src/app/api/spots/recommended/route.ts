import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: Request) {
  try {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!base) {
      return NextResponse.json(
        { error: "server env missing: NEXT_PUBLIC_API_BASE_URL" },
        { status: 500 }
      );
    }

    const incomingUrl = new URL(req.url);
    const qs = incomingUrl.searchParams.toString();

    const url = `${base}/api/spots/recommended${qs ? `?${qs}` : ""}`;

    const res = await fetch(url, { cache: "no-store" });

    const text = await res.text(); // 先にtextで取る（ログ用）
    if (!res.ok) {
      console.error("Laravel recommended error:", res.status, text);
      return NextResponse.json(
        { error: "upstream error", status: res.status, detail: text },
        { status: 502 }
      );
    }

    const data = text ? JSON.parse(text) : null;

    return NextResponse.json(data, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (e) {
    console.error("recommended route error:", e);
    return NextResponse.json({ error: "internal error" }, { status: 500 });
  }
}
