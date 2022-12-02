import axios from 'axios';

const domain = process.env.REACT_APP_DOMAIN;

const addFolder = async (payload) => {
  const { data } = await axios.post(`${domain}/api/addUser`, {
    token: localStorage.getItem('token'),
    ...payload
  });
  return data;
};

export {
  addFolder
};