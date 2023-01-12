import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { useState } from 'react';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { LoadingButton } from '@mui/lab';
import Snackbar from '../core/Snackbar';
import useSnackbar from '../../hooks/useSnackbar';
import { removeClient } from '../../api/client';
import { useOutletContext } from 'react-router-dom';

export default function RemoveClientModal({ open, setOpen }) {
  const {
    client
  } = useOutletContext();

  const clientId = client.id;

  const [isLoading, setLoading] = useState(false);

  const {
    isOpen,
    openSnackBar,
    type,
    message
  } = useSnackbar();

  const handleRemoveClient = async () => {
    setLoading(true);

    try {
      const { success, message } = await removeClient({
        clientId
      });

      if (success) {
        setTimeout(() => {
          openSnackBar('Successully removed.', 'success');
          window.location.href = '/home/dashboard';
        }, 250);
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
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <DialogContentText sx={{ mb: 5 }}>
            Are you sure you want to <strong>permanently remove "{client.name}"?</strong>
            <br></br>
            <br></br>
            If you proceed, ALL folders, tasks and tags will be deleted.
          </DialogContentText>
          <DialogActions sx={{ p: 0 }}>
            <Button
              disabled={isLoading}
              fullWidth
              variant='outlined'
              onClick={handleClose}>
              Cancel
            </Button>
            <LoadingButton
              variant='contained'
              fullWidth
              onClick={handleRemoveClient}
              required
              loading={isLoading}
              color="error">
              Yes, remove {client.name}
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