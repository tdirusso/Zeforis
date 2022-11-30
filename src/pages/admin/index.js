import { useState } from "react";
import { addUser } from "../../api/user";
import CreateLink from "../../components/admin/createLink";
import LogoutButton from "../../components/global/logoutButton";
import useAuth from "../../hooks/useAuth";

export default function AdminPage() {
  const { user } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
      First
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
      <CreateLink />
    </div>
  )
};
