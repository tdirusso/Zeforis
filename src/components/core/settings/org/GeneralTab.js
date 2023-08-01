import { Box, Button, TextField, InputAdornment, Divider, Chip, Typography, Skeleton, createTheme } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import React, { useState } from "react";
import { LoadingButton } from "@mui/lab";
import SwapHorizOutlinedIcon from '@mui/icons-material/SwapHorizOutlined';
import { useOutletContext } from "react-router";
import { updateOrg } from "../../../../api/orgs";
import { TwitterPicker } from "react-color";
import { hexToRgb } from "../../../../lib/utils";
import themeConfig from "../../../../theme";

export default function GeneralTab() {
  const {
    openDrawer,
    openModal,
    openSnackBar,
    setOrg,
    org,
    setTheme
  } = useOutletContext();

  const [orgName, setOrgName] = useState(org.name);
  const [isUpdatingBranding, setUpdatingBranding] = useState(false);
  const [isUpdatingName, setUpdatingName] = useState(false);
  const [brandColor, setBrandColor] = useState(org.brandColor);
  const [logoSrc, setLogoSrc] = useState(org.logo);
  const [logoFile, setLogoFile] = useState(null);
  const [isLogoChanged, setLogoChanged] = useState(false);
  const [isLogoLoading, setLogoLoading] = useState(org.logo !== '');

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
    } catch (error) {
      openSnackBar(error.message, 'error');
      setUpdatingName(false);
    }
  };

  const handleUpdateOrgBranding = async () => {
    setUpdatingBranding(true);

    try {
      const fd = new FormData();
      fd.append('logoFile', logoFile);
      fd.append('name', org.name);
      fd.append('brandColor', brandColor);
      fd.append('isLogoChanged', isLogoChanged);
      fd.append('orgId', org.id);

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

  return (
    <>
      <Box mt={4}>
        <TextField
          sx={{ minWidth: '400px' }}
          value={orgName}
          disabled={isUpdatingName}
          onChange={e => setOrgName(e.target.value)}
          variant="standard"
          helperText={`Current organization name`}
          InputProps={{
            endAdornment: <InputAdornment position="end">
              <LoadingButton
                loading={isUpdatingName}
                onClick={handleUpdateOrgName}>
                Save
              </LoadingButton>
            </InputAdornment>
          }}>
        </TextField>
      </Box>

      <Box mt={3.5}>
        <Button
          sx={{ mr: 2 }}
          variant="outlined"
          onClick={() => openDrawer('change-org-or-client')}
          startIcon={<SwapHorizOutlinedIcon />}>
          Change organization
        </Button>
      </Box>
      <Divider sx={{ my: 4 }} />
      <Box>
        <Box component="h4">
          Branding
        </Box>
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

        <Box sx={{ mt: 5, mb: 5, display: 'flex', alignItems: 'center' }}>
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
              display: logoSrc && !isLogoLoading ? 'block' : 'none',
              mr: 2
            }}
            disabled={isUpdatingBranding}
            onClick={handleLogoClear}>
            Clear
          </Button>

          <Skeleton
            variant='circular'
            width={70}
            height={70}
            animation='wave'
            sx={{ display: logoSrc && isLogoLoading ? 'block' : 'none' }}>
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
            Save Changes
          </LoadingButton>
        </Box>
      </Box>

      <Divider sx={{ my: 4 }} />
      <Box>
        <Button
          startIcon={<DeleteIcon />}
          color="error"
          onClick={() => openModal('delete-client')}
          variant="outlined">
          Delete organization
        </Button>
      </Box>
    </>
  );
};
