import { useEffect, useState } from "react";
import { authenticate, getToken } from "../api/auth";
import { User } from "@shared/types/User";

export default function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();

    if (!token) {
      window.location.href = ('/login');
    } else {
      authenticateUser();
    }

    async function authenticateUser() {
      try {
        const { user } = await authenticate();

        if (user) {
          setUser(user);
          setLoading(false);
        }
      } catch (error: unknown) {
        //User will be redirected to login via Axios response interceptor
      }
    }
  }, []);

  return {
    user,
    setUser,
    isUserLoading: isLoading,
  };
}