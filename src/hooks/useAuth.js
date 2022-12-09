/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authenticateUser, getToken } from "../api/auth";

export default function useAuth() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    const token = getToken();

    if (!token) {
      navigate('/login');
    } else {
      authenticate();
    }

    async function authenticate() {
      const { user } = await authenticateUser();

      if (user) {
        console.log(user);

        const { adminOfClients, ownerOfAccount } = user;

        if (adminOfClients.length === 0 && !ownerOfAccount) {
          navigate('/login');
          //TODO allow user to create account for admin
        } else {
          setUser(user);
        }
      } else {
        navigate('/login');
      }
    }
  }, []);

  return {
    user
  };
}