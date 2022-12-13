import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useRef, useState } from 'react';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { Box, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Snackbar from '../core/Snackbar';
import useSnackbar from '../../hooks/useSnackbar';
import { inviteClientMember } from '../../api/client';

export default function InviteClientMemberModal({ open, setOpen, clientId, clientName }) {
  const email = useRef();
  const [isLoading, setLoading] = useState(false);

  const {
    isOpen,
    openSnackBar,
    type,
    message
  } = useSnackbar();

  const handleInviteClientMember = () => {
    const emailVal = email.current.value;

    if (!emailVal) {
      openSnackBar('Please enter an email addres for the new member.', 'error');
      return;
    }

    setLoading(true);

    setTimeout(async () => {
      try {
        const { success, message } = await inviteClientMember({
          email: emailVal,
          clientId
        });

        console.log(success, message);

        if (success) {

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
    setLoading(false);
    email.current.value = '';
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Invite someone from {clientName}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the email address of the user you would like to invite.
            They will have <strong>view only</strong> access.
          </DialogContentText>
          <Box sx={{mt: 3, mb: 3}}>
            <TextField
              label="Email"
              fullWidth
              autoFocus
              disabled={isLoading}
              inputRef={email}
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
              onClick={handleInviteClientMember}
              loading={isLoading}>
              Send Invite
            </LoadingButton>
          </DialogActions>
        </DialogContent>
      </Dialog>
      <Snackbar
        isOpen={isOpen}
        type={type}
        message={message}
      />
    </div >
  );
};