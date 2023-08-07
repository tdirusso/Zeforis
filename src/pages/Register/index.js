/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Snackbar from "../../components/core/Snackbar";
import useSnackbar from "../../hooks/useSnackbar";
import './Register.css';
import { register } from '../../api/users';
import zeforisLogo from '../../assets/zeforis-logo.png';
import { Button, Divider } from "@mui/material";
import InputAdornment from '@mui/material/InputAdornment';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import VpnKeyIcon from '@mui/icons-material/VpnKey';

export default function RegisterPage() {
  const email = useRef();
  const password = useRef();
  const firstName = useRef();
  const lastName = useRef();
  const [isLoading, setLoading] = useState(false);

  const {
    isOpen,
    openSnackBar,
    type,
    message
  } = useSnackbar();

  const navigate = useNavigate();

  const handleGoogleRegistration = authResponse => {
    if (authResponse.credential) {
      setLoading(true);

      setTimeout(async () => {
        const { success, message } = await register({
          googleCredential: authResponse.credential
        });

        if (success) {
          openSnackBar('Registration successful.', 'success');
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
        } else {
          setLoading(false);
          openSnackBar(message, 'error');
        }
      }, 1000);
    } else {
      openSnackBar('Error signing in with Google (missing credential).');
    }
  };

  const initializeGoogleButton = () => {
    window.google.accounts.id.initialize({
      client_id: process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID,
      callback: handleGoogleRegistration
    });

    window.google.accounts.id.renderButton(
      document.getElementById('google-signin'),
      {
        theme: "outline",
        size: "large",
        width: 325,
        text: 'signup_with'
      }
    );
  };

  const handleRegistration = e => {
    e.preventDefault();

    const emailVal = email.current.value;
    const passwordVal = password.current.value;
    const firstNameVal = firstName.current.value;
    const lastNameVal = lastName.current.value;

    if (!emailVal || !passwordVal || !firstNameVal || !lastNameVal) {
      openSnackBar('Please enter all required fields above.', 'error');
      return;
    }

    setLoading(true);

    setTimeout(async () => {
      const { success, message } = await register({
        email: emailVal,
        password: passwordVal,
        firstName: firstNameVal,
        lastName: lastNameVal
      });

      if (success) {
        navigate('/register-success');
      } else {
        setLoading(false);
        openSnackBar(message, 'error');
      }
    }, 1000);
  };

  useEffect(() => {
    if (document.readyState === 'complete') {
      initializeGoogleButton();
    } else {
      window.onload = initializeGoogleButton;
    }
  }, []);

  return (
    <Box className="Login flex-centered">
      <Box component="header">
        <Box component="a" href="https://www.zeforis.com" target="_blank">
          <img src={zeforisLogo} alt="Zeforis" height={30} />
        </Box>
        <Box display="flex" alignItems="center">
          <Box mr={1.5}>Already have an account?</Box>
          <Button
            variant="contained"
            component={'a'}
            href='/login'
            size="large">
            Sign In
          </Button>
        </Box>
      </Box>
      <Paper style={{ padding: '4rem', paddingTop: '2.5rem' }} className="container">
        <Typography variant="h5" style={{ marginBottom: '1.75rem' }}>Sign Up</Typography>
        <form onSubmit={handleRegistration} >
          <TextField
            placeholder="First name"
            variant="outlined"
            inputRef={firstName}
            disabled={isLoading}
            autoComplete="off"
            style={{ marginBottom: '1rem' }}
            autoFocus
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircleIcon htmlColor="#cbcbcb" />
                </InputAdornment>
              )
            }}
          />
          <TextField
            placeholder="Last name"
            variant="outlined"
            inputRef={lastName}
            disabled={isLoading}
            autoComplete="off"
            style={{ marginBottom: '2.5rem' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircleIcon htmlColor="#cbcbcb" />
                </InputAdornment>
              )
            }}
          />

          <TextField
            placeholder="Email"
            variant="outlined"
            style={{ marginBottom: '1rem' }}
            type="email"
            inputRef={email}
            disabled={isLoading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MailOutlineIcon htmlColor="#cbcbcb" />
                </InputAdornment>
              )
            }}
          />
          <TextField
            placeholder="Password"
            variant="outlined"
            type="password"
            style={{ marginBottom: '2.5rem' }}
            inputRef={password}
            disabled={isLoading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <VpnKeyIcon htmlColor="#cbcbcb" />
                </InputAdornment>
              )
            }}
          />
          <LoadingButton
            loading={isLoading}
            disabled={isLoading}
            fullWidth
            variant="contained"
            type="submit"
            size="large"
            style={{ marginBottom: '2rem' }}>
            Create Account
          </LoadingButton>
        </form>
        <Divider style={{ marginBottom: '2rem' }} />
        <Box id="google-signin"></Box>
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
