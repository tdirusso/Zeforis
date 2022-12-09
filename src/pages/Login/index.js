/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { login } from "../../api/auth";
import { useLocation, useNavigate } from "react-router-dom";
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import Snackbar from "../../components/core/Snackbar";
import useSnackbar from "../../hooks/useSnackbar";
import BuildIcon from '@mui/icons-material/Build';
import CloudIcon from '@mui/icons-material/Cloud';
import './Login.css';

export default function LoginPage() {
  const email = useRef();
  const password = useRef();
  const [isLoading, setLoading] = useState(false);
  const [showedVerified, setShowedVerified] = useState(false);
  const [loginType, setLoginType] = useState('');

  const {
    isOpen,
    openSnackBar,
    type,
    message
  } = useSnackbar();

  const navigate = useNavigate();

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
        password: passwordVal,
        loginType
      });

      if (result.token) {
        navigate(result.redirectUrl);
      } else {
        setLoading(false);
        openSnackBar(result.message, 'error');
      }
    }, 1000);
  };

  if (!loginType) {
    return <ChooseLoginType
      setLoginType={setLoginType}
      showedVerified={showedVerified}
      setShowedVerified={setShowedVerified}
    />;
  }

  return (
    <div className="Login flex-centered">
      <Paper sx={{ p: 8, pt: 5 }} className="container">
        <Typography variant="h5" sx={{ mb: 1 }}>Sign in</Typography>
        <Typography variant="body1" sx={{ mb: 2 }} color="primary" className="flex-centered">
          {loginType === 'admin' ?
            <BuildIcon fontSize="small" sx={{ mr: 0.5 }} /> :
            <CloudIcon fontSize="small" sx={{ mr: 0.5 }} />}
          {loginType === 'admin' ?
            'Administrator Portal' :
            'Client Portal'}
        </Typography>
        <Button
          sx={{ mb: 5 }}
          variant="outlined"
          onClick={() => setLoginType('')}>
          Change Environment
        </Button >
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

function ChooseLoginType({ setLoginType, showedVerified, setShowedVerified }) {
  const { search } = useLocation();

  const {
    isOpen,
    openSnackBar,
    type,
    message
  } = useSnackbar();

  useEffect(() => {
    if (!showedVerified) {
      if (new URLSearchParams(search).get('postVerify')) {
        openSnackBar('Email successfuly verified.', 'success');
        setShowedVerified(true);
      }
    }
  }, []);

  return (
    <div className="Login flex-centered">
      <Paper sx={{ p: 8, pt: 5 }} className="container">
        <Typography variant="body1">Please choose the appropriate environment.</Typography>
        <Box sx={{ mt: 6 }}>
          <Button
            variant="outlined"
            sx={{ mb: 2 }}
            size="large"
            onClick={() => setLoginType('admin')}
            startIcon={<BuildIcon fontSize="large" />}>
            Administrator Portal
          </Button>
          <br></br>
          <Button
            variant="outlined"
            size="large"
            sx={{ mb: 6 }}
            onClick={() => setLoginType('client')}
            startIcon={<CloudIcon fontSize="large" />}>
            Client Portal
          </Button>
          <br></br>
          <Typography
            variant="p"
            component={Link}
            to="/register">
            No account?  Register here.
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
}