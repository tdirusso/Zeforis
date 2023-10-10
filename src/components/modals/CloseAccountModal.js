import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { useState } from 'react';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { LoadingButton } from '@mui/lab';
import { DialogTitle, Typography } from '@mui/material';
import { closeAccount } from '../../api/users';

export default function CloseAccountModal(props) {

  const {
    close,
    isOpen,
    openSnackBar
  } = props;

  const [isLoading, setLoading] = useState(false);

  const handleCloseAccount = async () => {
    setLoading(true);

    try {
      const { success, message } = await closeAccount();

      if (success) {
        setTimeout(() => {
          openSnackBar('Account closed.', 'success');
          window.location.href = '/login';
        }, 1000);
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
      <Dialog open={isOpen} onClose={close} className='modal'>
        <DialogTitle>
          Close Account
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to close your account?
          </Typography>
          <Typography mt={1} mb={3}>
            If you proceed, all of your data will be permanently and immediately deleted and any active subscription will be deleted.
          </Typography>
          <DialogActions style={{ padding: 0 }} className='wrap-on-small'>
            <Button
              disabled={isLoading}
              onClick={close}>
              Cancel
            </Button>
            <LoadingButton
              variant='contained'
              onClick={handleCloseAccount}
              required
              loading={isLoading}
              color="error">
              Yes, close account
            </LoadingButton>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </div>
  );
};