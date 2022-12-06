import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useEffect, useState } from 'react';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { Box, TextField } from '@mui/material';
import { TwitterPicker } from 'react-color';
import { LoadingButton } from '@mui/lab';
import Snackbar from '../core/Snackbar';
import useSnackbar from '../../hooks/useSnackbar';
import { updateClient } from '../../api/client';

export default function EditClientModal({ open, setOpen, clientToUpdate }) {

  const [name, setName] = useState(clientToUpdate.name);
  const [brandColor, setBrandColor] = useState(clientToUpdate.brandColor);
  const [isLoading, setLoading] = useState(false);

  const {
    isOpen,
    openSnackBar,
    type,
    message
  } = useSnackbar();

  useEffect(() => {
    setName(clientToUpdate.name);
    setBrandColor(clientToUpdate.brandColor);
  }, [clientToUpdate]);

  const handleUpdateClient = () => {
    if (!name) {
      openSnackBar('Please enter a name for the new client.', 'error');
      return;
    }

    setLoading(true);

    setTimeout(async () => {
      try {
        const { client, message } = await updateClient({
          name,
          brandColor,
          clientId: clientToUpdate._id
        });

        if (client) {
          openSnackBar('Client updated.', 'success');
          setOpen(false);
          setTimeout(() => {
            window.location.reload();
          }, 500);
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
    setName(clientToUpdate.name);
    setBrandColor(clientToUpdate.brandColor);
  };

  return (
    <div>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Edit {clientToUpdate.name}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 3, mb: 3 }}>
            <TextField
              label="Client Name"
              fullWidth
              autoFocus
              disabled={isLoading}
              defaultValue={name}
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