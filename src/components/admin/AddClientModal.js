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
import { addClient } from '../../api/client';

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

    if (!name) {
      openSnackBar('Please enter a name for the new client.', 'error');
      return;
    }

    setLoading(true);

    setTimeout(async () => {
      try {
        const { client, message } = await addClient({
          name,
          brandColor
        });

        if (client) {
          console.log(client);
          openSnackBar('Client created.', 'success');
          handleClose();
        } else {
          openSnackBar(message, 'error');
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
    setName('');
    setBrandColor('#267ffd');
  };

  return (
    <div>
      <Dialog open={open} onClose={() => setOpen(false)}>
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
              onChange={e => setName(e.target.value)}>
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