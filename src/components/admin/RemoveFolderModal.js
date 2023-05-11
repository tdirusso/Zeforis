import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { useState } from 'react';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { LoadingButton } from '@mui/lab';
import { useOutletContext } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import { removeFoldeer } from '../../api/folders';

export default function RemoveFolderModal(props) {

  const {
    open,
    setOpen,
    folder
  } = props;

  const {
    client,
    foldersMap,
    setFolders,
    setTasks,
    openSnackBar
  } = useOutletContext();

  const clientId = client.id;

  const [isLoading, setLoading] = useState(false);

  const handleRemoveFolder = async () => {
    setLoading(true);
    try {
      const { success, message } = await removeFoldeer({
        clientId,
        folderId: folder.id
      });

      if (success) {
        setTimeout(() => {
          openSnackBar(`Folder successfully removed.`, 'success');
        }, 250);

        delete foldersMap[folder.id];

        setTasks(tasks => tasks.filter(t => t.folder_id !== folder.id));
        setFolders(Object.values(foldersMap));
        handleClose();
      } else {
        openSnackBar(message, 'error');
        setLoading(false);
      }
    } catch (error) {
      openSnackBar(error.message, 'error');
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Are you sure you want to <strong>permanently delete {folder?.name}</strong>?
            All tasks in this folder will be deleted.
          </DialogContentText>
          <DialogActions sx={{ p: 0 }}>
            <Button
              disabled={isLoading}
              fullWidth
              variant='outlined'
              onClick={handleClose}>
              Cancel
            </Button>
            <LoadingButton
              variant='contained'
              onClick={handleRemoveFolder}
              required
              fullWidth
              loading={isLoading}
              startIcon={<DeleteIcon />}
              color="error">
              Yes, Delete
            </LoadingButton>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </div>
  );
};