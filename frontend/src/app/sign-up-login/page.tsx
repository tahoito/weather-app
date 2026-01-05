"use client";

import Link from "next/link";

export default function Page() {
  return (
    <div className="bg-back w-full h-full [&>*]:text-fg">
      <div className="mx-9 grid grid-rows-2 h-screen">
        <h1 className="flex justify-center"></h1>
        <div className="flex flex-col gap-8">
          <Link
            href="/sign-up-login/login"
            className="rounded-full bg-main text-sm font-medium p-3 shadow-[2px_3px_1px_rgba(0,0,0,0.20)] flex justify-center"
          >
            ログインの方はこちら
          </Link>
          <Link
            href="/sign-up-login/sign-up"
            className="rounded-full bg-white border-2 border-main text-sm font-medium p-3 shadow-[2px_3px_1px_rgba(0,0,0,0.20)] flex justify-center"
          >
            新規登録の方はこちら
          </Link>
        </div>
      </div>
    </div>
  );
}
