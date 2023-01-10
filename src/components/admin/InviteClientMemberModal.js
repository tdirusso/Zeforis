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
import { useOutletContext } from 'react-router-dom';

export default function InviteClientMemberModal({open, setOpen}) {

  const {
    client,
    account,
    accountUsers,
    setAccountUsers
  } = useOutletContext();

  const clientId = client.id;
  const clientName = client.name;
  const accountId = account.id;
  const accountName = account.name;

  const email = useRef();
  const firstName = useRef();
  const lastName = useRef();
  const [isLoading, setLoading] = useState(false);

  const accountUsersMap = {};

  accountUsers.forEach(user => accountUsersMap[user.id] = user);

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
        const { success, message, userId } = await inviteClientMember({
          email: emailVal,
          clientId,
          accountId,
          clientName,
          accountName,
          firstName: firstNameVal,
          lastName: lastNameVal
        });

        if (success) {
          setTimeout(() => {
            openSnackBar('Invitation successfully sent.', 'success');
          }, 250);

          const addedUser = {
            id: userId,
            firstName: firstNameVal,
            lastName: lastNameVal,
            email: emailVal
          };

          if (!accountUsersMap[userId]) { // User is new to the account
            addedUser.memberOfClients = [{ id: clientId, name: clientName }];
            addedUser.adminOfClients = [];
            setAccountUsers(members => [...members, addedUser]);
          } else { // User already exists in the account
            const accountUsersClone = [...accountUsers];
            const theExistingUserIndex = accountUsersClone.findIndex(u => u.id === userId);
            accountUsersClone[theExistingUserIndex].memberOfClients.push({ id: clientId, name: clientName });
            setAccountUsers(accountUsersClone);
          }

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
                disabled={isLoading}
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