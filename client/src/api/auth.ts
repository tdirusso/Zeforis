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
};

export {
  login,
  logout,
  verifyLogin
};