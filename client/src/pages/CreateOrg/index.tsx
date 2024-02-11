import React, { useRef, useState } from 'react';
import { Theme, Box, Button, Divider, Fade, Paper, TextField, Typography, createTheme } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Snackbar from '../../components/core/Snackbar';
import rocketGif from '../../assets/rocket.gif';
import { createOrg, setActiveOrgId, updateOrg } from '../../api/orgs';
import useSnackbar from '../../hooks/useSnackbar';
import { hexToRgb } from '../../lib/utils';
import themeConfig from '../../theme';
import { ColorResult, TwitterPicker } from 'react-color';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import Watermark from '../../components/core/Watermark';
import { isMobile } from '../../lib/constants';

export default function CreateOrgPage({ setTheme }: { setTheme: (theme: Theme) => void; }) {
  const [step, setStep] = useState(1);
  const [orgName, setOrgName] = useState('');
  const [orgId, setOrgId] = useState<undefined | number>();

  const {
    isOpen,
    openSnackBar,
    type,
    message
  } = useSnackbar();

  if (!localStorage.getItem('token')) {
    window.location.href = '/login';
    return null;
  }

  return (
    <Box bgcolor='white' className="flex-centered" style={{ height: '100vh' }}>
      <Box textAlign="center" maxWidth={600} px={3}>
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
              orgId={orgId!}
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

type Step1Props = {
  openSnackBar: (message?: string, type?: string, options?: {}) => void,
  setStep: StateSetters.Number,
  orgName: string,
  setOrgName: StateSetters.String,
  setOrgId: StateSetters.NumberOrUndefined;
};

function Step1({ openSnackBar, setStep, orgName, setOrgName, setOrgId }: Step1Props) {
  const [isLoading, setLoading] = useState(false);

  const handleCreateOrg = (e: React.SyntheticEvent) => {
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
      } catch (error: unknown) {
        if (error instanceof Error) {
          openSnackBar(error.message, 'error');
          setLoading(false);
        }
      }
    }, 2000);
  };

  return (
    <Fade appear in timeout={{ enter: 400 }}>
      <Box textAlign="center" mb={'100px'} maxWidth={600}>
        <Box mb={1}>
          <img src={rocketGif} alt="" width={100} />
        </Box>
        <Box>
          <Box component="h2" mb={1}>
            Create an Organization
          </Box>
          <Divider className='my3' />
          <Typography>
            This should be your organization/company name.
          </Typography>
          <Typography mt={1}>
            When you create and manage engagements, they will be a part of your organization.
          </Typography>
        </Box>
        <form onSubmit={handleCreateOrg}>
          <Box className='my3'>
            <TextField
              placeholder="Organization Name"
              fullWidth
              autoFocus={!isMobile}
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
        <Box>
          <Watermark positionStyle={{ bottom: 10, right: 10, position: 'absolute' }} />
        </Box>
      </Box>
    </Fade>
  );
}

const colorTransitionStyle = {
  transition: 'color 1s, background 1s'
};


type Step2Props = {
  openSnackBar: (message?: string, type?: string, options?: {}) => void,
  orgName: string,
  orgId: number,
  setTheme: (theme: Theme) => void;
};

function Step2({ orgId, orgName, openSnackBar, setTheme }: Step2Props) {
  const [isUpdatingBranding, setUpdatingBranding] = useState(false);
  const [brandColor, setBrandColor] = useState('#3365f6');
  const [logoSrc, setLogoSrc] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const fileInput = useRef<HTMLInputElement>(null);

  if (!orgName || !orgId) {
    return null;
  }

  const handleUpdateOrgBranding = () => {
    setUpdatingBranding(true);

    setTimeout(async () => {
      try {
        const fd = new FormData();
        if (logoFile) {
          fd.append('logoFile', logoFile);
        }
        fd.append('name', orgName);
        fd.append('brandColor', brandColor);
        fd.append('isLogoChanged', String(true));
        fd.append('orgId', String(orgId));

        const result = await updateOrg(fd);
        const { success, message } = result;

        if (success) {
          window.location.href = '/home/dashboard';
        } else {
          openSnackBar(message, 'error');
          setUpdatingBranding(false);
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          openSnackBar(error.message, 'error');
          setUpdatingBranding(false);
        }
      }
    }, 1500);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const imageFile = e.target.files?.[0];

    if (!imageFile) {
      return;
    };

    setLogoSrc(URL.createObjectURL(imageFile));
    setLogoFile(imageFile);
  };

  const handleLogoClear = () => {
    setLogoSrc('');
    setLogoFile(null);
    if (fileInput.current) {
      fileInput.current.value = '';
    }
  };

  const handleColorChange = (color: ColorResult) => {
    const brandRGB = hexToRgb(brandColor);
    if (brandRGB) {
      document.documentElement.style.setProperty('--colors-primary', color.hex);
      document.documentElement.style.setProperty('--colors-primary-rgb', `${brandRGB.r}, ${brandRGB.g}, ${brandRGB.b}`);
      if (themeConfig.palette?.primary) {
        themeConfig.palette.primary.main = color.hex;

      }
      setTheme(createTheme(themeConfig));
      setBrandColor(color.hex);
    }
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
    <Fade appear in timeout={{ enter: 400 }}>
      <Box className="info-page flex-centered">
        <Box component="header" style={{ justifyContent: 'center' }}>
          {pageIcon}
        </Box>
        <Paper style={{ padding: '4rem', paddingTop: '2.5rem', zIndex: 2 }} className="container">
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
        <Box>
          <Watermark positionStyle={{ bottom: 10, right: 10, position: 'absolute' }} />
        </Box>
      </Box>
    </Fade>
  );
}