import { useState } from "react";
import { addUser } from "../../api/user";
import AddLink from "../../components/admin/AddLink";
import LogoutButton from "../../components/global/LogoutButton";
import useAuth from "../../hooks/useAuth";
import AddClient from "./AddCliient";
import { Outlet } from "react-router-dom";
import BackButton from "../../components/global/BackButton";

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
      <BackButton />
      <br></br>
      layout
      <Outlet />
    </div>
  )
};
