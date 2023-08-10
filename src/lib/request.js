import axios from 'axios';
import { getToken, setToken } from '../api/auth';

const apiEndpoint = process.env.REACT_APP_API_DOMAIN + '/api/';

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
    setToken(response.data?.token)
  }

  return response;
});

export default axiosClient;
