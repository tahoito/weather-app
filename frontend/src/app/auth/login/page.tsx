"use client";

import { useState } from "react";
import { authLogin, AuthLoginRequest } from "@/api/auth-login";
import Link from "next/link";
import { EyeOffIcon } from "@/components/icon/eye-off-icon";
import { EyeIcon } from "@/components/icon/eye-icon";
import { ArrowLeftIcon } from "@/components/icon/arrow-left-icon";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";

type FormInput = AuthLoginRequest;
export default function Page() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormInput>();

  const onSubmit: SubmitHandler<FormInput> = async (data) => {
    const res = await authLogin(data);

    if (res.success) {
      router.push("/top");
      return;
    }

    alert(res.message); 
  };

  return (
    <div className="bg-back w-full h-full [&>*]:text-fg">
      <div className="mx-9 grid grid-rows-3 h-screen">
        <Link href="/" className="absolute top-16 left-9 w-6 h-6 text-fg">
          <ArrowLeftIcon />
        </Link>
        <form onSubmit={handleSubmit(onSubmit)}>
          <h1 className="text-2xl font-semibold flex justify-center pb-20 pt-48">
            ログイン
          </h1>
          <div className="[&>*]:my-5">
            <div className="flex flex-col">
              <label htmlFor="email" className="mx-3 my-1">
                メールアドレス
              </label>
              <input
                type="email"
                placeholder="example@gmail.com"
                className="border border-holder rounded-xl bg-white p-3"
                autoComplete="current-email"
                {...register("auth.email", {
                  required: "メールアドレスを入力してください",
                })}
              />
              {errors.auth?.email && (
                <p className="text-red-500 text-xs mx-3 mt-1">
                  {errors.auth.email.message}
                </p>
              )}
            </div>

            <div className="flex flex-col">
              <label htmlFor="password" className="mx-3 my-1">
                パスワード
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="パスワード"
                  className="w-full border border-holder rounded-xl bg-white p-3"
                  autoComplete="current-password"
                  {...register("auth.password", {
                    required: "パスワードを入力してください",
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeIcon /> : <EyeOffIcon />}
                </button>
              </div>
              {errors.auth?.password && (
                <p className="text-red-500 text-xs mx-3 mt-1">
                  {errors.auth.password.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col pt-28">
            <button className="rounded-full bg-main font-semibold p-3 shadow-[1px_2px_1px_rgba(0,0,0,0.25)]">
              ログイン
            </button>
            <Link
              href="/auth/register"
              className="text-sm flex justify-center pt-3"
            >
              新規登録の方はこちら
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
