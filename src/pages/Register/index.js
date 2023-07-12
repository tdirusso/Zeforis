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
          width: '325',
          text: 'signup_with'
        }
      );
    };
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
      <Paper sx={{ p: 8, pt: 5 }} className="container">
        <Typography variant="h5" sx={{ mb: 5 }}>Sign Up</Typography>
        <form onSubmit={handleRegistration} >
          <TextField
            placeholder="First name"
            variant="outlined"
            inputRef={firstName}
            disabled={isLoading}
            autoComplete="off"
            sx={{ mb: 2 }}
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
            sx={{ mb: 5 }}
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
            sx={{ mb: 2 }}
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
            sx={{ mb: 5 }}
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
            sx={{ mb: 4 }}>
            Create Account
          </LoadingButton>
        </form>
        <Divider sx={{ mb: 4 }} />
        <Box id="google-signin"></Box>
      </Paper>
      <Box className="circle"></Box>
      <Snackbar
        isOpen={isOpen}
        type={type}
        message={message}
      />
    </Box>


    // <div className="Register flex-centered">
    //   <Paper sx={{ p: 8, pt: 5 }} className="container">
    //     <Typography variant="h5" sx={{ mb: 5 }}>Create an Account</Typography>
    //     <form onSubmit={handleRegistration} >
    //       <Box sx={{ display: 'flex', mb: 4 }}>
    //         <TextField
    //           label="First name"
    //           variant="outlined"
    //           sx={{ mr: 1 }}
    //           required
    //           inputRef={firstName}
    //           disabled={isLoading}
    //           autoComplete="off"
    //         />
    //         <TextField
    //           label="Last name"
    //           variant="outlined"
    //           sx={{ ml: 1 }}
    //           required
    //           inputRef={lastName}
    //           disabled={isLoading}
    //           autoComplete="off"
    //         />
    //       </Box>
    //       <TextField
    //         label="Email"
    //         variant="outlined"
    //         sx={{ mb: 4 }}
    //         type="email"
    //         required
    //         inputRef={email}
    //         disabled={isLoading}
    //       />
    //       <TextField
    //         label="Password"
    //         variant="outlined"
    //         type="password"
    //         sx={{ mb: 5 }}
    //         required
    //         inputRef={password}
    //         disabled={isLoading}
    //       />
    //       <LoadingButton
    //         loading={isLoading}
    //         disabled={isLoading}
    //         fullWidth
    //         variant="contained"
    //         type="submit"
    //         size="large"
    //         sx={{ mb: 4 }}>
    //         Create Account
    //       </LoadingButton>
    //     </form>
    //     <Box component="span" sx={{ textAlign: 'right' }}>
    //       <Typography
    //         variant="p"
    //         component={Link}
    //         to="/login">
    //         Have an account?  Sign in here.
    //       </Typography>
    //     </Box>
    //   </Paper>
    //   <Snackbar
    //     isOpen={isOpen}
    //     type={type}
    //     message={message}
    //   />
    // </div>
  );
};
