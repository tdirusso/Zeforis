import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import { Link } from "react-router-dom";
import Snackbar from "../../components/core/Snackbar";
import useSnackbar from "../../hooks/useSnackbar";
import { updatePassword, getInvitationData } from '../../api/users';
import zeforisLogo from '../../assets/zeforis-logo.png';
import { Button, CircularProgress } from "@mui/material";

export default function AcceptInvitationPage() {
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);

  const clientId = queryParams.get('clientId');
  const invitationCode = queryParams.get('invitationCode');
  const userId = queryParams.get('userId');

  const password = useRef();

  const [fetchingInvitation, setFetchingInvitation] = useState(true);
  const [userNeedsPassword, setUserNeedsPassword] = useState(null);
  const [isLoading, setLoading] = useState(false);

  const {
    isOpen,
    openSnackBar,
    type,
    message
  } = useSnackbar();

  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      if (clientId && userId && invitationCode) {
        fetchInvitationData();
      } else {
        setFetchingInvitation(false);
      }
    }, 1000);

    async function fetchInvitationData() {
      try {
        const { invitation } = await getInvitationData({
          userId,
          clientId,
          invitationCode
        });

        if (invitation) {
          if (!Boolean(invitation.userNeedsPassword)) {
            openSnackBar('Invitation accepted.', 'success');
            setTimeout(() => {
              window.location.href = '/login';
            }, 1000);
          } else {
            setUserNeedsPassword(true);
            setFetchingInvitation(false);
          }
        } else {
          setFetchingInvitation(false);
        }
      } catch (error) {
        openSnackBar(error.message, 'error');
        setFetchingInvitation(false);
      }
    }
  }, []);

  const handleUpdatePassword = async e => {
    e.preventDefault();

    const passwordVal = password.current.value;

    if (!passwordVal) {
      openSnackBar('Please enter a password.');
      return;
    }

    setLoading(true);

    try {
      const { success, message } = await updatePassword({
        password: passwordVal,
        clientId,
        userId,
        invitationCode,
        resetType: 'invitation'
      });

      if (success) {
        openSnackBar('Registration successful.', 'success');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setLoading(false);
        openSnackBar(message, 'error');
      }
    } catch (error) {
      setLoading(false);
      openSnackBar(error.message, 'error');
    }
  };

  if (userNeedsPassword === null) {
    return (
      <div className="Login flex-centered">
        <header>
          <Box component="a" href="https://www.zeforis.com" target="_blank">
            <img src={zeforisLogo} alt="Zeforis" height={30} />
          </Box>
          <Box display="flex" alignItems="center">
            <Box mr={1.5}>Already have an account?</Box>
            <Button
              variant="contained"
              component={Link}
              to="/login"
              size="large">
              Sign In
            </Button>
          </Box>
        </header>

        {
          fetchingInvitation ? <Box>
            <Typography mb={2}>Fetching invitation...</Typography>
            <CircularProgress />
          </Box>
            :
            <Paper sx={{ p: 5, minWidth: '500px' }} className="container">
              <Typography>No invitation was found.</Typography>
            </Paper>
        }
        <div className="circle"></div>
      </div>
    );
  }

  return (
    <div className="Login flex-centered">
      <header>
        <Box component="a" href="https://www.zeforis.com" target="_blank">
          <img src={zeforisLogo} alt="Zeforis" height={30} />
        </Box>
        <Box display="flex" alignItems="center">
          <Box mr={1.5}>Already have an account?</Box>
          <Button
            variant="contained"
            disabled={isLoading}
            component={Link}
            to="/login"
            size="large">
            Sign In
          </Button>
        </Box>
      </header>

      {
        fetchingInvitation ? <Box>
          <Typography mb={2}>Fetching invitation...</Typography>
          <CircularProgress />
        </Box>
          :
          <Paper sx={{ p: 8, pt: 5, minWidth: '500px' }} className="container">
            <Typography variant="h5" sx={{ mb: 2 }}>Complete Account Registration</Typography>
            <Typography sx={{ mb: 4 }}>Please create a password that will be used to sign in.</Typography>
            <form onSubmit={handleUpdatePassword}>
              <TextField
                placeholder="Password"
                variant="outlined"
                sx={{ mb: 4 }}
                type="password"
                InputProps={{ required: true }}
                inputRef={password}
                disabled={isLoading}
                autoFocus
              />
              <LoadingButton
                loading={isLoading}
                disabled={isLoading}
                fullWidth
                size="large"
                sx={{ py: 1.3 }}
                variant="contained"
                type="submit">
                Create Password
              </LoadingButton>
            </form>
          </Paper>
      }

      <div className="circle"></div>
      <Snackbar
        isOpen={isOpen}
        type={type}
        message={message}
      />
    </div>
  );
};