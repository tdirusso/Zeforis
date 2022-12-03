import { useState } from "react";
import { login as loginService } from "../api/auth";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const login = async () => {
    const { success, message, navTo } = await loginService({ email, password });

    if (success) {
      navigate(navTo);
    } else {
      console.log(message);
    }
  };

  return (
    <div>
      Email
      <input type="text" onChange={(e) => setEmail(e.target.value)}></input>
      <br></br>
      Password
      <input type="text" onChange={(e) => setPassword(e.target.value)}></input>
      <br></br>
      <button onClick={login}>Login</button>
    </div>
  )
};
