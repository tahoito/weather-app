"use client";

import { useState } from "react";
import Link from "next/link";
import { EyeOffIcon } from "@/components/icon/eye-off-icon";
import { EyeIcon } from "@/components/icon/eye-icon";
import { ArrowLeftIcon } from "@/components/icon/arrow-left-icon";
import { authSignUp, AuthSignUpRequest } from "@/api/auth-sign-up";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";

type FormInput = AuthSignUpRequest & {
  confirmPassword?: string;
};

export default function Page() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormInput>();
  const password = watch("auth.password");

  const onSubmit = async (data: AuthSignUpRequest) => {
    const res = await authSignUp(data);

    if (res.success) {
      Cookies.set("authToken", res.authToken);
      location.href = "/";
    }
  };

  return (
    <div className="min-h-screen bg-back flex items-center justify-center">
      <Link
        href="/sign-up-login"
        className="absolute top-16 left-9 w-6 h-6 text-fg"
      >
        <ArrowLeftIcon />
      </Link>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md text-fg px-9 flex flex-col justify-center min-h-[70vh]"
      >
        <div className="flex flex-col">
          <h1 className="text-2xl font-medium text-center mb-12">新規登録</h1>

          <div className="gap-4 flex flex-col ">
            <div className="flex flex-col">
              <label htmlFor="email" className="text-sm mx-3 mb-1">
                メールアドレス
              </label>
              <input
                id="email"
                type="email"
                placeholder="example@gmail.com"
                className="border border-holder placeholder:text-xs rounded-xl bg-white p-3"
                {...register("auth.email", {
                  required: "メールアドレスを入力してください",
                })}
              />
              {errors.auth?.email && (
                <p className="text-red-500 text-xs mt-1 mx-3">
                  {errors.auth.email.message}
                </p>
              )}
            </div>

            <div className="flex flex-col">
              <label htmlFor="password" className="text-sm mx-3 mb-1">
                パスワード
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="パスワード"
                  className="w-full border border-holder placeholder:text-xs rounded-xl bg-white p-3"
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
            </div>

            <div className="flex flex-col">
              <label htmlFor="confirmPassword" className="text-sm mx-3 mb-1">
                パスワード確認
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="パスワード確認"
                  className="w-full border border-holder placeholder:text-xs rounded-xl bg-white p-3"
                  {...register("confirmPassword", {
                    required: "確認用パスワードを入力してください",
                    validate: (value) =>
                      value === password || "パスワードが一致しません",
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showConfirmPassword ? <EyeIcon /> : <EyeOffIcon />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1 mx-3">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col mt-24 justify-end">
          <button className="rounded-full bg-main text-sm font-medium p-3 shadow-[2px_3px_1px_rgba(0,0,0,0.20)]">
            新規登録
          </button>
          <Link
            href="/sign-up-login/login"
            className="text-sm text-center pt-3"
          >
            ログインの方はこちら
          </Link>
        </div>
      </form>
    </div>
  );
}
