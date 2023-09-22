import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { useState } from 'react';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { LoadingButton } from '@mui/lab';
import { deleteOrg } from '../../api/orgs';
import { DialogTitle, Typography } from '@mui/material';

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
      <Dialog open={isOpen} onClose={close} className='modal'>
        <DialogTitle>
          Delete Organization
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to <strong>permanently delete {org.name}?</strong>
          </Typography>
          <Typography mt={1} mb={3}>
            If you proceed, all data for this organization will be permanently deleted.
          </Typography>
          <DialogActions style={{ padding: 0 }} className='wrap-on-small'>
            <Button
              disabled={isLoading}
              onClick={close}>
              Cancel
            </Button>
            <LoadingButton
              variant='contained'
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