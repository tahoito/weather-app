"use client";

import Link from "next/link";

export default function Page() {
  return (
    <div className="bg-back w-full h-full [&>*]:text-fg">
      <div className="mx-9 grid grid-rows-2 h-screen">
        <h1 className="flex justify-center"></h1>
        <div className="flex flex-col gap-8">
          <Link
            href="/auth/login"
            className="rounded-full bg-main text-sm font-semibold p-3 shadow-[1px_2px_1px_rgba(0,0,0,0.25)] flex justify-center"
          >
            ログインの方はこちら
          </Link>
          <Link
            href="/auth/register"
            className="rounded-full bg-white border-2 border-main text-sm font-semibold p-3 shadow-[1px_2px_1px_rgba(0,0,0,0.25)] flex justify-center"
          >
            新規登録の方はこちら
          </Link>
        </div>
      </div>
    </div>
  );
}
