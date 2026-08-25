/**
 * Authentication Response Model
 */
export interface IAuthResponse {
  token: string;
  refreshToken?: string;
  user: IUserData;
  expiresIn: number;
}

export interface IUserData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface ILoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface IForgotPasswordRequest {
  email: string;
}

export interface IResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}
