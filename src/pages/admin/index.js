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
      <BackButton/>
      <br></br>
      {/* First
      <input type="text" onChange={(e) => setFirstName(e.target.value)}></input>
      <br></br>
      Last
      <input type="text" onChange={(e) => setLastName(e.target.value)}></input>
      <br></br>
      Email
      <input type="text" onChange={(e) => setEmail(e.target.value)}></input>
      <br></br>
      Password
      <input type="text" onChange={(e) => setPassword(e.target.value)}></input>
      <br></br>
      <button onClick={createUser}>Add Administrator user</button>
      <LogoutButton />
      <br></br>
      <br></br>
      <AddLink />
      <br></br>
      <br></br>
      <AddClient /> */}
      layout
      <Outlet />
    </div>
  )
};
