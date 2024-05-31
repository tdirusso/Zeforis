import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Snackbar from "../../components/core/Snackbar";
import useSnackbar from "../../hooks/useSnackbar";
import { register } from '../../api/users';
import zeforisLogo from '../../assets/zeforis-logo.png';
import { Button, Divider, FormControlLabel, Typography, useMediaQuery } from "@mui/material";
import './styles.scss';
import { isMobile } from "../../lib/constants";
import validator from 'email-validator';
import { getErrorObject } from "src/lib/utils";

type RegisterFormData = {
  firstName: string,
  lastName: string,
  email: string;
};

type RegisterFormErrors = {
  [T in keyof RegisterFormData]?: string
};

const emptyFormData = {
  firstName: '',
  lastName: '',
  email: ''
};

export default function RegisterPage() {
  const isSmallScreen = useMediaQuery('(max-width: 500px)');
  const formWidth = isSmallScreen ? 300 : 425;

  const [formData, setFormData] = useState<RegisterFormData>({ ...emptyFormData });
  const [formErrors, setFormErrors] = useState<RegisterFormErrors>({});
  const [registerError, setRegisterError] = useState('');
  const [isLoading, setLoading] = useState(false);

  const {
    isOpen,
    openSnackBar,
    type,
    message
  } = useSnackbar();

  const navigate = useNavigate();

  const handleRegisterSuccess = () => {
    openSnackBar('Registration successful.', 'success');
    setTimeout(() => {
      navigate('/login?emailSent=true');
    }, 1000);
  };

  const handleGoogleRegistration = (authResponse: { credential?: string; }) => {
    if (authResponse.credential) {
      setFormErrors(emptyFormData);
      setLoading(true);

      setTimeout(async () => {
        try {
          await register({
            googleCredential: authResponse.credential
          });

          handleRegisterSuccess();
        } catch (error) {
          setRegisterError(getErrorObject(error).message);
          setLoading(false);
        }
      }, 1000);
    } else {
      openSnackBar('Error signing in with Google (missing credential).');
    }
  };

  const tryLoadGoogleButton = () => {
    if (window.google?.accounts) {
      clearInterval(window.googleButtonInterval);
      window.google.accounts.id.initialize({
        client_id: process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID,
        callback: handleGoogleRegistration
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

  const handleRegistration = (e: React.FormEvent) => {
    e.preventDefault();

    const { email, firstName, lastName } = formData;

    const newFormErrors = getFormErrors();

    if (Object.keys(newFormErrors).length > 0) {
      setFormErrors(newFormErrors);
      return;
    }

    setFormErrors({});
    setRegisterError('');
    setLoading(true);

    setTimeout(async () => {
      try {
        await register({
          email,
          firstName,
          lastName
        });

        handleRegisterSuccess();
      } catch (error: unknown) {
        setRegisterError(getErrorObject(error).message);
        setLoading(false);
      }
    }, 1000);
  };

  const getFormErrors = () => {
    const { email, firstName, lastName } = formData;

    const newFormErrors: RegisterFormErrors = {};

    if (!firstName) {
      newFormErrors.firstName = 'First name is required.';
    }

    if (!lastName) {
      newFormErrors.lastName = 'Last name is required.';
    }

    if (!validator.validate(email)) {
      newFormErrors.email = 'Please enter a valid email address.';
    }

    return newFormErrors;
  };

  useEffect(() => {
    const ableToLoadButton = tryLoadGoogleButton();
    if (!ableToLoadButton) {
      window.googleButtonInterval = setInterval(tryLoadGoogleButton, 1000);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    setFormErrors((prevState) => {
      const copy = { ...prevState };
      copy[name as keyof RegisterFormData] = '';
      return copy;
    });

    if (e.target.matches(':autofill')) {
      if (name === 'firstName') {
        document.querySelector<HTMLInputElement>('input[name="lastName"]')?.focus();
      } else if (name === 'lastName') {
        document.querySelector<HTMLInputElement>('input[name="email"]')?.focus();
      }
    }
  };

  return (
    <Box className="Register">
      <Box component="header">
        <Box className="inner">
          <Box component="a" href="https://www.zeforis.com" target="_blank">
            <img src={zeforisLogo} alt="Zeforis" className="logo" />
          </Box>
          <Box display="flex" alignItems="center">
            <Button
              style={{ padding: '4px 16px' }}
              variant="outlined"
              component={Link}
              to='/login'>
              Log In
            </Button>
          </Box>
        </Box>
      </Box>
      <Box className="form-wrapper">
        <Box className="inner">
          <h1 style={{ marginBottom: '1.75rem' }}>Create Your <span>Zeforis</span> Account</h1>
          <Box id="google-signin" height={45}></Box>
          <Box width={formWidth} my='22px'>
            <Divider />
          </Box>

          <form onSubmit={handleRegistration} style={{ width: formWidth }}>
            <FormControlLabel
              label="First name"
              labelPlacement="top"
              control={
                <TextField
                  size="small"
                  variant="outlined"
                  disabled={isLoading}
                  autoComplete="given-name"
                  autoFocus={!isMobile}
                  fullWidth
                  error={Boolean(formErrors.firstName)}
                  helperText={formErrors.firstName}
                  name="firstName"
                  onChange={handleInputChange}
                />}
            />

            <FormControlLabel
              label="Last name"
              labelPlacement="top"
              control={
                <TextField
                  size="small"
                  variant="outlined"
                  disabled={isLoading}
                  autoComplete="family-name"
                  fullWidth
                  error={Boolean(formErrors.lastName)}
                  helperText={formErrors.lastName}
                  name="lastName"
                  onChange={handleInputChange}
                />}
            />

            <FormControlLabel
              label="Email"
              labelPlacement="top"
              control={
                <TextField
                  size="small"
                  variant="outlined"
                  type="email"
                  disabled={isLoading}
                  name="email"
                  autoComplete="email"
                  fullWidth
                  error={Boolean(formErrors.email)}
                  helperText={formErrors.email}
                  onChange={handleInputChange}
                />
              }
            />

            <Typography
              style={{ fontSize: '14px' }}
              component="span"
              color="error">
              {registerError}
            </Typography>

            <LoadingButton
              loading={isLoading}
              disabled={Object.keys(getFormErrors()).length > 0 || isLoading}
              fullWidth
              variant="contained"
              type="submit"
              size="large"
              style={{ marginTop: '0.25rem' }}>
              Create Account
            </LoadingButton>
          </form>

          <Box mt='3rem' style={{ fontSize: '14px', textAlign: 'center' }} px={.5}>
            By joining, you agree to our <a href="https://www.zeforis.com/terms-of-service" target="_blank" rel="noreferrer">Terms of Service</a> and <a target="_blank" rel="noreferrer" href="https://www.zeforis.com/privacy-policy">Privacy Policy</a>.
          </Box>
        </Box>
      </Box>
      <Snackbar
        isOpen={isOpen}
        type={type}
        message={message}
      />
    </Box>
  );
};
