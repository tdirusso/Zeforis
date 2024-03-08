import { useEffect, useState } from "react";
import { verifyLogin } from "../../api/auth";
import { Link, useLocation } from "react-router-dom";
import Box from '@mui/material/Box';
import zeforisLogo from '../../assets/zeforis-logo.png';
import './styles.scss';
import { Button, Paper, Typography } from "@mui/material";
import Loader from "../../components/core/Loader";
import { AxiosError } from "axios";

export default function VerifyLoginPage() {
  const { search } = useLocation();

  const searchParams = new URLSearchParams(search);
  const [error, setError] = useState('');

  const email = searchParams.get('email');
  const loginCode = searchParams.get('loginCode');

  if (!email || !loginCode) {
    window.location.replace('/login');
    return null;
  }

  useEffect(() => {
    doVerifyLogin();

    async function doVerifyLogin() {
      if (email && loginCode) {
        try {
          await verifyLogin({
            email,
            loginCode
          });

          window.location.replace('/home/dashboard');
        } catch (error: unknown) {
          console.log(error);
          if (error instanceof AxiosError) {
            setError(error.response?.data?.message || error.message);
          } else if (error instanceof Error) {
            setError(error.message);
          }
        }
      }
    }
  }, []);

  return (
    <Box className="VerifyLogin">
      {
        error ? <CantVerifyMessage /> : <Loader />
      }
    </Box>
  );
};

function CantVerifyMessage() {
  return (
    <Box>
      <Box component="header">
        <Box className="inner">
          <Box component="a" href="https://www.zeforis.com" target="_blank">
            <img src={zeforisLogo} alt="Zeforis" className="logo" />
          </Box>
        </Box>
      </Box>
      <Box className="form-wrapper">
        <Box display="flex" alignItems="center" justifyContent="center" mb='4rem'>
          <Paper className="form-content">
            <Box>
              <Typography variant="h1" gutterBottom>
                Verification Error
              </Typography>
              <Typography variant="body2" fontSize='1rem'>
                We could not verify your login attempt.  The link may be expired or invalid.
              </Typography>
              <Typography variant="body2" fontSize='1rem' mb={4}>
                Please return to the login page and try again.
              </Typography>
              <Button
                to="/login"
                component={Link}
                variant="outlined">
                &larr; Back to Login
              </Button>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}