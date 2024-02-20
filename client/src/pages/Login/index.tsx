import { SyntheticEvent, useEffect, useState } from "react";
import { login } from "../../api/auth";
import { Link, useLocation } from "react-router-dom";
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Snackbar from "../../components/core/Snackbar";
import useSnackbar from "../../hooks/useSnackbar";
import zeforisLogo from '../../assets/zeforis-logo.png';
import './styles.scss';
import { Button, Divider, Paper, Theme, createTheme, useMediaQuery } from "@mui/material";
import Loader from "../../components/core/Loader";
import { getOrg, setActiveOrgId } from "../../api/orgs";
import { hexToRgb } from "../../lib/utils";
import themeConfig from "../../theme";
import Watermark from "../../components/core/Watermark";
import { isMobile } from "../../lib/constants";
import { setActiveEngagementId } from "../../api/engagements";
import validator from 'email-validator';

type OrgType = {
  name: string,
  logo_url: string | null,
  brand_color: string;
};

type FormErrorsType = {
  email?: string;
};

export default function LoginPage({ setTheme }: { setTheme: (theme: Theme) => void; }) {
  const { search } = useLocation();

  const isSmallScreen = useMediaQuery('(max-width: 500px)');
  const formWidth = isSmallScreen ? 300 : 425;

  const searchParams = new URLSearchParams(search);

  const [email, setEmail] = useState('');
  const [formErrors, setFormErrors] = useState<FormErrorsType>({});
  const [doneFetchingCustomPage, setDoneFetchingCustomPage] = useState(false);
  const [org, setOrg] = useState<OrgType | null>(null);
  const [isLoading, setLoading] = useState(false);

  const {
    isOpen,
    openSnackBar,
    type,
    message
  } = useSnackbar();

  const customPageParam = searchParams.get('cp');
  const engagementIdParam = searchParams.get('engagementId');
  let needsCustomPage = false;
  let orgId: number;

  if (customPageParam) {
    try {
      const cpParamVal = window.atob(customPageParam);
      orgId = Number(new URLSearchParams(cpParamVal).get('orgId'));

      if (orgId) {
        needsCustomPage = true;
      }
    } catch (error) { }
  }

  const handleGoogleLogin = async (authResponse: { credential: string; }) => {
    if (authResponse.credential) {
      setFormErrors({});
      setLoading(true);

      try {
        const result = await login({
          googleCredential: authResponse.credential,
          isFromCustomLoginPage: needsCustomPage,
          orgId
        });

        if (result.token) {
          if (needsCustomPage && org) {
            if (engagementIdParam) {
              setActiveEngagementId(Number(engagementIdParam));
            }
            setActiveOrgId(orgId);
          }
          window.location.href = '/home/dashboard';
        } else {
          setLoading(false);
          openSnackBar(result.message, 'error');
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          openSnackBar(error.message, 'error');
          setLoading(false);
        }
      }
    } else {
      setLoading(false);
      openSnackBar('Error signing in with Google (missing credential).');
    }
  };

  const tryLoadGoogleButton = () => {
    if (window.google?.accounts) {
      clearInterval(window.googleButtonInterval);
      window.google.accounts.id.initialize({
        client_id: process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID,
        callback: handleGoogleLogin
      });

      window.google.accounts.id.renderButton(
        document.getElementById('google-signin'),
        {
          theme: "outline",
          size: "large",
          width: isSmallScreen ? 300 : 325,
          text: 'continue_with'
        }
      );

      return true;
    }

    return false;
  };

  useEffect(() => {
    if (!needsCustomPage) {
      const ableToLoadButton = tryLoadGoogleButton();
      if (!ableToLoadButton) {
        window.googleButtonInterval = setInterval(tryLoadGoogleButton, 1000);
      }

      window.VANTA?.TOPOLOGY({
        el: ".form-wrapper",
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        backgroundColor: '#ffffff',
        color: window.getComputedStyle(document.body).getPropertyValue('--colors-primary')

      });

    } else {
      fetchCustomPageData();
    }

    async function fetchCustomPageData() {
      try {
        const { org } = await getOrg(orgId);

        if (org) {
          document.title = `${org.name} Portal - Login`;

          const brandRGB = hexToRgb(org.brand_color);
          if (brandRGB) {
            document.documentElement.style.setProperty('--colors-primary', org.brand_color);
            document.documentElement.style.setProperty('--colors-primary-rgb', `${brandRGB?.r}, ${brandRGB?.g}, ${brandRGB?.b}`);
            themeConfig.palette!.primary!.main = org.brand_color;
          }

          setTheme(createTheme(themeConfig));
          setOrg(org);
          setDoneFetchingCustomPage(true);
        } else {
          window.location.href = '/login';
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          openSnackBar(error.message, 'error');
        }
      }
    }
  }, []);

  useEffect(() => {
    if (doneFetchingCustomPage) {
      const ableToLoadButton = tryLoadGoogleButton();
      if (!ableToLoadButton) {
        window.googleButtonInterval = setInterval(tryLoadGoogleButton, 1000);
      }

      window.VANTA?.TOPOLOGY({
        el: ".form-wrapper",
        mouseControls: false,
        touchControls: false,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        backgroundColor: '#ffffff',
        color: org?.brand_color
      });
    }
  }, [doneFetchingCustomPage]);

  const handleLogin = async (e: SyntheticEvent) => {
    e.preventDefault();

    if (!validator.validate(email)) {
      setFormErrors({ email: 'Please enter a valid email address.' });
      return;
    }

    setFormErrors({});
    setLoading(true);

    try {
      const result = await login({
        email,
        isFromCustomLoginPage: needsCustomPage,
        orgId
      });

      if (result.token) {
        if (needsCustomPage && org) {
          setActiveOrgId(orgId);
        }
        window.location.href = '/home/dashboard';
      } else {
        setLoading(false);
        openSnackBar(result.message, 'error');
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        openSnackBar(error.message, 'error');
        setLoading(false);
      }
    }
  };

  if (needsCustomPage && !doneFetchingCustomPage) {
    return (
      <Loader />
    );
  }

  let pageIcon =
    <Box component="a" href="https://www.zeforis.com" target="_blank">
      <img src={zeforisLogo} alt="Zeforis" className="logo" />
    </Box>;

  let orgName = 'Zeforis';

  if (needsCustomPage && org) {
    orgName = org.name;
    if (org.logo_url) {
      pageIcon = <Box>
        <img src={org.logo_url} alt={org.name} className="logo" />
      </Box>;
    } else {
      pageIcon = <Box component="h1" style={{ color: org.brand_color }}>{org.name}</Box>;
    }
  }

  return (
    <Box className="Login">
      <Box component="header">
        <Box className="inner">
          {pageIcon}
          <Box display="flex" alignItems="center">
            <Button
              style={{ padding: '4px 16px' }}
              variant="outlined"
              component={Link}
              to="/register">
              Sign Up
            </Button>
          </Box>
        </Box>
      </Box>
      <Box className="form-wrapper">
        <Box display="flex" alignItems="center" justifyContent="center" mb='4rem'>
          <Paper className="inner">
            <h1>
              Log in to <span style={{ color: org ? org.brand_color : 'inherit' }}>{orgName}</span>
            </h1>
            <Box id="google-signin"></Box>
            <Box width={formWidth} my='22px'>
              <Divider />
            </Box>

            <form onSubmit={handleLogin} style={{ width: formWidth }}>
              <TextField
                placeholder="Email"
                variant="outlined"
                type="email"
                name="email"
                disabled={isLoading}
                fullWidth
                autoComplete="email"
                autoFocus={!isMobile}
                onChange={e => {
                  setFormErrors({});
                  setEmail(e.target.value);
                }}
                error={Boolean(formErrors.email)}
                helperText={formErrors.email}
              />
              <LoadingButton
                loading={isLoading}
                disabled={!validator.validate(email) || isLoading}
                fullWidth
                size="large"
                style={{ padding: '0.75rem 0.5rem', marginTop: '0.5rem' }}
                variant="contained"
                type="submit">
                Sign in
              </LoadingButton>
              <Box
                hidden={!needsCustomPage}
                component="a"
                href="/login"
                style={{ fontSize: '14px' }}
                mt={4}>
                &larr; Go to universal login
              </Box>
            </form>
          </Paper>
        </Box>
      </Box>
      {
        needsCustomPage ?
          <Watermark
            positionStyle={{
              bottom: 10,
              right: 10,
              position: 'fixed'
            }} />
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