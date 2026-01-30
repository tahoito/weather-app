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
  authToken: string;
};

export async function authLogin({
  auth,
}: AuthLoginRequest): Promise<AuthLoginResponse> {
  try {
    const res = await apiClient.post<AuthLoginResponse>(
      "/api/sign-up-login/login",
      { auth }
    );
    return res.data;
  } catch (err: any) {
    return {
      success: false,
      message: err.response?.data?.message || "ログインに失敗しました",
      authToken: "",
    };
  }
}
