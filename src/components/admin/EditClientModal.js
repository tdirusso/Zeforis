import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useState, useRef } from 'react';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { Box, DialogContentText, Skeleton, TextField } from '@mui/material';
import { TwitterPicker } from 'react-color';
import { LoadingButton } from '@mui/lab';
import Snackbar from '../core/Snackbar';
import useSnackbar from '../../hooks/useSnackbar';
import { setActiveClientId, updateClient } from '../../api/client';

export default function EditClientModal({ open, setOpen, clientToUpdate }) {
  const name = useRef(clientToUpdate.name);
  const [brandColor, setBrandColor] = useState(clientToUpdate.brandColor);
  const [logoSrc, setLogoSrc] = useState(clientToUpdate.logoUrl);
  const [logoFile, setLogoFile] = useState(null);
  const [isLogoChanged, setLogoChanged] = useState(false);
  const [isLogoLoading, setLogoLoading] = useState(clientToUpdate.logoUrl !== '');
  const [isLoading, setLoading] = useState(false);

  const {
    isOpen,
    openSnackBar,
    type,
    message
  } = useSnackbar();

  const handleUpdateClient = () => {
    const nameVal = name.current.value;

    if (!nameVal) {
      openSnackBar('Please enter a name for the new client.', 'error');
      return;
    }

    setLoading(true);

    setTimeout(async () => {
      try {
        const fd = new FormData();
        fd.append('logoFile', logoFile);
        fd.append('name', nameVal);
        fd.append('brandColor', brandColor);
        fd.append('isLogoChanged', isLogoChanged);
        fd.append('clientId', clientToUpdate.id);

        const { client, message } = await updateClient(fd);

        if (client) {
          setActiveClientId(client.id);
          openSnackBar('Client updated.', 'success');
          setTimeout(() => {
            window.location.reload();
          }, 500);
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

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      setLogoSrc(clientToUpdate.logoUrl);
      setLogoFile(null);
      setBrandColor(clientToUpdate.brandColor);
      setLogoChanged(false);
    }, 500);
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit {clientToUpdate.name}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You can modify the client name, branding and logo below.
          </DialogContentText>
          <Box sx={{ mt: 3, mb: 3 }}>
            <TextField
              label="Client Name"
              fullWidth
              autoFocus
              disabled={isLoading}
              inputRef={name}
              defaultValue={clientToUpdate.name}
            >
            </TextField>
          </Box>
          <Box sx={{ mb: 3, mt: 3, display: 'flex', alignItems: 'center' }}>
            <TwitterPicker
              color={brandColor}
              onChange={color => setBrandColor(color.hex)} />
            <Box
              sx={{
                background: brandColor,
                borderRadius: '6px',
                height: '50px',
                width: '50px',
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
              disabled={isLoading}>
              Upload Logo
              <input
                hidden
                accept="image/png,image/jpeg"
                type="file"
                onChange={handleLogoChange}
                disabled={isLoading}
              />
            </Button>
            <Button
              sx={{
                display: logoSrc && !isLogoLoading ? 'block' : 'none',
                mr: 2
              }}
              disabled={isLoading}
              onClick={handleLogoClear}>
              Clear
            </Button>
            <Skeleton
              variant='circular'
              width={70}
              height={70}
              animation='wave'
              sx={{ display: isLogoLoading ? 'block' : 'none' }}>
            </Skeleton>
            <img
              //src={logoSrc}
              alt=""
              width={125}
              onLoad={() => setLogoLoading(false)}
            />
          </Box>
          <DialogActions>
            <Button
              disabled={isLoading}
              onClick={handleClose}>
              Cancel
            </Button>
            <LoadingButton
              variant='contained'
              onClick={handleUpdateClient}
              loading={isLoading}>
              Update
            </LoadingButton>
          </DialogActions>
        </DialogContent>
      </Dialog>
      <Snackbar
        isOpen={isOpen}
        type={type}
        message={message}
      />
    </div>
  );
};