/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authenticate, getToken } from "../api/auth";

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();

    if (!token) {
      navigate('/login');
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
        navigate('/login');
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