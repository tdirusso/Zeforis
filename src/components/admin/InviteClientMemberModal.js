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

export default function InviteClientMemberModal(props) {
  const {
    open,
    setOpen,
    clientId,
    clientName,
    accountId,
    setClientMembers,
    setAccountMembers
  } = props;

  const email = useRef();
  const firstName = useRef();
  const lastName = useRef();
  const [isLoading, setLoading] = useState(false);

  const {
    isOpen,
    openSnackBar,
    type,
    message
  } = useSnackbar();

  const handleInviteClientMember = e => {
    e.preventDefault();

    const emailVal = email.current.value;
    const firstNameVal = firstName.current.value;
    const lastNameVal = lastName.current.value;

    if (!emailVal) {
      openSnackBar('Please enter an email addres of the new member.', 'error');
      return;
    }

    if (!firstName || !lastName) {
      openSnackBar('Please enter the full name of the new member.', 'error');
      return;
    }

    setLoading(true);

    setTimeout(async () => {
      try {
        const { user, message, addedToAccount } = await inviteClientMember({
          email: emailVal,
          clientId,
          accountId,
          firstName: firstNameVal,
          lastName: lastNameVal
        });

        if (user) {
          setTimeout(() => {
            openSnackBar('Invitation successfully sent.', 'success');
          }, 250);

          if (addedToAccount) {
            setAccountMembers(members => [...members, user]);
          }

          setClientMembers(members => [...members, user]);
          handleClose();
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
    firstName.current.value = '';
    lastName.current.value = '';
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Invite someone from {clientName}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the name and email address of the user you would like to invite.
            They will have <strong>view only</strong> access.
          </DialogContentText>
          <form onSubmit={handleInviteClientMember}>
            <Box sx={{ mt: 3, display: 'flex' }}>
              <TextField
                label="First name"
                sx={{ flexGrow: 1, mr: 2 }}
                autoFocus
                disabled={isLoading}
                inputRef={firstName}
                required
              >
              </TextField>
              <TextField
                label="Last name"
                sx={{ flexGrow: 1, ml: 2 }}
                disabled={isLoading}
                inputRef={lastName}
                required
              >
              </TextField>
            </Box>
            <Box sx={{ mt: 3, mb: 3 }}>
              <TextField
                label="Email"
                fullWidth
                disabled={isLoading}
                inputRef={email}
                type="email"
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
                onClick={handleInviteClientMember}
                required
                loading={isLoading}>
                Send Invite
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