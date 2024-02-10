import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Snackbar from "../../components/core/Snackbar";
import useSnackbar from "../../hooks/useSnackbar";
import { getInvitationData } from '../../api/users';
import zeforisLogo from '../../assets/zeforis-logo.png';
import { Button, CircularProgress, Divider, useMediaQuery } from "@mui/material";
import { setActiveOrgId } from "../../api/orgs";
import { setActiveEngagementId } from "../../api/engagements";

export default function AcceptInvitationPage() {
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);

  const isSmallScreen = useMediaQuery('(max-width: 500px)');

  const engagementId = queryParams.get('engagementId');
  const invitationCode = queryParams.get('invitationCode');
  const userId = queryParams.get('userId');
  const orgId = queryParams.get('orgId');

  const firstName = useRef();
  const lastName = useRef();

  const customLoginPageUrl = `${process.env.REACT_APP_APP_DOMAIN}/login?cp=${window.btoa(`orgId=${orgId}`)}`;

  const [fetchingInvitation, setFetchingInvitation] = useState(false);
  const [userNeedsName, setUserNeedsName] = useState(false);
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
          if (!Boolean(invitation.userNeedsName)) {
            openSnackBar('Invitation accepted.', 'success');
            setActiveOrgId(orgId);
            setActiveEngagementId(engagementId);
            localStorage.setItem('openGettingStarted', 'true');
            setTimeout(() => {
              window.location.href = customLoginPageUrl;
            }, 1000);
          } else {
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

  if (userNeedsName === null) {
    return (
      <div className="info-page flex-centered">
        <header style={{ position: 'absolute' }}>
          <Box component="a" href="https://www.zeforis.com" target="_blank">
            <img src={zeforisLogo} alt="Zeforis" className="header-logo" />
          </Box>
        </header>
        {
          fetchingInvitation ? <Box>
            <Typography mb={2}>Fetching invitation...</Typography>
            <CircularProgress />
            <Snackbar
              isOpen={isOpen}
              type={type}
              message={message}
            />
          </Box>
            :
            <Paper className="container" style={{ zIndex: 2 }}>
              <Typography mb={2}>Invitation does not exist or has expired.</Typography>
              <a href='/login'>
                <Button size="large" variant="contained">
                  Return to Homepage
                </Button>
              </a>

              <Snackbar
                isOpen={isOpen}
                type={type}
                message={message}
              />
            </Paper>
        }
        <div className="circle"></div>
      </div>
    );
  }

  return (
    <div className="info-page flex-centered">
      <header style={{ position: 'fixed' }}>
        <Box component="a" href="https://www.zeforis.com" target="_blank">
          <img src={zeforisLogo} alt="Zeforis" className="header-logo" />
        </Box>
        <Box display="flex" alignItems="center">
          <Box mr={1.5} display={isSmallScreen ? 'none' : 'block'}>Already have an account?</Box>
          <Button
            variant="contained"
            disabled={isLoading}
            component={'a'}
            href="/login"
            size={isSmallScreen ? 'medium' : 'large'}>
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
          <Paper className="container" style={{ zIndex: 2 }}>
            <Typography variant="h6" style={{ marginBottom: '1.5rem' }}>Complete Account Registration</Typography>
            <Box style={{ display: 'flex', justifyContent: 'center' }}>
              <Box id="google-signin" style={{ width: 400 }}></Box>
            </Box>
            <Divider className="my4"></Divider>

            <form onSubmit={() => { }}>
              <Box mb={2}>
                <TextField
                  fullWidth
                  placeholder="First name"
                  variant="outlined"
                  inputRef={firstName}
                  disabled={isLoading}
                />
              </Box>
              <Box mb={2}>
                <TextField
                  fullWidth
                  placeholder="Last name"
                  variant="outlined"
                  inputRef={lastName}
                  disabled={isLoading}
                />
              </Box>
              <LoadingButton
                loading={isLoading}
                disabled={isLoading}
                fullWidth
                size="large"
                style={{ padding: '0.75rem 0' }}
                variant="contained"
                type="submit">
                Complete Registration
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