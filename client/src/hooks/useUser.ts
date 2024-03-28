import { useEffect, useState } from "react";
import { User } from "@shared/types/User";
import { getMe } from "src/api/users";
import { AxiosError } from "axios";

export default function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    getAuthenticatedUser();

    async function getAuthenticatedUser() {
      try {
        const me = await getMe();

        if (me) {
          setUser(me);
          setLoading(false);
        }
      } catch (error: unknown) {
        console.log(error);
        if (error instanceof AxiosError) {
          if (error.response?.status === 401) {
            alert('Session expired.');
          } else {
            alert(`${error.response?.data.message}`);
          }
        } else if (error instanceof Error) {
          alert(`${error.message}`);
        }

        window.location.replace('/login');
      }
    }
  }, []);

  return {
    user,
    setUser,
    isUserLoading: isLoading,
  };
}