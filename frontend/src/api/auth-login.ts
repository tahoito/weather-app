import axios from "axios";

export type AuthLoginRequest = {
  auth: {
    email: string;
    password: string;
  };
};

export type AuthLoginResponse = {
  success: boolean;
  message: string[];
  authToken: string;
};

export async function authLogin({
  auth,
}: AuthLoginRequest): Promise<AuthLoginResponse> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/login`;

  // try {
  //   const response = await axios.post<AuthLoginResponse>(apiUrl, auth, {
  //     headers: { "Content-Type": "application/json" },
  //   });
  //   return response.data;
  // } catch (err: any) {
  //   console.error(err);
  //   return {
  //     success: false,
  //     message: err.response?.data.message || "ログインに失敗しました",
  //     authToken: "",
  //   };
  // }
  return axios
    .post<AuthLoginResponse>(apiUrl, {
      auth,
    })
    .then((res) => res.data)
    .catch((err) => {
      console.log(err);
      return {
        success: false,
        message: err.response?.data.messages || [],
        authToken: "",
      };
    });
}
