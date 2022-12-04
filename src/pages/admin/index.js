import { useState } from "react";
import { addUser } from "../../api/user";
import LogoutButton from "../../components/core/LogoutButton";
import useAuth from "../../hooks/useAuth";
import { Outlet } from "react-router-dom";
import BackButton from "../../components/core/BackButton";
import SideNav from "../../components/core/SideNav";
import './admin.css';

export default function Admin() {
  const { user } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  //console.log(user)

  const createUser = async () => {
    const result = await addUser({
      firstName,
      lastName,
      password,
      email,
      role: 'Administrator'
    });


    console.log(result);
  };

  return (
    <div>
      <SideNav />
      <BackButton />
      <main>
        <Outlet />
      </main>
    </div>
  )
};
