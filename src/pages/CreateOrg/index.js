import { useState } from 'react';
import { Box, Button, Divider, Fade, Grow, Paper, TextField, Typography, createTheme } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Snackbar from '../../components/core/Snackbar';
import createOrgIcon from '../../assets/create-org-icon.png';
import { createOrg, setActiveOrgId, updateOrg } from '../../api/orgs';
import useSnackbar from '../../hooks/useSnackbar';
import zeforisLogo from '../../assets/zeforis-logo.png';
import { hexToRgb } from '../../lib/utils';
import themeConfig from '../../theme';
import { TwitterPicker } from 'react-color';

export default function CreateOrgPage({ setTheme }) {
  const [step, setStep] = useState(2);
  const [orgName, setOrgName] = useState('Test');
  const [orgId, setOrgId] = useState(1);

  const {
    isOpen,
    openSnackBar,
    type,
    message
  } = useSnackbar();

  if (!localStorage.getItem('token')) {
    window.location.href = '/login';
    return;
  }

  return (
    <Box className="flex-centered" sx={{ height: '100%' }}>
      <Box textAlign="center" mb={'100px'} maxWidth={600}>
        {
          step === 1 ?
            <Step1
              openSnackBar={openSnackBar}
              setStep={setStep}
              orgName={orgName}
              setOrgId={setOrgId}
              setOrgName={setOrgName}
            /> :
            <Step2
              openSnackBar={openSnackBar}
              orgName={orgName}
              orgId={orgId}
              setTheme={setTheme}
            />
        }
        <Snackbar
          isOpen={isOpen}
          type={type}
          message={message}
        />
      </Box>
    </Box>
  );
};

function Step1({ openSnackBar, setStep, orgName, setOrgName, setOrgId }) {
  const [isLoading, setLoading] = useState(false);

  const handleCreateOrg = e => {
    e.preventDefault();

    if (!orgName) {
      openSnackBar('Please enter an organization name.');
      return;
    }

    setLoading(true);

    setTimeout(async () => {
      try {
        const { orgId, message } = await createOrg({
          name: orgName
        });

        if (orgId) {
          setActiveOrgId(orgId);
          setOrgId(orgId);
          openSnackBar('Organization created.', 'success');
          setStep(2);
        } else {
          openSnackBar(message, 'error');
          setLoading(false);
        }
      } catch (error) {
        openSnackBar(error.message, 'error');
        setLoading(false);
      }
    }, 1000);
  };
  return (
    <Box textAlign="center" mb={'100px'} maxWidth={600}>
      <Grow appear in timeout={{ enter: 500 }}>
        <Box mb={2}>
          <img src={createOrgIcon} alt="" width={150} />
        </Box>
      </Grow>
      <Fade appear in timeout={{ enter: 400 }} style={{ transitionDelay: '125ms' }}>
        <Box>
          <Box component="h2" mb={1}>
            Create an Organization
          </Box>
          <Divider sx={{ my: 3 }} />
          <Typography>
            Let's start by creating your own organization, since you are not currently a member of one.
          </Typography>
          <Typography mt={1}>
            This should be your organization/company name.  When you create and manage engagements, they will be a part of your organization.
          </Typography>
        </Box>
      </Fade>
      <Fade appear in timeout={{ enter: 400 }} style={{ transitionDelay: '200ms' }}>
        <form onSubmit={handleCreateOrg}>
          <Box sx={{ mt: 3, mb: 3 }}>
            <TextField
              placeholder="Organization Name"
              fullWidth
              autoFocus
              disabled={isLoading}
              onChange={e => setOrgName(e.target.value)}
              value={orgName}>
            </TextField>
          </Box>
          <LoadingButton
            variant='contained'
            fullWidth
            type='submit'
            size='large'
            loading={isLoading}>
            Create Organization
          </LoadingButton>
        </form>
      </Fade>
    </Box>
  );
}



