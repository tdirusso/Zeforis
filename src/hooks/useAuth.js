/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authenticateUser, getToken } from "../api/auth";

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
      authenticate();
    }

    async function authenticate() {
      const { user, message } = await authenticateUser();

      if (user) {
        console.log(user);
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
    isUserLoading: isLoading,
    authError: error
  };
}