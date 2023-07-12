/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { authenticate, getToken } from "../api/auth";

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = getToken();

    if (!token) {
      window.location.href = ('/login');
    } else {
      authenticateUser();
    }

    async function authenticateUser() {
      const { user, message } = await authenticate();

      if (user) {
        setUser(user);
        setLoading(false);
      } else {
        setError(message);
        window.location.href = ('/login');
      }
    }
  }, []);

  return {
    user,
    setUser,
    isUserLoading: isLoading,
    authError: error
  };
}