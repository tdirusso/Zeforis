import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { useState } from 'react';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { LoadingButton } from '@mui/lab';
import { deleteEngagement } from '../../api/engagements';

export default function DeleteEngagementModal(props) {

  const {
    close,
    isOpen, 
    engagement,
    openSnackBar
  } = props;

  const engagementId = engagement.id;

  const [isLoading, setLoading] = useState(false);

  const handleDeleteEngagement = async () => {
    setLoading(true);

    try {
      const { success, message } = await deleteEngagement({
        engagementId
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
            Are you sure you want to <strong>permanently delete "{engagement.name}"?</strong>
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
              onClick={handleDeleteEngagement}
              required
              loading={isLoading}
              color="error">
              Yes, delete {engagement.name}
            </LoadingButton>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </div>
  );
};