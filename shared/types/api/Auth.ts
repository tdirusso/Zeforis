export interface LoginRequest {
  email?: string;
  googleCredential?: string;
  isFromCustomLoginPage?: boolean;
  orgId?: number;
};

export interface VerifyLoginRequest {
  email: string,
  loginCode: string;
}