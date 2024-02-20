import request from '../lib/request';
import type { LoginRequest, LoginResponse, VerifyLoginRequest, VerifyLoginResponse } from '@shared/types/api/Auth';

const login = async (payload: LoginRequest) => {
  return (await request.post<LoginResponse>('login', payload)).data;
};

const verifyLogin = async (payload: VerifyLoginRequest) => {
  return (await request.post<VerifyLoginResponse>('verify-login', payload)).data;
};

const logout = (logoutPageUrl: string) => {
  deleteToken();
  window.location.href = logoutPageUrl;
};

const authenticate = async () => {
  const { data } = await request.post(`authenticate`);

  if (!data.user) {
    deleteToken();
  }

  return data;
};

const getToken = () => {
  return localStorage.getItem('token');
};

const setToken = (token: string) => {
  localStorage.setItem('token', token);
};

const deleteToken = () => {
  localStorage.removeItem('token');
};

export {
  login,
  logout,
  authenticate,
  getToken,
  setToken,
  deleteToken,
  verifyLogin
};