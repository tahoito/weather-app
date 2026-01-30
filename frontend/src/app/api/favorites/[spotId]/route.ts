import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function getCookie(req: Request, key: string) {
  const cookie = req.headers.get("cookie") ?? "";
  const m = cookie.match(new RegExp(`(?:^|;\\s*)${key}=([^;]+)`));
  return m ? decodeURIComponent(m[1]) : "";
}

export async function DELETE(
  req: Request,
  ctx: { params: Promise<{ spotId: string }> }
) {
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

  const { spotId } = await ctx.params; 
  const url = `${base}/favorites/${spotId}`;

  const res = await fetch(url, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` , Accept: "application/json", },
    cache: "no-store",
  });

  const text = await res.text();


  if (!res.ok) {
    console.error("Laravel favorites DELETE error:", res.status, text);
    return new NextResponse(text || "upstream error", {
      status: res.status,
      headers: {
        "Content-Type": res.headers.get("content-type") ?? "text/plain",
      },
    });
  }

  return NextResponse.json({ success: true });
}
