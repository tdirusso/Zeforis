import { useEffect, useState } from "react";
import { authenticate, getToken } from "../api/auth";
import { User } from "@shared/types/User";

export default function useAuth() {
  const [user, setUser] = useState<User | null>(null);
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