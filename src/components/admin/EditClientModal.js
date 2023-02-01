import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useState, useRef } from 'react';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { Box, DialogContentText, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Snackbar from '../core/Snackbar';
import useSnackbar from '../../hooks/useSnackbar';
import { setActiveClientId, updateClient } from '../../api/client';

export default function EditClientModal({ open, setOpen, clientToUpdate }) {
  const name = useRef(clientToUpdate.name);
  const [isLoading, setLoading] = useState(false);

  const {
    isOpen,
    openSnackBar,
    type,
    message
  } = useSnackbar();

  const handleUpdateClient = async () => {
    const nameVal = name.current.value;

    if (!nameVal) {
      openSnackBar('Please enter a name for the new client.', 'error');
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('name', nameVal);
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
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog
        open={open}
        PaperProps={{ sx: { minWidth: 500 } }}
        onClose={handleClose}>
        <DialogTitle>Edit {clientToUpdate.name}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You can modify the client name below.
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
          <DialogActions sx={{ p: 0 }}>
            <Button
              fullWidth
              variant='outlined'
              disabled={isLoading}
              onClick={handleClose}>
              Cancel
            </Button>
            <LoadingButton
              variant='contained'
              fullWidth
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