import { useState } from "react";
import { login } from "../../api/auth";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const tryLogin = async () => {
    const result = await login({ email, password });
    
    if (result.success) {
      navigate(result.navTo);
    } else {
      console.log(result.message);
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
      <button onClick={tryLogin}>Login</button>
    </div>
  )
};
