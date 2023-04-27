import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { useState } from 'react';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { LoadingButton } from '@mui/lab';
import { removeUser } from '../../api/client';
import { useOutletContext } from 'react-router-dom';

export default function RemoveUserModal({ open, setOpen, user }) {
  const {
    account,
    setAccountUsers,
    openSnackBar
  } = useOutletContext();

  const accountId = account.id;
  const accountName = account.name;
  const userId = user?.id;
  const name = user?.firstName + ' ' + user?.lastName;

  const [isLoading, setLoading] = useState(false);

  const handleRemoveUser = async () => {
    setLoading(true);

    try {
      const result = await removeUser({
        accountId,
        userId
      });

      const success = result.success;
      const resultMessage = result.message;

      if (success) {
        setTimeout(() => {
          openSnackBar('Successully removed.', 'success');
        }, 250);

        setAccountUsers(accountUsers => accountUsers.filter(u => u.id !== user.id));
        handleClose();
      } else {
        openSnackBar(resultMessage, 'error');
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
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent >
          <DialogContentText sx={{ mb: 5 }}>
            Are you sure you want to remove <strong>{name}</strong> from <strong>{accountName}?</strong>
            <br></br>
            <br></br>
            Proceeding will remove them from all clients within {accountName} and unassign all tasks that are currently assigned to them.
          </DialogContentText>
          <DialogActions sx={{ p: 0 }}>
            <Button
              fullWidth
              disabled={isLoading}
              variant='outlined'
              onClick={handleClose}>
              Cancel
            </Button>
            <LoadingButton
              fullWidth
              variant='contained'
              onClick={handleRemoveUser}
              required
              loading={isLoading}
              color="error">
              Yes, remove {name}
            </LoadingButton>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </div>
  );
};