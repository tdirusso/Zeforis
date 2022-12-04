import { useState } from "react";
import { login } from "../api/auth";
import { useNavigate } from "react-router-dom";
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import { Link } from "react-router-dom";
import Snackbar from "../components/core/Snackbar";
import useSnackbar from "../hooks/useSnackbar";
import './Login.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setLoading] = useState(false);
  const {
    isOpen,
    openSnackBar,
    type,
    message
  } = useSnackbar();
  const navigate = useNavigate();

  const handleLogin = e => {
    e.preventDefault();

    if (!email) {
      openSnackBar('Please enter a valid email address', 'error');
      return;
    }

    if (!password) {
      openSnackBar('Please enter your password', 'error');
      return;
    }

    setLoading(true);

    setTimeout(async () => {
      const { success, message, navTo } = await login({ email, password });

      if (success) {
        navigate(navTo);
      } else {
        setLoading(false);
        openSnackBar(message, 'error');
      }
    }, 1000);
  };

  return (
    <div className="Login flex-centered">
      <Paper sx={{ p: 8, pt: 5 }} className="container">
        <Typography variant="h5" sx={{ mb: 5 }}>Sign in</Typography>
        <form onSubmit={handleLogin}>
          <TextField
            label="Email"
            onChange={e => setEmail(e.target.value)}
            variant="outlined"
            sx={{ mb: 4 }}
            type="email"
            required
          />
          <TextField
            label="Password"
            onChange={e => setPassword(e.target.value)}
            variant="outlined"
            type="password"
            sx={{ mb: 0.5 }}
            required
          />
          <Box component="span" sx={{ textAlign: 'right', mb: 3.5 }}>
            <Typography
              variant="p"
              component={Link}
              to=""
              sx={{ mb: 3, }}>
              Forgot password?
            </Typography>
          </Box>
          <LoadingButton
            loading={isLoading}
            disabled={isLoading}
            fullWidth
            variant="contained"
            type="submit">
            Sign in
          </LoadingButton>
        </form>
      </Paper>
      <Snackbar
        isOpen={isOpen}
        type={type}
        message={message}
      />
    </div>
  )
};
