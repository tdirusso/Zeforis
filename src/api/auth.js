import request from '../lib/request';

const login = async (payload) => {
  const { data } = await request.post(`login`, payload);

  if (data.token) {
    localStorage.setItem('token', data.token);
  }

  const success = data.token ? true : false;
  const navTo = data.role === 'Administrator' ? '/admin' : '/home';
  const message = data.message;

  return {
    success,
    navTo,
    message
  };
};

const logout = () => {
  localStorage.removeItem('token');
  window.location.href = '/login';
};

const authenticateUser = async (token) => {
  const { data } = await request.post(`authenticate`, { token });

  if (data.user) {
    if (data.user.role !== 'Administrator' && window.location.pathname.includes('admin')) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }

    return {
      user: data.user
    };
  }

  localStorage.removeItem('token');
  return {
    message: data.message
  }
};

export {
  login,
  logout,
  authenticateUser
};