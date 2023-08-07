/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Snackbar from "../../components/core/Snackbar";
import useSnackbar from "../../hooks/useSnackbar";
import { updatePassword, getInvitationData, register } from '../../api/users';
import zeforisLogo from '../../assets/zeforis-logo.png';
import { Button, CircularProgress, Divider } from "@mui/material";
import InputAdornment from '@mui/material/InputAdornment';
import VpnKeyIcon from '@mui/icons-material/VpnKey';

export default function AcceptInvitationPage() {
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);

  const engagementId = queryParams.get('engagementId');
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

  useEffect(() => {
    setTimeout(() => {
      if (engagementId && userId && invitationCode) {
        fetchInvitationData();
      } else {
        setFetchingInvitation(false);
      }
    }, 1000);

    async function fetchInvitationData() {
      try {
        const { invitation } = await getInvitationData({
          userId,
          engagementId,
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

            setTimeout(() => {
              window.google.accounts.id.initialize({
                client_id: process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID,
                callback: handleGoogleRegistration
              });

              window.google.accounts.id.renderButton(
                document.getElementById('google-signin'),
                {
                  theme: "outline",
                  size: "large",
                  width: 372,
                  text: 'continue_with'
                }
              );
            }, 0);
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
        engagementId,
        userId,
        invitationCode,
        type: 'complete-registration'
      });

      if (success) {
        openSnackBar('Registration successful.', 'success');
        setTimeout(() => {
          window.location.href = ('/login');
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

  if (userNeedsPassword === null) {
    return (
      <div className="Login flex-centered">
        <header>
          <Box component="a" href="https://www.zeforis.com" target="_blank">
            <img src={zeforisLogo} alt="Zeforis" height={30} />
          </Box>
        </header>

        {
          fetchingInvitation ? <Box>
            <Typography mb={2}>Fetching invitation...</Typography>
            <CircularProgress />
          </Box>
            :
            <Paper style={{ padding: '2.5rem', minWidth: '500px' }} className="container">
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
            component={'a'}
            href="/login"
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
          <Paper style={{ padding: '4rem', paddingTop: '2.5rem', minWidth: '500px' }} className="container">
            <Typography variant="h6" style={{ marginBottom: '1.5rem' }}>Complete Account Registration</Typography>
            <form onSubmit={handleUpdatePassword}>
              <TextField
                placeholder="Password"
                variant="outlined"
                style={{ marginBottom: '2rem' }}
                type="password"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <VpnKeyIcon htmlColor="#cbcbcb" />
                    </InputAdornment>
                  )
                }}
                inputRef={password}
                disabled={isLoading}
                autoFocus
              />
              <LoadingButton
                loading={isLoading}
                disabled={isLoading}
                fullWidth
                size="large"
                style={{ padding: '0.75rem 0' }}
                variant="contained"
                type="submit">
                Create Password
              </LoadingButton>
              <Divider className="my4">Or</Divider>
              <Box id="google-signin"></Box>
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