function Step2({ orgId, orgName, openSnackBar, setTheme }) {
  const [isUpdatingBranding, setUpdatingBranding] = useState(false);
  const [isUpdatingName, setUpdatingName] = useState(false);
  const [brandColor, setBrandColor] = useState('#3365f6');
  const [logoSrc, setLogoSrc] = useState('');
  const [logoFile, setLogoFile] = useState(null);
  const [isLogoChanged, setLogoChanged] = useState(false);

  if (!orgName || !orgId) {
    return;
  }

  const handleUpdateOrgBranding = async () => {
    setUpdatingBranding(true);

    try {
      const fd = new FormData();
      fd.append('logoFile', logoFile);
      fd.append('name', orgName);
      fd.append('brandColor', brandColor);
      fd.append('isLogoChanged', isLogoChanged);
      fd.append('orgId', orgId);


      const result = await updateOrg(fd);
      const { success, message } = result;

      if (success) {
        window.location.href = '/home/dashboard';
        openSnackBar('Organization updated.', 'success');
      } else {
        openSnackBar(message, 'error');
        setUpdatingBranding(false);
      }
    } catch (error) {
      openSnackBar(error.message, 'error');
      setUpdatingBranding(false);
    }
  };

  const handleLogoChange = e => {
    const imageFile = e.target.files[0];

    if (!imageFile) {
      return;
    };

    setLogoSrc(URL.createObjectURL(imageFile));
    setLogoFile(imageFile);
    setLogoChanged(true);
  };

  const handleLogoClear = () => {
    setLogoSrc('');
    setLogoFile(null);
    setLogoChanged(true);
  };

  const updateUI = () => {
    const brandRGB = hexToRgb(brandColor);
    document.documentElement.style.setProperty('--colors-primary', brandColor);
    document.documentElement.style.setProperty('--colors-primary-rgb', `${brandRGB.r}, ${brandRGB.g}, ${brandRGB.b}`);
    themeConfig.palette.primary.main = brandColor;
    setTheme(createTheme(themeConfig));
  };

  let pageIcon = <Box component="h1" color={brandColor}>{orgName}</Box>;

  if (logoSrc) {
    pageIcon = <Box>
      <img src={logoSrc} alt="" height={50} />
    </Box>;
  }

  return (
    <Box className="Login flex-centered">
      <Box component="header">
        {pageIcon}
        <Box display="flex" alignItems="center">
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

        <Box my={2} display='flex' alignItems='center'>
          <Box>
            <TwitterPicker
              triangle="hide"
              color={brandColor}
              onChange={color => setBrandColor(color.hex)}
            />
          </Box>
          <Box
            sx={{
              background: brandColor,
              borderRadius: '6px',
              height: '75px',
              width: '75px',
              transition: 'background 500ms',
              ml: 4
            }}>
          </Box>
        </Box>

        <Box sx={{ mt: 3, mb: 3, display: 'flex', alignItems: 'center' }}>
          <Button
            variant='outlined'
            component='label'
            sx={{ mr: 1 }}
            disabled={isUpdatingBranding}>
            Upload Logo
            <input
              hidden
              accept="image/png,image/jpeg"
              type="file"
              onChange={handleLogoChange}
              disabled={isUpdatingBranding}
            />
          </Button>
          <Button
            sx={{
              display: logoSrc ? 'block' : 'none',
              mr: 2
            }}
            disabled={isUpdatingBranding}
            onClick={handleLogoClear}>
            Clear Logo
          </Button>
          <img
            src={logoSrc}
            alt=""
            width={100}
          />
        </Box>

        <Box my={2}>
          <LoadingButton
            onClick={handleUpdateOrgBranding}
            loading={isUpdatingBranding}
            variant="contained">
            Save changes
          </LoadingButton>
        </Box>

      </Paper>
      <Box className="circle"></Box>
      <Box
        sx={{
          position: 'absolute',
          bottom: 10,
          right: 10,
          color: '#5f5f5f !important',
          display: 'flex',
          alignItems: 'center'
        }}
        component="a"
        href="https://www.zeforis.com"
        target="_blank">
        Powered by  <img src={zeforisLogo} alt="Zeforis" height={15} style={{ marginLeft: '4px' }} />
      </Box>
    </Box>
  );
}