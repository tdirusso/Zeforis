import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from 'react';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { LoadingButton } from '@mui/lab';
import Snackbar from '../core/Snackbar';
import useSnackbar from '../../hooks/useSnackbar';
import { removeClientMember } from '../../api/client';

export default function RemoveClientMemberModal(props) {
  const {
    open,
    setOpen,
    clientId,
    clientName,
    accountId,
    user,
    setClientMembers,
    setAccountMembers
  } = props;

  const userId = user?.id;
  const name = user?.firstName + ' ' + user?.lastName;

  const [isLoading, setLoading] = useState(false);

  const {
    isOpen,
    openSnackBar,
    type,
    message
  } = useSnackbar();

  const handleRemoveClientMember = () => {
    setLoading(true);

    setTimeout(async () => {
      try {
        const result = await removeClientMember({
          clientId,
          accountId,
          userId
        });

        const updatedUser = result.user;
        const resultMessage = result.message;
        const removedFromAccount = result.removedFromAccount;

        if (updatedUser) {
          setTimeout(() => {
            openSnackBar('Successully removed.', 'success');
          }, 250);

          if (removedFromAccount) {
            setAccountMembers(members => members.filter(member => member.id !== user.id));
          }

          setClientMembers(members => members.filter(member => member.id !== user.id));
          handleClose();
        } else {
          openSnackBar(resultMessage, 'error');
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
        <DialogTitle>Confirm Member Removal</DialogTitle>
        <DialogContent >
          <DialogContentText sx={{ mb: 5 }}>
            Are you sure you want to remove <strong>{name}</strong> from <strong>{clientName}?</strong>
          </DialogContentText>
          <DialogActions>
            <Button
              onClick={handleClose}>
              Cancel
            </Button>
            <LoadingButton
              variant='contained'
              onClick={handleRemoveClientMember}
              required
              loading={isLoading}
              color="error">
              Yes, remove {name}
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