import axios from 'axios';
import { getToken, setToken } from '../api/auth';
import { EnvVariable, getEnvVariable } from 'src/types/EnvVariable';


const apiEndpoint = getEnvVariable(EnvVariable.REACT_APP_API_DOMAIN) + '/api/';

const axiosClient = axios.create({
  baseURL: apiEndpoint,
  withCredentials: true
});

axiosClient.interceptors.request.use(req => {
  req.headers['x-access-token'] = getToken();
  return req;
}, null, { synchronous: true });

axiosClient.interceptors.response.use(response => {
  if (response.data?.token) {
    setToken(response.data.token);
  }

  return response;
}, error => {
  if (error.response.status === 401) {
    alert('Session expired');
    window.location.replace('/login');
    return null;
  }

  return Promise.reject(error);
});

export default axiosClient;