import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { useState } from 'react';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { LoadingButton } from '@mui/lab';
import { deleteOrg } from '../../api/orgs';

export default function DeleteOrgModal(props) {

  const {
    close,
    isOpen,
    openSnackBar,
    org
  } = props;

  const [isLoading, setLoading] = useState(false);

  const handleDeleteOrg = async () => {
    setLoading(true);

    try {
      const { success, message } = await deleteOrg({
        orgId: org.id
      });

      if (success) {
        setTimeout(() => {
          openSnackBar('Organization deleted.', 'success');
          window.location.href = '/home/dashboard';
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
      <Dialog open={isOpen} onClose={close}>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to <strong>permanently delete {org.name}?</strong>
            <br></br>
            <br></br>
            If you proceed, all data for this organization will be permanently deleted.
          </DialogContentText>
          <DialogActions style={{ marginTop: '2rem', padding: 0 }} className='wrap-on-small'>
            <Button
              disabled={isLoading}
              fullWidth
              variant='outlined'
              onClick={close}>
              Cancel
            </Button>
            <LoadingButton
              variant='contained'
              fullWidth
              onClick={handleDeleteOrg}
              required
              loading={isLoading}
              color="error">
              Yes, delete {org.name}
            </LoadingButton>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </div>
  );
};