import { SyntheticEvent, useEffect, useState } from "react";
import { login, verifyLogin } from "../../api/auth";
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

export default function VerifyLoginPage() {
  const { search } = useLocation();

  const searchParams = new URLSearchParams(search);
  const [isLoading, setLoading] = useState(false);

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
          const { token } = await verifyLogin({
            email,
            loginCode
          });

          //  console.log(token);

        } catch (error: unknown) {
          if (error instanceof Error) {
            console.log("ERROR", error);
          }
        }
      }
    }
  }, []);

  return (
    <Box className="VerifyLogin">
      <Loader />
    </Box>
  );
};