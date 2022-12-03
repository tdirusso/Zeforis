import axios from 'axios';

const apiEndpoint = process.env.REACT_APP_DOMAIN + '/api/';

const axiosClient = axios.create({
  baseURL: apiEndpoint,
  withCredentials: true
});

const onResponseError = (error) => {
  //return Promise.reject(error)
};

axiosClient.interceptors.request.use(req => {
  req.headers['x-access-token'] = localStorage.getItem('token');
  return req;
}, null, { synchronous: true });

axiosClient.interceptors.response.use(res => res, onResponseError);


export default axiosClient;
