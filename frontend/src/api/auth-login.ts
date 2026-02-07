import { apiClient } from "./apiClient"; 

export type AuthLoginRequest = {
  auth: {
    email: string;
    password: string;
  };
};

export type AuthLoginResponse = {
  success: boolean;
  message: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
};

export async function authLogin(
  { auth }: AuthLoginRequest
): Promise<AuthLoginResponse> {
  try {
    const res = await apiClient.post<AuthLoginResponse>(
      "/auth/login",
      { auth }
    );

    // CookieはSet-Cookieで自動保存される
    return res.data;
  } catch (err: any) {
    return {
      success: false,
      message: err.response?.data?.message || "ログインに失敗しました",
    };
  }
}
