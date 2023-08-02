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
import { Button, Divider, createTheme } from "@mui/material";
import InputAdornment from '@mui/material/InputAdornment';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import Loader from "../../components/core/Loader";
import { getOrg, setActiveOrgId } from "../../api/orgs";
import { hexToRgb } from "../../lib/utils";
import themeConfig from "../../theme";

export default function LoginPage({ setTheme }) {
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);

  const [doneFetchingCustomPage, setDoneFetchingCustomPage] = useState(false);
  const [customPageData, setCustomPageData] = useState(null);
  const [isLoading, setLoading] = useState(false);

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

  const navigate = useNavigate();

  const handleGoogleLogin = async (authResponse) => {
    if (authResponse.credential) {
      setLoading(true);

      try {
        const result = await login({
          googleCredential: authResponse.credential
        });

        if (result.token) {
          if (needsCustomPage && customPageData) {
            setActiveOrgId(orgId);
          }
          navigate('/home/dashboard');
        } else {
          setLoading(false);
          openSnackBar(result.message, 'error');
        }
      } catch (error) {
        openSnackBar(error.message, 'error');
      }
    } else {
      openSnackBar('Error signing in with Google (missing credential).');
    }
  };

  const initializeGoogleButton = () => {
    window.google.accounts.id.initialize({
      client_id: process.env.REACT_APP_GOOGLE_OATH_CLIENT_ID,
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
      <Paper sx={{ p: 8, pt: 5 }} className="container">
        <Typography variant="h5" sx={{ mb: 5 }}>
          Sign in
        </Typography>
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
      <Box
        hidden={!needsCustomPage}
        component="a"
        href="/login"
        sx={{ fontSize: '13px' }}
        mt={1}>
        Go to universal login
      </Box>
      <Box className="circle"></Box>
      {
        needsCustomPage ?
          <Box
            sx={{
              position: 'absolute',
              bottom: 10,
              right: 10,
              color: '#5f5f5f',
              display: 'flex',
              alignItems: 'center'
            }}
            component="a"
            href="https://www.zeforis.com"
            target="_blank">
            Powered by  <img src={zeforisLogo} alt="Zeforis" height={15} style={{ marginLeft: '4px' }} />
          </Box>
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