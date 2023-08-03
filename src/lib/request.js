import axios from 'axios';

const apiEndpoint = process.env.REACT_APP_API_DOMAIN + '/api/';

const axiosEngagement = axios.create({
  baseURL: apiEndpoint,
  withCredentials: true
});

axiosEngagement.interceptors.request.use(req => {
  req.headers['x-access-token'] = localStorage.getItem('token');
  return req;
}, null, { synchronous: true });

export default axiosEngagement;
