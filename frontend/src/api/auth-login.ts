import { apiClient } from "@/api/apiClient";

export type AuthLoginRequest = {
  auth: {
    email: string;
    password: string;
  };
};

export type AuthResponse = {
  success: boolean;
  message: string;
  authToken?: string;
  user?: { id: number; name: string; email: string };
};

export async function authLogin(payload: AuthLoginRequest): Promise<AuthResponse> {
  const res = await apiClient.post("/sign-up-login/login", payload);
  return res.data as AuthResponse;
}
