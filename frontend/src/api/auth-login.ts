import axios from "axios";

const api = process.env.NEXT_PUBLIC_API_BASE_URL;

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
    const res = await axios.post<AuthLoginResponse>(
      `${api}/api/sign-up-login/login`,
      { auth },
      { headers: { "Content-Type": "application/json" } }
    );
    return res.data;
  }catch(err: any) {
    console.log("LOGIN STATUS:", err.response?.status);
    console.log("LOGIN DATA:", err.response?.data);
    console.log("LOGIN ERRORS:", err.response?.data?.errors);
    return {
      success: false,
      message: err.response?.data?.messages || "ログインに失敗しました",
      authToken: "",
    };
  }
}
