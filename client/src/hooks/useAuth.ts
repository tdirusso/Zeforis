import { useEffect, useState } from "react";
import { authenticate } from "../api/auth";
import { User } from "@shared/types/User";

export default function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    authenticateUser();

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