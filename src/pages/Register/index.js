import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import { Link } from "react-router-dom";
import Snackbar from "../../components/core/Snackbar";
import useSnackbar from "../../hooks/useSnackbar";
import './Register.css';
import {register} from '../../api/account';

export default function RegisterPage() {
  const email = useRef();
  const password = useRef();
  const firstName = useRef();
  const lastName = useRef();
  const orgName = useRef();
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
    const orgNameVal = orgName.current.value;

    if (!emailVal || !passwordVal || !firstNameVal || !lastNameVal || !orgNameVal) {
      openSnackBar('Please enter all required fields above.', 'error');
      return;
    }

    setLoading(true);

    setTimeout(async () => {
      const { success, message } = await register({
        email: emailVal,
        password: passwordVal,
        orgName: orgNameVal,
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

  return (
    <div className="Register flex-centered">
      <Paper sx={{ p: 8, pt: 5 }} className="container">
        <Typography variant="h5" sx={{ mb: 5 }}>Create an Account</Typography>
        <form onSubmit={handleRegistration} >
          <Box sx={{ display: 'flex', mb: 4 }}>
            <TextField
              label="First name"
              variant="outlined"
              sx={{ mr: 1 }}
              required
              inputRef={firstName}
              disabled={isLoading}
              autoComplete="off"
            />
            <TextField
              label="Last name"
              variant="outlined"
              sx={{ ml: 1 }}
              required
              inputRef={lastName}
              disabled={isLoading}
              autoComplete="off"
            />
          </Box>
          <TextField
            label="Org / Company name"
            variant="outlined"
            sx={{ mb: 4 }}
            required
            inputRef={orgName}
            disabled={isLoading}
            autoComplete="off"
          />
          <TextField
            label="Email"
            variant="outlined"
            sx={{ mb: 4 }}
            type="email"
            required
            inputRef={email}
            disabled={isLoading}
          />
          <TextField
            label="Password"
            variant="outlined"
            type="password"
            sx={{ mb: 5 }}
            required
            inputRef={password}
            disabled={isLoading}
          />
          <LoadingButton
            loading={isLoading}
            disabled={isLoading}
            fullWidth
            variant="contained"
            type="submit"
            sx={{ mb: 4 }}>
            Create Account
          </LoadingButton>
        </form>
        <Box component="span" sx={{ textAlign: 'right' }}>
          <Typography
            variant="p"
            component={Link}
            to="/login">
            Have an account?  Sign in here.
          </Typography>
        </Box>
      </Paper>
      <Snackbar
        isOpen={isOpen}
        type={type}
        message={message}
      />
    </div>
  );
};
