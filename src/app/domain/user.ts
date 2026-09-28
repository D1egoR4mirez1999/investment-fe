export interface ILoginRequest {
  email: string;
  password: string;
}

export interface ILoginResponse {
  accessToken: string;
}

export interface IUser {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}
