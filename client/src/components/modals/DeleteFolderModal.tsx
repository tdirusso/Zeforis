import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { useState } from 'react';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { LoadingButton } from '@mui/lab';
import { deleteFolder } from '../../api/folders';
import { DialogTitle, Typography } from '@mui/material';
import { Engagement } from '@shared/types/Engagement';
import { AppContext } from 'src/types/AppContext';

type DeleteFolderModalProps = {
  isOpen: boolean,
  closeModal: () => void,
  folderId: number,
  engagement: Engagement,
  foldersMap: AppContext['foldersMap'],
  setFolders: AppContext['setFolders'],
  setTasks: AppContext['setTasks'],
  openSnackBar: AppContext['openSnackBar'];
};

export default function DeleteFolderModal(props: DeleteFolderModalProps) {

  const {
    isOpen,
    closeModal,
    folderId,
    engagement,
    foldersMap,
    setFolders,
    setTasks,
    openSnackBar
  } = props;

  const engagementId = engagement.id;
  const folder = foldersMap[folderId];

  const [isLoading, setLoading] = useState(false);

  const handleDeleteFolder = async () => {
    setLoading(true);
    try {
      const { success, message } = await deleteFolder({
        engagementId,
        folderId: folder.id
      });

      if (success) {
        setTimeout(() => {
          openSnackBar(`Successfully deleted.`, 'success');
        }, 250);

        delete foldersMap[folder.id];

        setTasks(tasks => tasks.filter(t => t.folder_id !== folder.id));
        setFolders(Object.values(foldersMap));
        handleClose();
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

  const handleClose = () => {
    closeModal();
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  return (
    <div>
      <Dialog open={isOpen} onClose={handleClose} className='modal'>
        <DialogTitle>
          Delete Folder
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to <strong>permanently delete {folder?.name}</strong>?
          </Typography>
          <Typography mt={1} mb={3}>
            All tasks in this folder will be deleted.
          </Typography>
          <DialogActions style={{ padding: 0 }} className='wrap-on-small'>
            <Button
              disabled={isLoading}
              onClick={handleClose}>
              Cancel
            </Button>
            <LoadingButton
              variant='contained'
              onClick={handleDeleteFolder}
              loading={isLoading}
              color="error">
              Yes, Delete
            </LoadingButton>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </div>
  );
};