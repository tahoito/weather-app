import { apiClient } from "./apiClient";

export type AuthSignUpRequest = {
  auth: {
    email: string;
    password: string;
  };
};

export type AuthSignUpResponse = {
  success: boolean;
  message: string;
  user?: { id: number; name: string; email: string };
};

export async function authSignUp(
  { auth }: AuthSignUpRequest
): Promise<AuthSignUpResponse> {
  try {
    const res = await apiClient.post<AuthSignUpResponse>(
      "/auth/signup",
      { auth }
    );
    return res.data;
  } catch (err: any) {
    return {
      success: false,
      message: err.response?.data?.message || "サインアップに失敗しました",
    };
  }
}
