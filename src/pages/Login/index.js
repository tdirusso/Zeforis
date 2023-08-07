/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { login } from "../../api/auth";
import { useLocation } from "react-router-dom";
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Snackbar from "../../components/core/Snackbar";
import useSnackbar from "../../hooks/useSnackbar";
import zeforisLogo from '../../assets/zeforis-logo.png';
import './Login.css';
import { Button, CircularProgress, Divider, createTheme } from "@mui/material";
import InputAdornment from '@mui/material/InputAdornment';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import Loader from "../../components/core/Loader";
import { getOrg, setActiveOrgId } from "../../api/orgs";
import { hexToRgb } from "../../lib/utils";
import themeConfig from "../../theme";
import { resendVerificationLink } from "../../api/users";
import Watermark from "../../components/core/Watermark";

export default function LoginPage({ setTheme }) {
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);

  const [doneFetchingCustomPage, setDoneFetchingCustomPage] = useState(false);
  const [customPageData, setCustomPageData] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [verificationContent, setVerificationContent] = useState('');

  const email = useRef();
  const password = useRef();

  const {
    isOpen,
    openSnackBar,
    type,
    message
  } = useSnackbar();

  const customPageParam = searchParams.get('cp');
  let needsCustomPage = false;
  let orgId;

  if (customPageParam) {
    try {
      const cpParamVal = window.atob(customPageParam);
      orgId = new URLSearchParams(cpParamVal).get('orgId');
      if (orgId) {
        needsCustomPage = true;
      }
    } catch (error) { }
  }


  const handleGoogleLogin = async (authResponse) => {
    if (authResponse.credential) {
      setLoading(true);

      try {
        const result = await login({
          googleCredential: authResponse.credential,
          isFromCustomLoginPage: needsCustomPage,
          orgId
        });

        if (result.token) {
          if (needsCustomPage && customPageData) {
            setActiveOrgId(orgId);
          }
          window.location.href = '/home/dashboard';
        } else {
          setLoading(false);
          openSnackBar(result.message, 'error');
        }
      } catch (error) {
        openSnackBar(error.message, 'error');
      }
    } else {
      setLoading(false);
      openSnackBar('Error signing in with Google (missing credential).');
    }
  };

  const initializeGoogleButton = () => {
    window.google.accounts.id.initialize({
      client_id: process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID,
      callback: handleGoogleLogin
    });

    window.google.accounts.id.renderButton(
      document.getElementById('google-signin'),
      {
        theme: "outline",
        size: "large",
        width: 325
      }
    );
  };

  useEffect(() => {
    if (!needsCustomPage) {
      if (document.readyState === 'complete') {
        initializeGoogleButton();
      } else {
        window.onload = initializeGoogleButton;
      }
    } else {
      fetchCustomPageData();
    }

    if (searchParams.get('postVerify')) {
      openSnackBar('Email verified.', 'success');
    }

    async function fetchCustomPageData() {
      try {
        const { org } = await getOrg(orgId);

        if (org) {
          const brandRGB = hexToRgb(org.brand_color);
          document.documentElement.style.setProperty('--colors-primary', org.brand_color);
          document.documentElement.style.setProperty('--colors-primary-rgb', `${brandRGB.r}, ${brandRGB.g}, ${brandRGB.b}`);
          themeConfig.palette.primary.main = org.brand_color;
          setTheme(createTheme(themeConfig));
          document.title = `${org.name} Portal - Login`;
          setCustomPageData(org);
          setDoneFetchingCustomPage(true);
        } else {
          window.location.href = '/login';
        }
      } catch (error) {
        openSnackBar(error.message, 'error');
      }
    }
  }, []);

  useEffect(() => {
    if (doneFetchingCustomPage) {
      initializeGoogleButton();
    }
  }, [doneFetchingCustomPage]);

  const handleLogin = async e => {
    e.preventDefault();

    const emailVal = email.current.value;
    const passwordVal = password.current.value;

    if (!emailVal) {
      openSnackBar('Please enter a valid email address');
      return;
    }

    if (!passwordVal) {
      openSnackBar('Please enter your password');
      return;
    }

    setLoading(true);

    try {
      const result = await login({
        email: emailVal,
        password: passwordVal,
        isFromCustomLoginPage: needsCustomPage,
        orgId
      });

      if (result.unverified) {
        setLoading(false);
        setVerificationContent(unverifiedText);
      } else if (result.token) {
        if (needsCustomPage && customPageData) {
          setActiveOrgId(orgId);
        }
        window.location.href = '/home/dashboard';
      } else {
        setLoading(false);
        openSnackBar(result.message, 'error');
      }
    } catch (error) {
      openSnackBar(error.message, 'error');
    }
  };

  const handleResendVerificationLink = () => {
    const emailVal = email.current.value;

    if (!emailVal) {
      openSnackBar('Please enter a valid email address');
      return;
    }

    setVerificationContent(<CircularProgress size={20} style={{ marginTop: '0.5rem' }} />);

    setTimeout(async () => {
      try {
        const { success, message } = await resendVerificationLink({
          email: emailVal
        });

        setVerificationContent('');

        if (success) {
          openSnackBar('New verification link sent.', 'success');
        } else {
          openSnackBar(message, 'error');
        }
      } catch (error) {
        openSnackBar(error.message, 'error');
      }
    }, 1000);
  };

  const unverifiedText =
    <Typography variant="body2">
      Your email address has not been verified.
      <br></br>
      Click the verification link in your email address or
      <Button style={{ margin: '0 2px' }} size="small" onClick={handleResendVerificationLink}>click here</Button>
      to resend a verification link.
    </Typography>;

  if (needsCustomPage && !doneFetchingCustomPage) {
    return (
      <Loader />
    );
  }

  let pageIcon = <Box component="a" href="https://www.zeforis.com" target="_blank">
    <img src={zeforisLogo} alt="Zeforis" height={30} />
  </Box>;

  if (needsCustomPage) {
    if (customPageData.logo_url) {
      pageIcon = <Box>
        <img src={customPageData.logo_url} alt={customPageData.name} height={50} />
      </Box>;
    } else {
      pageIcon = <Box component="h1" color={customPageData.brand_color}>{customPageData.name}</Box>;
    }
  }

  return (
    <Box className="Login flex-centered">
      <Box component="header">
        {pageIcon}
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
      <Paper style={{ padding: '4rem', paddingTop: '2.5rem' }} className="container">
        <Typography variant="h5" style={{ marginBottom: '2.5rem' }}>
          Sign in
        </Typography>
        <form onSubmit={handleLogin}>
          <TextField
            placeholder="Email"
            variant="outlined"
            style={{ marginBottom: '2rem' }}
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
            inputRef={password}
            disabled={isLoading}
          />
          <Box component="span" style={{ textAlign: 'right', marginBottom: '1.75rem' }}>
            <Box component="a" href="/password-reset" fontSize="small">
              Forgot password?
            </Box>
          </Box>

          <LoadingButton
            loading={isLoading}
            disabled={isLoading}
            fullWidth
            size="large"
            style={{padding: '0.75rem 0.5rem'}}
            variant="contained"
            type="submit">
            Sign in
          </LoadingButton>
          <Box mt={1} hidden={!Boolean(verificationContent)}>
            {verificationContent}
          </Box>
          <Divider className="my4" />
          <Box id="google-signin"></Box>
        </form>
      </Paper>
      <Box
        hidden={!needsCustomPage}
        component="a"
        href="/login"
        style={{ fontSize: '13px' }}
        mt={1}>
        Go to universal login
      </Box>
      <Box className="circle"></Box>
      {
        needsCustomPage ?
          <Watermark positionStyle={{ bottom: 10, right: 10, position: 'absolute' }} />
          : null
      }
      <Snackbar
        isOpen={isOpen}
        type={type}
        message={message}
      />
    </Box>
  );
};