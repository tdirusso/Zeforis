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
      const result = await authenticateUser(token);

      if (result.user) {
        setUser(result.user);
      } else {
        navigate('/login');
      }
    }
  }, []);

  return {
    user
  };
}