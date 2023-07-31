import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { useState } from 'react';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { LoadingButton } from '@mui/lab';
import { deleteClient } from '../../api/clients';

export default function DeleteClientModal(props) {

  const {
    close,
    isOpen, 
    client,
    openSnackBar
  } = props;

  const clientId = client.id;

  const [isLoading, setLoading] = useState(false);

  const handleDeleteClient = async () => {
    setLoading(true);

    try {
      const { success, message } = await deleteClient({
        clientId
      });

      if (success) {
        setTimeout(() => {
          openSnackBar('Successully deleted.', 'success');
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

  return (
    <div>
      <Dialog open={isOpen} onClose={close}>
        <DialogContent>
          <DialogContentText sx={{ mb: 5 }}>
            Are you sure you want to <strong>permanently delete "{client.name}"?</strong>
            <br></br>
            <br></br>
            If you proceed, ALL folders, tasks and tags will be deleted.
          </DialogContentText>
          <DialogActions sx={{ p: 0 }}>
            <Button
              disabled={isLoading}
              fullWidth
              variant='outlined'
              onClick={close}>
              Cancel
            </Button>
            <LoadingButton
              variant='contained'
              fullWidth
              onClick={handleDeleteClient}
              required
              loading={isLoading}
              color="error">
              Yes, delete {client.name}
            </LoadingButton>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </div>
  );
};