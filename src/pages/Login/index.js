/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { login } from "../../api/auth";
import { useLocation, useNavigate } from "react-router-dom";
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import { Link } from "react-router-dom";
import Snackbar from "../../components/core/Snackbar";
import useSnackbar from "../../hooks/useSnackbar";
import './Login.css';

export default function LoginPage() {
  const email = useRef();
  const password = useRef();
  const [isLoading, setLoading] = useState(false);
  const { search } = useLocation();

  const {
    isOpen,
    openSnackBar,
    type,
    message
  } = useSnackbar();

  const navigate = useNavigate();

  useEffect(() => {
    if (new URLSearchParams(search).get('postVerify')) {
      openSnackBar('Email successfuly verified.', 'success');
    }
  }, []);


  const handleLogin = e => {
    e.preventDefault();

    const emailVal = email.current.value;
    const passwordVal = password.current.value;

    if (!emailVal) {
      openSnackBar('Please enter a valid email address', 'error');
      return;
    }

    if (!passwordVal) {
      openSnackBar('Please enter your password', 'error');
      return;
    }

    setLoading(true);

    setTimeout(async () => {
      const result = await login({
        email: emailVal,
        password: passwordVal
      });

      if (result.token) {
        navigate('/home/dashboard');
      } else {
        setLoading(false);
        openSnackBar(result.message, 'error');
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
            variant="outlined"
            sx={{ mb: 4 }}
            type="email"
            required
            inputRef={email}
            disabled={isLoading}
            autoFocus
          />
          <TextField
            label="Password"
            variant="outlined"
            type="password"
            sx={{ mb: 0.5 }}
            required
            inputRef={password}
            disabled={isLoading}
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
      <Typography
        variant="p"
        component={Link}
        to="/register"
        sx={{ mt: 3 }}>
        No account?  Register here.
      </Typography>
      <Snackbar
        isOpen={isOpen}
        type={type}
        message={message}
      />
    </div>
  );
};