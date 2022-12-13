import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useRef, useState } from 'react';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { Box, TextField } from '@mui/material';
import { TwitterPicker } from 'react-color';
import { LoadingButton } from '@mui/lab';
import Snackbar from '../core/Snackbar';
import useSnackbar from '../../hooks/useSnackbar';
import { addClient, setActiveClientId } from '../../api/client';

export default function AddClientModal({ open, setOpen, hideCancel, accountId }) {
  const name = useRef();
  const [brandColor, setBrandColor] = useState('#267ffd');
  const [logoSrc, setLogoSrc] = useState('');
  const [logoFile, setLogoFile] = useState(null);
  const [isLoading, setLoading] = useState(false);

  const {
    isOpen,
    openSnackBar,
    type,
    message
  } = useSnackbar();

  const handleCreateClient = () => {
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
        fd.append('accountId', accountId);

        const { client, message } = await addClient(fd);

        if (client) {
          setActiveClientId(client._id);
          openSnackBar('Client created.', 'success');
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

  const handleClose = () => {
    setOpen(false);
    setLoading(false);
    setBrandColor('#267ffd');
    setLogoSrc('');
    setLogoFile(null);
    name.current.value = '';
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
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create New Client</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the client name and select a brand color below.
          </DialogContentText>
          <Box sx={{ mt: 3, mb: 3 }}>
            <TextField
              label="Client Name"
              fullWidth
              autoFocus
              disabled={isLoading}
              inputRef={name}
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
                display: logoSrc ? 'block' : 'none',
                mr: 4
              }}
              onClick={handleLogoClear}
              disabled={isLoading}>
              Clear
            </Button>
            <img
              src={logoSrc}
              alt=""
              width={125} />
          </Box>
          <DialogActions>
            {
              hideCancel ? '' : <Button
                onClick={handleClose}>
                Cancel
              </Button>
            }
            <LoadingButton
              variant='contained'
              onClick={handleCreateClient}
              loading={isLoading}>
              Create Client
            </LoadingButton>
          </DialogActions>
        </DialogContent>
      </Dialog>
      <Snackbar
        isOpen={isOpen}
        type={type}
        message={message}
      />
    </div >
  );
};