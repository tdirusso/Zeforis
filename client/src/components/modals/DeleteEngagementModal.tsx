import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { useState } from 'react';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { LoadingButton } from '@mui/lab';
import { deleteEngagement } from '../../api/engagements';
import { DialogTitle, Typography } from '@mui/material';
import { Engagement } from '@shared/types/Engagement';
import { AppContext } from 'src/types/AppContext';
import { Org } from '@shared/types/Org';

type DeleteEngagementModalProps = {
  closeModal: () => void,
  isOpen: boolean,
  engagement: Engagement,
  openSnackBar: AppContext['openSnackBar'],
  org: Org;
};

export default function DeleteEngagementModal(props: DeleteEngagementModalProps) {

  const {
    closeModal,
    isOpen,
    engagement,
    openSnackBar,
    org
  } = props;

  const engagementId = engagement.id;

  const [isLoading, setLoading] = useState(false);

  const handleDeleteEngagement = async () => {
    setLoading(true);

    try {
      const { success, message } = await deleteEngagement({
        engagementId,
        orgId: org.id
      });

      if (success) {
        setTimeout(() => {
          openSnackBar('Engagement deleted.', 'success');
          window.location.href = '/home/dashboard';
        }, 250);
      } else {
        openSnackBar(message, 'error');
        setLoading(false);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        openSnackBar(error.message, 'error');
        setLoading(false);
      }
    }
  };

  return (
    <div>
      <Dialog open={isOpen} onClose={closeModal} className='modal'>
        <DialogTitle>
          Delete Engagement
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to <strong>permanently delete {engagement.name}?</strong>
          </Typography>
          <Typography mt={1} mb={3}>
            If you proceed, all data for this engagement will be permanently deleted.
          </Typography>
          <DialogActions style={{ padding: 0 }} className='wrap-on-small'>
            <Button
              disabled={isLoading}
              onClick={closeModal}>
              Cancel
            </Button>
            <LoadingButton
              variant='contained'
              onClick={handleDeleteEngagement}
              loading={isLoading}
              color="error">
              Yes, delete {engagement.name}
            </LoadingButton>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </div>
  );
};