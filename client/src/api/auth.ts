import request from '../lib/request';
import type { LoginRequest, LoginResponse, VerifyLoginRequest } from '@shared/types/api/Auth';

const login = async (payload: LoginRequest) => {
  return (await request.post<LoginResponse>('login', payload)).data;
};

const verifyLogin = async (payload: VerifyLoginRequest) => {
  return (await request.post<void>('verify-login', payload)).data;
};

const logout = async () => {
  await request.post<void>('logout');
  //window.location.href = logoutPageUrl;
};

const authenticate = async () => {
  const { data } = await request.post(`authenticate`);

  if (!data.user) {
    // deleteToken();
  }

  return data;
};

export {
  login,
  logout,
  authenticate,
  verifyLogin
};