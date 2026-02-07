import { NextResponse } from "next/server";

export async function GET(req: Request) {
  // ✅ フロントドメインの cookie を読む
  const cookie = req.headers.get("cookie") ?? "";

  const r = await fetch("https://backend-autumn-pond-8461.fly.dev/api/me", {
    method: "GET",
    headers: {
      Accept: "application/json",
      // ✅ そのまま Cookie を backend に渡す（auth_token を middleware がBearer化する想定）
      cookie,
    },
  });

  const data = await r.json();
  return NextResponse.json(data, { status: r.status });
}
