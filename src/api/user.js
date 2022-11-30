import axios from 'axios';

const domain = process.env.REACT_APP_DOMAIN;

const addUser = async (payload) => {
  const { data } = await axios.post(`${domain}/api/addUser`, payload);
  return data;
};

export {
  addUser
};