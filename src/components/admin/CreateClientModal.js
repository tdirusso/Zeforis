import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useRef, useState } from 'react';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { Box, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { createClient, setActiveClientId } from '../../api/clients';
import { useOutletContext } from 'react-router-dom';

export default function CreateClientModal({ open, setOpen, hideCancel, org }) {
  const name = useRef();
  const [isLoading, setLoading] = useState(false);

  const { openSnackBar } = useOutletContext();

  const handleCreateClient = async () => {
    const nameVal = name.current.value;

    if (!nameVal) {
      openSnackBar('Please enter a name for the new client.', 'error');
      return;
    }

    setLoading(true);

    try {
      const fd = new FormData();
      fd.append('name', nameVal);
      fd.append('orgid', org.id);

      const { client, message } = await createClient(fd);

      if (client) {
        setActiveClientId(client.id);
        openSnackBar('Client created.', 'success');
        setTimeout(() => {
          window.location.href = '/home/dashboard';
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
    setLoading(false);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{ sx: { minWidth: 500 } }}>
        <DialogTitle>Create New Client</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the client name below.
          </DialogContentText>
          <Box sx={{ mt: 3, mb: 3 }}>
            <TextField
              label="Client Name"
              fullWidth
              autoFocus
              disabled={isLoading}
              inputRef={name}>
            </TextField>
          </Box>
          <DialogActions sx={{ p: 0 }}>
            {
              hideCancel ? '' :
                <Button
                  fullWidth
                  variant='outlined'
                  onClick={handleClose}
                  disabled={isLoading}>
                  Cancel
                </Button>
            }
            <LoadingButton
              variant='contained'
              fullWidth
              onClick={handleCreateClient}
              loading={isLoading}>
              Create Client
            </LoadingButton>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </>
  );
};