import axios from "axios";

export type AuthSignUpRequest = {
  auth: {
    email: string;
    password: string;
  };
};

export type AuthSignUpResponse = {
  success: boolean;
  message: string;
  authToken: string;
};

export async function authSignUp({
  auth,
}: AuthSignUpRequest): Promise<AuthSignUpResponse> {
  const apiUrl = "https://example.com/api/sign-up-login/signup";

  try {
    const response = await axios.post<AuthSignUpResponse>(apiUrl, auth, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (err: any) {
    console.error(err);
    return {
      success: false,
      message: err.response?.data.message || "ログインに失敗しました",
      authToken: "",
    };
  }
}
