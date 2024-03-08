import axios from 'axios';
import { EnvVariable, getEnvVariable } from 'src/types/EnvVariable';

const apiEndpoint = getEnvVariable(EnvVariable.REACT_APP_API_DOMAIN) + '/api/';

const axiosClient = axios.create({
  baseURL: apiEndpoint,
  withCredentials: true
});

axiosClient.interceptors.response.use(response => response, error => {
  if (error.response?.status === 401 && error.response?.data?.message?.includes('expired ')) {
    alert('Session expired');
    window.location.replace('/login');
    return null;
  }

  return Promise.reject(error);
});

export default axiosClient;