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
    const res = await axios.post<AuthSignUpResponse>(
      `${api}/api/sign-up-login/signup`,
      { auth }, 
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return res.data;
  } catch (err: any) {
    console.log("STATUS:", err.response?.status);
    console.log("DATA:", err.response?.data); // ←これが重要
    console.log("ERRORS:", err.response?.data?.errors); 
    return {
      success: false,
      message: err.response?.data?.message || "ログインに失敗しました",
      authToken: "",
    };
  }
}
