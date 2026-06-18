export interface AuthResponseDto {
  token: string;
  expiration: string;
  userId: string;
  email: string;
  fullName: string;
  profileImageUrl?: string;
  isNewUser: boolean;
}

export interface RegisterRequestDto {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  gender?: number;
  dateOfBirth?: string;
}

export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface GoogleLoginRequestDto {
  idToken: string;
}

export interface ForgotPasswordRequestDto {
  email: string;
}

export interface ResetPasswordRequestDto {
  email: string;
  resetCode: string;
  newPassword?: string;
  confirmPassword?: string;
}

export interface ChangePasswordRequestDto {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

// Deprecated Aliases for compatibility
export type AuthResponse = AuthResponseDto;
export type RegisterRequest = RegisterRequestDto;
export type LoginRequest = LoginRequestDto;
export type GoogleLoginRequest = GoogleLoginRequestDto;
export type ForgotPasswordRequest = ForgotPasswordRequestDto;
export type ResetPasswordRequest = ResetPasswordRequestDto;
export type ChangePasswordRequest = ChangePasswordRequestDto;
