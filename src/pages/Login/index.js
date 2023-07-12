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
import zeforisLogo from '../../assets/zeforis-logo.png';
import './Login.css';
import { Button, Divider } from "@mui/material";
import InputAdornment from '@mui/material/InputAdornment';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import VpnKeyIcon from '@mui/icons-material/VpnKey';

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

    function handleCredentialResponse(response) {
      console.log("Encoded JWT ID token: " + response.credential);
    }

    window.onload = function () {
      window.google.accounts.id.initialize({
        client_id: process.env.REACT_APP_GOOGLE_OATH_CLIENT_ID,
        callback: handleCredentialResponse
      });

      window.google.accounts.id.renderButton(
        document.getElementById('google-signin'),
        {
          theme: "outline",
          size: "large",
          width: '325'
        }
      );
    };

  }, []);


  const handleLogin = async e => {
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

    try {
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
    } catch (error) {
      openSnackBar(error.message, 'error');
    }
  };

  return (
    <Box className="Login flex-centered">
      <Box component="header">
        <Box component="a" href="https://www.zeforis.com" target="_blank">
          <img src={zeforisLogo} alt="Zeforis" height={30} />
        </Box>
        <Box display="flex" alignItems="center">
          <Box mr={1.5}>Don't have an account?</Box>
          <Button
            variant="contained"
            component={'a'}
            href="/register"
            size="large">
            Sign Up
          </Button>
        </Box>
      </Box>
      <Paper sx={{ p: 8, pt: 5 }} className="container">
        <Typography variant="h5" sx={{ mb: 5 }}>Sign in</Typography>
        <form onSubmit={handleLogin}>
          <TextField
            placeholder="Email"
            variant="outlined"
            sx={{ mb: 4 }}
            type="email"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MailOutlineIcon htmlColor="#cbcbcb" />
                </InputAdornment>
              )
            }}
            inputRef={email}
            disabled={isLoading}
            autoFocus
          />
          <TextField
            placeholder="Password"
            variant="outlined"
            type="password"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <VpnKeyIcon htmlColor="#cbcbcb" />
                </InputAdornment>
              )
            }}
            sx={{ mb: 0.5 }}
            inputRef={password}
            disabled={isLoading}
          />
          <Box component="span" sx={{ textAlign: 'right', mb: 3.5 }}>
            <Typography
              variant="body2"
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
            size="large"
            sx={{ py: 1.3 }}
            variant="contained"
            type="submit">
            Sign in
          </LoadingButton>
          <Divider sx={{ mt: 4, mb: 4 }} />
          <Box id="google-signin"></Box>
        </form>
      </Paper>
      <Box className="circle"></Box>
      <Snackbar
        isOpen={isOpen}
        type={type}
        message={message}
      />
    </Box>
  );
};