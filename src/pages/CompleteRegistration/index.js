import { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import { Link } from "react-router-dom";
import Snackbar from "../../components/core/Snackbar";
import useSnackbar from "../../hooks/useSnackbar";
import { completeRegistration } from '../../api/users';

export default function CompleteRegistrationPage() {
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);

  const clientId = queryParams.get('clientId');
  const email = queryParams.get('email');

  const password = useRef();
  const [isLoading, setLoading] = useState(false);

  const {
    isOpen,
    openSnackBar,
    type,
    message
  } = useSnackbar();

  const navigate = useNavigate();

  const handleCompleteRegistration = async e => {
    e.preventDefault();

    const passwordVal = password.current.value;

    if (!passwordVal) {
      openSnackBar('Please enter all required fields above.', 'error');
      return;
    }

    setLoading(true);

    const { success, message } = await completeRegistration({
      password: passwordVal,
      clientId,
      email
    });

    if (success) {
      openSnackBar('Registration completed successfully.', 'success');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } else {
      setLoading(false);
      openSnackBar(message, 'error');
    }
  };

  return (
    <Box
      height={'100vh'}
      width='100%'
      textAlign='center'
      className="flex-centered"
      alignItems='center'>
      <Paper sx={{
        p: 8,
        width: '550px',
      }}>
        <Typography variant="h5" sx={{ mb: 1 }}>Complete Account Registration</Typography>
        <Typography variant="body2" sx={{ mb: 5 }}>
          Please enter the password that you will use to sign in to the platform.
        </Typography>
        <form onSubmit={handleCompleteRegistration}>
          <TextField
            fullWidth
            placeholder="Create Password"
            variant="outlined"
            type="password"
            sx={{ mb: 5 }}
            autoFocus
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
            Complete Registration
          </LoadingButton>
        </form>
        <Box component="span" sx={{ textAlign: 'right' }}>
          <Typography
            variant="p"
            component={Link}
            to="/login">
            Already completed?  Sign in here.
          </Typography>
        </Box>
      </Paper>
      <Snackbar
        isOpen={isOpen}
        type={type}
        message={message}
      />
    </Box>
  );
};
