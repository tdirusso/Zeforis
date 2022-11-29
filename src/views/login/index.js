import { useState } from "react"

export default function Login() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const createUser = async () => {
    const response = await fetch(`${process.env.REACT_APP_DOMAIN}/api/addUser`, {
      method: 'POST',
      body: JSON.stringify({
        firstName,
        lastName,
        password,
        email,
        role: 'Administrator'
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const result = await response.json();

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
    </div>
  )
};
