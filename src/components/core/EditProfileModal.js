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
import { updateProfile } from '../../api/user';

export default function EditProfileModal({ open, setOpen, user, setFirstName, setLastName }) {
  const firstName = useRef(user.firstName);
  const lastName = useRef(user.lastName);
  const [isLoading, setLoading] = useState(false);

  const {
    isOpen,
    openSnackBar,
    type,
    message
  } = useSnackbar();

  const handleUpdateProfile = e => {
    e.preventDefault();

    const firstNameVal = firstName.current.value;
    const lastNameVal = lastName.current.value;

    if (!firstNameVal || !lastNameVal) {
      openSnackBar('Please enter a first and last name.', 'error');
      return;
    }

    setLoading(true);

    setTimeout(async () => {
      try {

        const { success, message } = await updateProfile({
          firstName: firstNameVal,
          lastName: lastNameVal
        });

        if (success) {
          setTimeout(() => {
            openSnackBar('Profile updated.', 'success');
          }, 300);
          setFirstName(firstNameVal);
          setLastName(lastNameVal);
          setOpen(false);
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
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You can edit your first and last name below.
          </DialogContentText>
          <form onSubmit={handleUpdateProfile}>
            <Box sx={{ mt: 4, mb: 3, display: 'flex' }}>
              <TextField
                label="First name"
                fullWidth
                autoFocus
                disabled={isLoading}
                inputRef={firstName}
                defaultValue={user.firstName}
                required
                sx={{ mr: 3 }}
              >
              </TextField>
              <TextField
                label="Last name"
                fullWidth
                disabled={isLoading}
                inputRef={lastName}
                defaultValue={user.lastName}
                required
              >
              </TextField>
            </Box>
            <DialogActions>
              <Button
                onClick={handleClose}>
                Cancel
              </Button>
              <LoadingButton
                variant='contained'
                type='submit'
                onClick={handleUpdateProfile}
                loading={isLoading}>
                Update
              </LoadingButton>
            </DialogActions>
          </form>
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