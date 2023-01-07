import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { useState } from 'react';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { LoadingButton } from '@mui/lab';
import Snackbar from '../core/Snackbar';
import useSnackbar from '../../hooks/useSnackbar';
import { useOutletContext } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import { removeFoldeer } from '../../api/folder';

export default function RemoveFolderModal(props) {

  const {
    open,
    setOpen,
    folder
  } = props;

  const {
    client,
    foldersMap,
    setFolders
  } = useOutletContext();

  const clientId = client.id;

  const [isLoading, setLoading] = useState(false);

  const {
    isOpen,
    openSnackBar,
    type,
    message
  } = useSnackbar();

  const handleRemoveFolder = () => {
    setLoading(true);

    setTimeout(async () => {
      try {
        const { success, message } = await removeFoldeer({
          clientId,
          folderId: folder.id
        });

        if (success) {
          setTimeout(() => {
            openSnackBar(`Successully removed ${folder.name}.`, 'success');
          }, 250);

          delete foldersMap[folder.id];


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
    }, 1000);
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
      <Snackbar
        isOpen={isOpen}
        type={type}
        message={message}
      />
    </div>
  );
};