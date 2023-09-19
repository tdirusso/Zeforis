/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from "react";
import { useLocation } from "react-router-dom";
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Snackbar from "../../components/core/Snackbar";
import useSnackbar from "../../hooks/useSnackbar";
import zeforisLogo from '../../assets/zeforis-logo.png';
import { sendPasswordResetLink, updatePassword } from "../../api/users";
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { isMobile } from "../../lib/constants";
import { Button } from "@mui/material";

export default function PasswordResetPage() {
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);

  const email = searchParams.get('email');
  const resetCode = searchParams.get('resetCode');

  const {
    isOpen,
    openSnackBar,
    type,
    message
  } = useSnackbar();

  return (
    <Box className="info-page flex-centered">
      <Box component="header">
        <Box component="a" href="https://www.zeforis.com" target="_blank">
          <img src={zeforisLogo} alt="Zeforis" className="header-logo" />
        </Box>
        <a href='/login'>
          <Button size="large" startIcon={<ArrowBackRoundedIcon />}>
            Back to login
          </Button>
        </a>
      </Box>
      <Paper className="container">
        <Typography variant="h5" style={{ marginBottom: '2.5rem' }}>
          Password Reset
        </Typography>
        {
          !email || !resetCode ?
            <PasswordResetStep1
              openSnackBar={openSnackBar}
            /> :
            <PasswordResetStep2
              openSnackBar={openSnackBar}
              email={email}
              resetCode={resetCode}
            />
        }
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

function PasswordResetStep1({ openSnackBar }) {
  const [isSendingResetLink, setSendingResetLink] = useState(false);
  const [sentResetLink, setSentResetLink] = useState(false);
  const [email, setEmail] = useState('');

  const handleSendPasswordResetLink = e => {
    e.preventDefault();

    if (!email) {
      openSnackBar('Please enter your email address.');
      return;
    }

    setSendingResetLink(true);

    setTimeout(async () => {
      try {
        const { success, message, isLinkPending } = await sendPasswordResetLink({
          email
        });

        if (success) {
          if (isLinkPending) {
            openSnackBar('Reset link already sent - once expired, you can try again.');
          } else {
            setSentResetLink(true);
          }
        } else {
          setSendingResetLink(true);
          openSnackBar(message, 'error');
        }
      } catch (error) {
        openSnackBar(error.message, 'error');
        setSendingResetLink(false);
      }
    }, 1000);
  };

  return (
    <>
      <form onSubmit={handleSendPasswordResetLink} hidden={sentResetLink}>
        <TextField
          placeholder="Email"
          variant="outlined"
          style={{ marginBottom: '2rem' }}
          type="email"
          onChange={e => setEmail(e.target.value)}
          disabled={isSendingResetLink}
          autoFocus={!isMobile}
        />

        <LoadingButton
          loading={isSendingResetLink}
          fullWidth
          size="large"
          style={{ padding: '0.75rem 0.5rem' }}
          variant="contained"
          startIcon={<SendRoundedIcon />}
          type="submit">
          Send reset link
        </LoadingButton>
      </form>
      <Typography className="flex-ac" hidden={!sentResetLink}>
        <CheckCircleRoundedIcon htmlColor="#4caf50" />
        &nbsp;Password reset link successfully sent.
      </Typography>
    </>
  );
}

function PasswordResetStep2({ openSnackBar, email, resetCode }) {
  const [password, setPassword] = useState('');
  const [isResettingPassword, setResettingPassword] = useState(false);
  const [passwordReset, setPasswordReset] = useState(false);

  const handleResetPassword = e => {
    e.preventDefault();

    if (!email || !resetCode) {
      openSnackBar('Error processing request.');
      return;
    }

    if (!password) {
      openSnackBar('Please enter your password.');
      return;
    }

    setResettingPassword(true);

    setTimeout(async () => {
      try {
        const { success, message } = await updatePassword({
          email,
          password,
          resetCode,
          type: 'reset'
        });

        if (success) {
          setPasswordReset(true);
        } else {
          setResettingPassword(false);
          openSnackBar(message);
        }
      } catch (error) {
        openSnackBar(error.message, 'error');
        setResettingPassword(false);
      }
    }, 1000);
  };

  return (
    <>
      <form onSubmit={handleResetPassword} hidden={passwordReset}>
        <TextField
          placeholder="New password"
          variant="outlined"
          type="password"
          style={{ marginBottom: '2rem' }}
          disabled={isResettingPassword}
          autoFocus={!isMobile}
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <LoadingButton
          loading={isResettingPassword}
          fullWidth
          size="large"
          style={{ padding: '0.75rem 0.5rem' }}
          variant="contained"
          startIcon={<SendRoundedIcon />}
          type="submit">
          Reset password
        </LoadingButton>
      </form>
      <Typography className="flex-centered" hidden={!passwordReset}>
        <CheckCircleRoundedIcon htmlColor="#4caf50" />
        &nbsp;Password successfully reset.
      </Typography>
      <Box mt={2}>
        <Box component='a' href="/login">
          <Button size="large" variant="contained">
            Return to login
          </Button>
        </Box>
      </Box>
    </>
  );
}
