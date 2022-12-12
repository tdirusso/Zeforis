import axios from 'axios';
import { removeToken, setToken } from '../api/auth';

const apiEndpoint = process.env.REACT_APP_DOMAIN + '/api/';

const axiosClient = axios.create({
  baseURL: apiEndpoint,
  withCredentials: true
});

axiosClient.interceptors.request.use(req => {
  req.headers['x-access-token'] = localStorage.getItem('token');
  return req;
}, null, { synchronous: true });

let retriedForTokenUpdate = false;

axiosClient.interceptors.response.use(successResponse => {
  if (successResponse.data.updatedToken) {
    if (retriedForTokenUpdate) {
      retriedForTokenUpdate = false;
      removeToken();
      window.location.href = '/login';
    } else {
      setToken(successResponse.data.updatedToken);
      retriedForTokenUpdate = true;
      return axiosClient(successResponse.config);
    }
  }

  return successResponse;
});


export default axiosClient;
