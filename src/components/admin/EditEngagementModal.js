import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useState, useRef } from 'react';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { Box, DialogContentText, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { setActiveEngagementId, updateEngagement } from '../../api/engagements';
import { useOutletContext } from 'react-router-dom';

export default function EditEngagementModal({ open, setOpen, engagementToUpdate }) {
  const name = useRef(engagementToUpdate.name);
  const [isLoading, setLoading] = useState(false);

  const { openSnackBar } = useOutletContext();

  const handleUpdateEngagement = async () => {
    const nameVal = name.current.value;

    if (!nameVal) {
      openSnackBar('Please enter a name for the new engagement.', 'error');
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('name', nameVal);
      fd.append('engagementId', engagementToUpdate.id);

      const { engagement, message } = await updateEngagement(fd);

      if (engagement) {
        setActiveEngagementId(engagement.id);
        openSnackBar('Engagement updated.', 'success');
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
        <DialogTitle>Edit {engagementToUpdate.name}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You can modify the engagement name below.
          </DialogContentText>
          <Box sx={{ mt: 3, mb: 3 }}>
            <TextField
              label="Engagement Name"
              fullWidth
              autoFocus
              disabled={isLoading}
              inputRef={name}
              defaultValue={engagementToUpdate.name}
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
              onClick={handleUpdateEngagement}
              loading={isLoading}>
              Update
            </LoadingButton>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </div>
  );
};