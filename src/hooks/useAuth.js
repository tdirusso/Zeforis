/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authenticateUser } from "../api/auth";

export default function useAuth() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login');
    } else {
      authenticate();
    }

    async function authenticate() {
      const { user } = await authenticateUser(token);

      if (user) {
        setUser(user);
      } else {
        navigate('/login');
      }
    }
  }, []);

  return {
    user
  };
}