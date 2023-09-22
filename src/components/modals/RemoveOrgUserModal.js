import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { useState } from 'react';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { LoadingButton } from '@mui/lab';
import { removeUser } from '../../api/engagements';
import { DialogTitle, Typography } from '@mui/material';

export default function RemoveOrgUserModal(props) {
  const {
    isOpen,
    close,
    org,
    setOrgUsers,
    openSnackBar,
    userToRemove
  } = props;

  const orgId = org.id;
  const orgName = org.name;
  const userId = userToRemove?.id;
  const name = userToRemove?.firstName + ' ' + userToRemove?.lastName;

  const [isLoading, setLoading] = useState(false);

  const handleRemoveOrgUser = async () => {
    setLoading(true);

    try {
      const result = await removeUser({
        orgId,
        userId
      });

      const success = result.success;
      const resultMessage = result.message;

      if (success) {
        setTimeout(() => {
          openSnackBar('Successully removed.', 'success');
        }, 250);

        setOrgUsers(orgUsers => orgUsers.filter(u => u.id !== userToRemove.id));
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
    close();
    setLoading(false);
  };

  return (
    <div>
      <Dialog open={isOpen} onClose={close} className='modal'>
        <DialogTitle>
          Remove User
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to remove <strong>{name}</strong> from <strong>{orgName}?</strong>
          </Typography>
          <Typography mt={1} mb={3}>
            Proceeding will remove them from all engagements within {orgName} and unassign all tasks that are currently assigned to them.
          </Typography>
          <DialogActions style={{ padding: 0 }} className='wrap-on-small'>
            <Button
              disabled={isLoading}
              onClick={handleClose}>
              Cancel
            </Button>
            <LoadingButton
              variant='contained'
              onClick={handleRemoveOrgUser}
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