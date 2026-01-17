import axios from "axios";
const api = process.env.NEXT_PUBLIC_API_BASE_URL;

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
  try {
    const response = await axios.post<AuthSignUpResponse>(
      `${api}/api/sign-up-login/signup`,
      auth, 
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  } catch (err: any) {
    console.error(err);
    return {
      success: false,
      message: err.response?.data?.message || "ログインに失敗しました",
      authToken: "",
    };
  }
}
