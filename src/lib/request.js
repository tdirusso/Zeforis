import axios from 'axios';

const apiEndpoint = process.env.REACT_APP_DOMAIN + '/api/';

const axiosClient = axios.create({
  baseURL: apiEndpoint,
  withCredentials: true
});

axiosClient.interceptors.request.use(req => {
  req.headers['x-access-token'] = localStorage.getItem('token');
  return req;
}, null, { synchronous: true });

export default axiosClient;
