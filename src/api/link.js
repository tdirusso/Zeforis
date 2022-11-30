import axios from 'axios';
const domain = process.env.REACT_APP_DOMAIN;

const addLink = async (payload) => {
  const { data } = await axios.post(`${domain}/api/addLink`, payload);
  return data;
};

export {
  addLink
};