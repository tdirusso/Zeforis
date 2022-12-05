import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from 'react';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { Box, TextField } from '@mui/material';
import { TwitterPicker } from 'react-color';
import { LoadingButton } from '@mui/lab';
import Snackbar from '../core/Snackbar';
import useSnackbar from '../../hooks/useSnackbar';

export default function AddClientModal({ open, setOpen }) {

  const [name, setName] = useState('');
  const [brandColor, setBrandColor] = useState('#267ffd');
  const [isLoading, setLoading] = useState(false);

  const {
    isOpen,
    openSnackBar,
    type,
    message
  } = useSnackbar();

  const handleCreateClient = () => {
    setLoading(true);

    setTimeout(() => {
      openSnackBar('Client created.', 'success');
      handleClose();
    }, 1000);
  };

  const handleClose = () => {
    setLoading(false);
    setName('');
    setOpen(false);
  };

  return (
    <div>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Create New Client</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the client name and select a brand color below.
          </DialogContentText>
          <Box sx={{ mt: 2, mb: 2 }}>
            <TextField
              label="Client Name"
              fullWidth
              autoFocus
              disabled={isLoading}>
            </TextField>
          </Box>
          <Box sx={{ mb: 2, mt: 2, display: 'flex', alignItems: 'center' }}>
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
          <DialogActions>
            <Button
              onClick={handleClose}>
              Cancel
            </Button>
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
    </div>
  );
};