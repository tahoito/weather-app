import { apiClient } from "@/api/apiClient";

export type AuthSignUpRequest = {
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

export async function authSignUp(payload: AuthSignUpRequest): Promise<AuthResponse> {
  const res = await apiClient.post("/sign-up-login/signup", payload);
  return res.data as AuthResponse;
}
