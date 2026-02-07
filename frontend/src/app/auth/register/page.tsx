"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { EyeOffIcon } from "@/components/icon/eye-off-icon";
import { EyeIcon } from "@/components/icon/eye-icon";
import { ArrowLeftIcon } from "@/components/icon/arrow-left-icon";
import { authSignUp, AuthSignUpRequest } from "@/api/auth-sign-up";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

type FormInput = AuthSignUpRequest & {
  confirmPassword?: string;
};

function getErrorMessage(e: unknown) {
  if (e instanceof Error) return e.message;
  return "通信エラーが発生しました";
}

export default function Page() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormInput>({ mode: "onSubmit" });

  const password = watch("auth.password");
  const canSubmit = useMemo(() => !isSubmitting, [isSubmitting]);

  const onSubmit = async (data: FormInput) => {
    setFormError(null);

    // 念のため：確認不一致なら送らない
    if (data.confirmPassword !== data.auth.password) {
      setError("confirmPassword", { message: "パスワードが一致しません" });
      return;
    }

    const payload: AuthSignUpRequest = {
      auth: { email: data.auth.email, password: data.auth.password },
    };

    try {
      const res = await authSignUp(payload);

      if (res.success) {
        if (res.authToken) localStorage.setItem("token", res.authToken);

        localStorage.setItem("showAreaModal", "true");
        localStorage.removeItem("selectedAreaSlug");
        sessionStorage.removeItem("top_cache_v1");

        router.replace("/top"); // ← pushよりおすすめ
        return;
      }

      // APIが success:false を返したとき
      setFormError(res.message || "登録に失敗しました");
    } catch (e) {
      setFormError(getErrorMessage(e));
    }
  };

  return (
    <div className="min-h-screen bg-back flex items-center justify-center">
      <Link href="/" className="absolute top-16 left-9 w-6 h-6 text-fg">
        <ArrowLeftIcon />
      </Link>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md text-fg px-9 flex flex-col justify-center min-h-[70vh]"
      >
        <div className="flex flex-col">
          <h1 className="text-2xl font-semibold text-center mb-12">新規登録</h1>

          {formError && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {formError}
            </div>
          )}

          <div className="gap-4 flex flex-col">
            {/* Email */}
            <div className="flex flex-col">
              <label htmlFor="email" className="mx-3 mb-1">
                メールアドレス
              </label>
              <input
                id="email"
                type="email"
                placeholder="example@gmail.com"
                className="border border-holder rounded-xl bg-white p-3"
                autoComplete="email"
                inputMode="email"
                disabled={isSubmitting}
                {...register("auth.email", {
                  required: "メールアドレスを入力してください",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "メールアドレスの形式が正しくありません",
                  },
                })}
              />
              {errors.auth?.email && (
                <p className="text-red-500 text-xs mt-1 mx-3">
                  {errors.auth.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col">
              <label htmlFor="password" className="mx-3 mb-1">
                パスワード
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="パスワード(8文字以上)"
                  className="w-full border border-holder rounded-xl bg-white p-3 pr-12"
                  autoComplete="new-password"
                  disabled={isSubmitting}
                  {...register("auth.password", {
                    required: "パスワードは8文字以上で入力",
                    minLength: { value: 8, message: "パスワードは8文字以上で入力" },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 disabled:opacity-50"
                  aria-label={showPassword ? "パスワードを隠す" : "パスワードを表示"}
                  disabled={isSubmitting}
                >
                  {showPassword ? <EyeIcon /> : <EyeOffIcon />}
                </button>
              </div>
              {errors.auth?.password && (
                <p className="text-red-500 text-xs mt-1 mx-3">
                  {errors.auth.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col">
              <label htmlFor="confirmPassword" className="mx-3 mb-1">
                パスワード確認
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="パスワード確認"
                  className="w-full border border-holder rounded-xl bg-white p-3 pr-12"
                  autoComplete="new-password"
                  disabled={isSubmitting}
                  {...register("confirmPassword", {
                    required: "確認用パスワードを入力してください",
                    validate: (value) => value === password || "パスワードが一致しません",
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 disabled:opacity-50"
                  aria-label={
                    showConfirmPassword ? "確認用パスワードを隠す" : "確認用パスワードを表示"
                  }
                  disabled={isSubmitting}
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
          <button
            type="submit"
            disabled={!canSubmit}
            className="rounded-full bg-main font-semibold p-3 shadow-[1px_2px_1px_rgba(0,0,0,0.25)] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "送信中..." : "新規登録"}
          </button>

          <Link
            href="/auth/login"
            className={`text-sm text-center pt-3 ${isSubmitting ? "pointer-events-none opacity-50" : ""}`}
          >
            ログインの方はこちら
          </Link>
        </div>
      </form>
    </div>
  );
}
