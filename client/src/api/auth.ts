import request from '../lib/request';
import type { LoginRequest, VerifyLoginRequest } from '@shared/types/Auth';

const login = async (payload: LoginRequest) => {
  return (await request.post<void>('login', payload)).data;
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