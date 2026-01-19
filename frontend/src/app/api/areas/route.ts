import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!base) {
      return NextResponse.json(
        { error: "server env missing: NEXT_PUBLIC_API_BASE_URL" },
        { status: 500 }
      );
    }

    const url = `${base}/api/areas`;
    const res = await fetch(url, { cache: "no-store" });

    const text = await res.text();
    if (!res.ok) {
      console.error("Laravel areas error:", res.status, text);
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
    console.error("areas route error:", e);
    return NextResponse.json({ error: "internal error" }, { status: 500 });
  }
}
