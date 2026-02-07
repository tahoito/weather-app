import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  // Fly(本物のAPI)へ
  const r = await fetch("https://backend-autumn-pond-8461.fly.dev/api/sign-up-login/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
  });

  const data = await r.json();

  // 失敗はそのまま返す
  if (!r.ok) {
    return NextResponse.json(data, { status: r.status });
  }

  // ✅ token を Vercel側Cookieとしてセット
  const token = data?.authToken;
  const res = NextResponse.json(data, { status: 200 });

  if (token) {
    res.cookies.set({
      name: "auth_token",
      value: token,
      httpOnly: true,
      secure: true,
      sameSite: "lax", // 同一オリジンなので lax でOK
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
  }

  return res;
}
