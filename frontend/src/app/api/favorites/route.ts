import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function getCookie(req: Request, key: string) {
  const cookie = req.headers.get("cookie") ?? "";
  const m = cookie.match(new RegExp(`(?:^|;\\s*)${key}=([^;]+)`));
  return m ? decodeURIComponent(m[1]) : "";
}

export async function GET(req: Request) {
  try {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!base) {
      return NextResponse.json(
        { error: "server env missing: NEXT_PUBLIC_API_BASE_URL" },
        { status: 500 }
      );
    }

    const token = getCookie(req, "authToken");
    if (!token) return NextResponse.json([], { status: 200 }); // 未ログインは空でOK

    const url = `${base}/api/favorites`;

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    const text = await res.text();
    if (!res.ok) {
      console.error("Laravel favorites GET error:", res.status, text);
      return NextResponse.json(
        { error: "upstream error", status: res.status, detail: text },
        { status: 502 }
      );
    }

    const data = text ? JSON.parse(text) : null;
    return NextResponse.json(data, { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    console.error("favorites GET route error:", e);
    return NextResponse.json({ error: "internal error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!base) {
      return NextResponse.json(
        { error: "server env missing: NEXT_PUBLIC_API_BASE_URL" },
        { status: 500 }
      );
    }

    const token = getCookie(req, "authToken");
    if (!token) {
      return NextResponse.json({ error: "missing authToken" }, { status: 401 });
    }

    const body = await req.json(); // { spot_id: number } を期待
    const url = `${base}/api/favorites`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const text = await res.text();
    if (!res.ok) {
      console.error("Laravel favorites POST error:", res.status, text);
      return NextResponse.json(
        { error: "upstream error", status: res.status, detail: text },
        { status: 502 }
      );
    }

    const data = text ? JSON.parse(text) : null;
    return NextResponse.json(data, { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    console.error("favorites POST route error:", e);
    return NextResponse.json({ error: "internal error" }, { status: 500 });
  }
}
