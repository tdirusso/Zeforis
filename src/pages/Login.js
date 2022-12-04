import { useState } from "react";
import { login } from "../api/auth";
import { useNavigate } from "react-router-dom";
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import './Login.css';


export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = e => {
    e.preventDefault();
    setLoading(true);

    setTimeout(async () => {
      const { success, message, navTo } = await login({ email, password });

      if (success) {
        navigate(navTo);
      } else {
        setLoading(false);
        console.log(message);
      }
    }, 1000);
  };

  return (
    <div className="Login flex-centered">
      <Paper sx={{ p: 8, pt: 5 }} className="container">
        <Typography variant="h5" sx={{ mb: 6 }}>Sign in</Typography>
        <form onSubmit={handleLogin}>
          <TextField
            label="Email"
            variant="outlined"
            sx={{ mb: 4 }}
          />

          <TextField
            label="Password"
            variant="outlined"
            sx={{ mb: 4 }}
          />

          <LoadingButton
            loading={isLoading}
            disabled={isLoading}
            fullWidth
            variant="contained"
            type="submit"
          >
            Sign in
          </LoadingButton>
        </form>

      </Paper>
    </div>
  )
};
