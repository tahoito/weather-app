import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function joinUrl(base: string, path: string) {
  const b = base.replace(/\/+$/, "");
  const p = path.replace(/^\/+/, "");
  return `${b}/${p}`;
}

export async function GET() {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!base) {
    return NextResponse.json(
      { error: "server env missing: NEXT_PUBLIC_API_BASE_URL" },
      { status: 500 }
    );
  }

  const url = joinUrl(base, "/areas");

  try {
    const res = await fetch(url, {
      cache: "no-store",
      // タイムアウト欲しいなら AbortController も可
    });

    const text = await res.text();

    if (!res.ok) {
      console.error("Laravel areas error:", { url, status: res.status, text });
      return NextResponse.json(
        { error: "upstream error", url, status: res.status, detail: text },
        { status: 502 }
      );
    }

    // JSONじゃないものが返ってるとここで落ちるので、try/catchで囲う
    try {
      const data = text ? JSON.parse(text) : null;
      return NextResponse.json(data, { headers: { "Cache-Control": "no-store" } });
    } catch (jsonErr: any) {
      console.error("Upstream returned non-JSON:", { url, text });
      return NextResponse.json(
        { error: "upstream non-json", url, detail: text },
        { status: 502 }
      );
    }
  } catch (e: any) {
    console.error("areas route fetch failed:", {
      url,
      message: e?.message,
      name: e?.name,
      stack: e?.stack,
      cause: e?.cause,
    });

    return NextResponse.json(
      { error: "fetch failed", url, message: e?.message ?? null },
      { status: 502 }
    );
  }
}
