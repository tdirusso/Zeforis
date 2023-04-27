import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { useState } from 'react';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { LoadingButton } from '@mui/lab';
import { removeClientUser } from '../../api/client';
import { useOutletContext } from 'react-router-dom';

export default function RemoveClientUserModal({ open, setOpen, user }) {
  const {
    client,
    accountUsersMap,
    setAccountUsers,
    openSnackBar
  } = useOutletContext();

  const clientId = client.id;
  const clientName = client.name;

  const userId = user?.id;
  const name = user?.firstName + ' ' + user?.lastName;

  const [isLoading, setLoading] = useState(false);

  const willBeRemovedFromAccount =
    user?.memberOfClients.length + user?.adminOfClients.length === 1;

  const handleRemoveClientUser = async () => {
    setLoading(true);

    try {
      const result = await removeClientUser({
        clientId,
        userId
      });

      const success = result.success;
      const resultMessage = result.message;

      if (success) {
        setTimeout(() => {
          openSnackBar('Successully removed.', 'success');
        }, 250);

        if (willBeRemovedFromAccount) {
          setAccountUsers(accountUsers => accountUsers.filter(u => u.id !== user.id));
        } else {
          const theUser = accountUsersMap[user.id];
          theUser.memberOfClients = theUser.memberOfClients.filter(client => client.id !== clientId);
          theUser.adminOfClients = theUser.adminOfClients.filter(client => client.id !== clientId);
          setAccountUsers(Object.values(accountUsersMap));
        }

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
            Are you sure you want to remove <strong>{name}</strong> from <strong>{clientName}?</strong>
            <br></br>
            <br></br>
            You can also manage this user's client access from within the "Organizations" tab.
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
              onClick={handleRemoveClientUser}
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