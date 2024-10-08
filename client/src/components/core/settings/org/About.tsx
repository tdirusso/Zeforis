import { Box, Button, TextField, InputAdornment, Divider, Skeleton, Typography, IconButton, Tooltip, Menu } from "@mui/material";
import React, { useRef, useState } from "react";
import { LoadingButton } from "@mui/lab";
import SwapHorizOutlinedIcon from '@mui/icons-material/SwapHorizOutlined';
import { useOutletContext } from "react-router";
import { deleteActiveOrgId, leaveOrg, updateOrg } from "../../../../api/orgs";
import { ColorResult, TwitterPicker } from "react-color";
import { hexToRgb, updateTheme } from "../../../../lib/utils";
import themeConfig from "../../../../theme";
import LinkIcon from '@mui/icons-material/Link';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import { deleteActiveEngagementId } from "../../../../api/engagements";
import { AppContext } from "src/types/AppContext";
import { EnvVariable, getEnvVariable } from "src/types/EnvVariable";

export default function About() {
  const {
    openDialog,
    openSnackBar,
    setOrg,
    org,
    setTheme,
    openModal,
    isOrgOwner,
    isAdmin,
    engagement
  } = useOutletContext<AppContext>();

  const customLoginPageUrl = `${getEnvVariable(EnvVariable.REACT_APP_APP_DOMAIN)}/login?cp=${window.btoa(`orgId=${org.id}`)}`;

  const [orgName, setOrgName] = useState(org.name);
  const [isUpdatingBranding, setUpdatingBranding] = useState(false);
  const [isUpdatingName, setUpdatingName] = useState(false);
  const [brandColor, setBrandColor] = useState<string>(org.brandColor);
  const [logoSrc, setLogoSrc] = useState(org.logo);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [isLogoChanged, setLogoChanged] = useState(false);
  const [isLogoLoading, setLogoLoading] = useState(org.logo !== '');
  const [copyButtonText, setCopyButtonText] = useState('Copy link');
  const [confirmLeaveOrgMenu, setConfirmLeaveOrgMenu] = useState<Element | null>(null);
  const [leaving, setLeaving] = useState(false);

  const confirmLeaveOrgMenuOpen = Boolean(confirmLeaveOrgMenu);

  const fileInput = useRef<HTMLInputElement>(null);

  const handleUpdateOrgName = async () => {
    if (!orgName) {
      openSnackBar('Please enter a name for the organization.');
      return;
    }

    setUpdatingName(true);

    try {
      const result = await updateOrg({
        name: orgName,
        brandColor: org.brandColor,
        orgId: org.id
      });

      const { success, message } = result;


      if (success) {
        setOrg(result.org);
        document.title = `${orgName} Portal`;
        setUpdatingName(false);
        openSnackBar('Organization updated.', 'success');
      } else {
        openSnackBar(message, 'error');
        setUpdatingName(false);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        openSnackBar(error.message, 'error');
        setUpdatingName(false);
      }
    }
  };

  const handleUpdateOrgBranding = async () => {
    setUpdatingBranding(true);

    try {
      const fd = new FormData();

      if (logoFile) {
        fd.append('logoFile', logoFile);
      }

      fd.append('name', org.name);
      fd.append('brandColor', brandColor);
      fd.append('isLogoChanged', String(isLogoChanged));
      fd.append('orgId', String(org.id));

      const result = await updateOrg(fd);
      const { success, message } = result;

      if (success) {
        updateUI();
        setOrg(result.org);
        setUpdatingBranding(false);
        openSnackBar('Organization updated.', 'success');
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
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const imageFile = e.target.files?.[0];

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
    if (fileInput.current) {
      fileInput.current.value = '';
    }
  };

  const updateUI = () => {
    const brandRGB = hexToRgb(brandColor);

    if (brandRGB) {
      document.documentElement.style.setProperty('--colors-primary', brandColor);
      document.documentElement.style.setProperty('--colors-primary-rgb', `${brandRGB.r}, ${brandRGB.g}, ${brandRGB.b}`);
      themeConfig.palette!.primary!.main = brandColor;
      updateTheme(setTheme);
    }
  };

  const handleCopyLoginLink = () => {
    window.navigator.clipboard.writeText(customLoginPageUrl);
    setCopyButtonText('Copied');
    setTimeout(() => {
      setCopyButtonText('Copy link');
    }, 750);
  };

  const handleLeaveOrg = async () => {
    if (isOrgOwner) {
      openSnackBar('As the org owner, you may only delete the organization.');
      return;
    }

    setLeaving(true);

    try {
      const { success, message } = await leaveOrg({
        orgId: org.id,
        engagementId: engagement.id
      });

      if (success) {
        openSnackBar('Left organization.', 'success');
        deleteActiveEngagementId();
        deleteActiveOrgId();
        setTimeout(() => {
          window.location.reload();
        }, 750);
      } else {
        openSnackBar(message, 'error');
        setLeaving(false);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        openSnackBar(error.message, 'error');
        setLeaving(false);
      }
    }
  };

  return (
    <>
      <Box>
        <TextField
          fullWidth
          value={orgName}
          disabled={isUpdatingName}
          onChange={e => setOrgName(e.target.value)}
          variant="standard"
          helperText={`Current organization name`}
          InputProps={{
            readOnly: !isOrgOwner,
            endAdornment: isOrgOwner ?
              <InputAdornment position="end">
                <LoadingButton
                  loading={isUpdatingName}
                  onClick={handleUpdateOrgName}>
                  Save
                </LoadingButton>
              </InputAdornment>
              : null
          }}>
        </TextField>
      </Box>

      <Box mt={3.5}>
        <Button
          style={{ marginRight: '1rem' }}
          variant="outlined"
          onClick={() => openDialog('choose-engagement')}
          startIcon={<SwapHorizOutlinedIcon />}>
          Change
        </Button>
      </Box>
      <Divider className="my4" hidden={!isOrgOwner} />
      <Box hidden={!isOrgOwner}>
        <Box component="h4" mb={3}>
          Branding
        </Box>
        <Box my={2} display='flex' alignItems='center' flexWrap='wrap' gap='20px'>
          <Box>
            <TwitterPicker
              triangle="hide"
              color={brandColor}
              onChange={color => setBrandColor(color.hex)}
            />
          </Box>
          <Box
            style={{
              background: brandColor,
              borderRadius: '6px',
              height: '75px',
              width: '75px',
              transition: 'background 500ms',
              marginLeft: '2rem'
            }}>
          </Box>
        </Box>

        <Box className="flex-ac" style={{ margin: '1.5rem 0' }} flexWrap='wrap' gap='20px'>
          <Button
            startIcon={<ImageOutlinedIcon />}
            variant='outlined'
            component='label'
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
              display: logoSrc && !isLogoLoading ? 'block' : 'none',
            }}
            disabled={isUpdatingBranding}
            onClick={handleLogoClear}>
            Clear Logo
          </Button>

          <Skeleton
            variant='circular'
            width={70}
            height={70}
            animation='wave'
            style={{ display: logoSrc && isLogoLoading ? 'block' : 'none' }}>
          </Skeleton>
          <img
            src={logoSrc}
            alt=""
            width={100}
            onLoad={() => setLogoLoading(false)}
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
      </Box>

      <Divider className="my4" hidden={!isAdmin} />

      <Box hidden={!isAdmin}>
        <Box component="h4" mb={2}>
          Custom Login Page
        </Box>
        <Typography variant="body2">
          The "Custom Login Page" feature provides your customers with a custom login experience
          by incorporating your branding colors and logo into the login page, delivering a professional touch.
          <br></br><br></br>
          This seamless white labeling capability enhances your brand, customer retention, marketing opportunities,
          and overall user experience.
        </Typography>
        <Box my={3}>
          <TextField
            helperText="Share this link with your customers to provide a custom login experience with your brand."
            value={customLoginPageUrl}
            fullWidth
            InputProps={{
              startAdornment:
                <InputAdornment position='start' style={{ transform: 'rotate(-45deg)' }}>
                  <LinkIcon />
                </InputAdornment>,
              readOnly: true,
              endAdornment:
                <>
                  <InputAdornment position="end">
                    <Tooltip title={copyButtonText}>
                      <IconButton
                        onClick={handleCopyLoginLink}
                        color="primary"
                        size="large">
                        <ContentCopyIcon />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                  <InputAdornment position="end">
                    <Tooltip title="Open preview" >
                      <IconButton
                        onClick={() => window.open(customLoginPageUrl, '_blank')}
                        color="primary"
                        size="large">
                        <OpenInNewIcon />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                </>
            }}>
          </TextField>
        </Box>
      </Box>
      <Divider className="my4" />
      <Box>
        <Box component="h4" mb={2}>
          Danger Zone
        </Box>
        <Box>
          {
            isOrgOwner ?
              <Typography variant="body2">
                Once you delete an organization, there is no going back - all folders, tasks, tags, etc. will be permanently deleted.  Please be certain.
              </Typography>
              :
              null
          }
          <Button
            startIcon={isOrgOwner ? null : <LogoutIcon />}
            onClick={
              isOrgOwner ? () => openModal('delete-org') :
                e => setConfirmLeaveOrgMenu(e.currentTarget)
            }
            style={{ marginTop: '1rem' }}
            variant="contained"
            color="error">
            {
              isOrgOwner ? 'Delete organization' : 'Leave organization'
            }
          </Button>
        </Box>
      </Box>

      <Menu
        anchorEl={confirmLeaveOrgMenu}
        open={confirmLeaveOrgMenuOpen}
        onClose={() => setConfirmLeaveOrgMenu(null)}>
        <Box px={2} py={1}>
          <Typography variant="body2" mb={1}>
            Are you sure you want to leave this entire organization?
          </Typography>
          <LoadingButton
            color='error'
            variant='contained'
            loading={leaving}
            onClick={handleLeaveOrg}>
            Yes, leave
          </LoadingButton>
        </Box>
      </Menu>
    </>
  );
};
