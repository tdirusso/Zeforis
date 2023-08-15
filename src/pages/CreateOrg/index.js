import { useRef, useState } from 'react';
import { Box, Button, Divider, Fade, Grow, Paper, TextField, Typography, createTheme } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Snackbar from '../../components/core/Snackbar';
import createOrgIcon from '../../assets/create-org-icon.png';
import { createOrg, setActiveOrgId, updateOrg } from '../../api/orgs';
import useSnackbar from '../../hooks/useSnackbar';
import { hexToRgb } from '../../lib/utils';
import themeConfig from '../../theme';
import { TwitterPicker } from 'react-color';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import Watermark from '../../components/core/Watermark';

export default function CreateOrgPage({ setTheme }) {
  const [step, setStep] = useState(1);
  const [orgName, setOrgName] = useState('');
  const [orgId, setOrgId] = useState(null);

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
    <Box className="flex-centered" style={{ height: '100%' }}>
      <Box textAlign="center" maxWidth={600} p={3}>
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
    }, 2000);
  };

  return (
    <Box textAlign="center" mb={'100px'} maxWidth={600}>
      <Grow appear in timeout={{ enter: 500 }}>
        <Box mb={2}>
          <img src={createOrgIcon} alt="" width={125} />
        </Box>
      </Grow>
      <Fade appear in timeout={{ enter: 400 }} style={{ transitionDelay: '150ms' }}>
        <Box>
          <Box component="h2" mb={1}>
            Create an Organization
          </Box>
          <Divider className='my3' />
          <Typography>
            Let's start by creating your own organization.
          </Typography>
          <Typography mt={1}>
            This should be your organization/company name.  When you create and manage engagements, they will be a part of your organization.
          </Typography>
        </Box>
      </Fade>
      <Fade appear in timeout={{ enter: 400 }} style={{ transitionDelay: '220ms' }}>
        <form onSubmit={handleCreateOrg}>
          <Box className='my3'>
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
      <Grow appear in>
        <Box>
          <Watermark positionStyle={{ bottom: 10, right: 10, position: 'absolute' }} />
        </Box>
      </Grow>
    </Box>
  );
}

const colorTransitionStyle = {
  transition: 'color 1s, background 1s'
};

function Step2({ orgId, orgName, openSnackBar, setTheme }) {
  const [isUpdatingBranding, setUpdatingBranding] = useState(false);
  const [brandColor, setBrandColor] = useState('#3365f6');
  const [logoSrc, setLogoSrc] = useState('');
  const [logoFile, setLogoFile] = useState(null);

  const fileInput = useRef();

  if (!orgName || !orgId) {
    return;
  }

  const handleUpdateOrgBranding = () => {
    setUpdatingBranding(true);

    setTimeout(async () => {
      try {
        const fd = new FormData();
        fd.append('logoFile', logoFile);
        fd.append('name', orgName);
        fd.append('brandColor', brandColor);
        fd.append('isLogoChanged', true);
        fd.append('orgId', orgId);

        const result = await updateOrg(fd);
        const { success, message } = result;

        if (success) {
          window.location.href = '/home/dashboard';
        } else {
          openSnackBar(message, 'error');
          setUpdatingBranding(false);
        }
      } catch (error) {
        openSnackBar(error.message, 'error');
        setUpdatingBranding(false);
      }
    }, 1500);
  };

  const handleLogoChange = e => {
    const imageFile = e.target.files[0];

    if (!imageFile) {
      return;
    };

    setLogoSrc(URL.createObjectURL(imageFile));
    setLogoFile(imageFile);
  };

  const handleLogoClear = () => {
    setLogoSrc('');
    setLogoFile(null);
    fileInput.current.value = null;
  };

  const handleColorChange = color => {
    const brandRGB = hexToRgb(brandColor);
    document.documentElement.style.setProperty('--colors-primary', color.hex);
    document.documentElement.style.setProperty('--colors-primary-rgb', `${brandRGB.r}, ${brandRGB.g}, ${brandRGB.b}`);
    themeConfig.palette.primary.main = color.hex;
    setTheme(createTheme(themeConfig));
    setBrandColor(color.hex);
  };

  let pageIcon = <Box
    component="h1"
    style={{ ...colorTransitionStyle, color: brandColor }}>
    {orgName}
  </Box>;

  if (logoSrc) {
    pageIcon = <Box>
      <img src={logoSrc} alt="" height={50} />
    </Box>;
  }

  return (
    <Box className="info-page flex-centered">
      <Box component="header">
        {pageIcon}
      </Box>
      <Paper style={{ padding: '4rem', paddingTop: '2.5rem' }} className="container">
        <Typography variant="h5" style={{ marginBottom: '2.5rem' }}>
          Apply your Brand
        </Typography>
        <Box my={2} display='flex' alignItems='center'>
          <Box>
            <TwitterPicker
              width='100%'
              triangle="hide"
              color={brandColor}
              onChange={handleColorChange}
            />
          </Box>
        </Box>

        <Box className='flex-ac my4' style={{ justifyContent: 'space-evenly' }}>
          <Button
            startIcon={<ImageOutlinedIcon />}
            variant='outlined'
            component='label'
            style={{ ...colorTransitionStyle, marginRight: '0.5rem' }}
            disabled={isUpdatingBranding}>
            Upload Logo
            <input
              hidden
              accept="image/png,image/jpeg"
              type="file"
              onChange={handleLogoChange}
              disabled={isUpdatingBranding}
              ref={fileInput}
            />
          </Button>
          <Button
            style={{
              ...colorTransitionStyle,
              display: logoSrc ? 'block' : 'none'
            }}
            disabled={isUpdatingBranding}
            onClick={handleLogoClear}>
            Clear Logo
          </Button>
        </Box>
        <Divider className='my4' />
        <Box>
          <LoadingButton
            style={colorTransitionStyle}
            onClick={handleUpdateOrgBranding}
            loading={isUpdatingBranding}
            fullWidth
            variant="contained">
            Apply brand
          </LoadingButton>
        </Box>
      </Paper>
      <Box
        component="a"
        style={colorTransitionStyle}
        href='/home/dashboard'
        fontSize={14}
        mt={1}>
        Skip
      </Box>
      <Box style={colorTransitionStyle} className="circle"></Box>
      <Grow appear in>
        <Box>
          <Watermark positionStyle={{ bottom: 10, right: 10, position: 'absolute' }} />
        </Box>
      </Grow>
    </Box>
  );
}