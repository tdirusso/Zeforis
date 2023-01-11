import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { useState } from 'react';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { LoadingButton } from '@mui/lab';
import Snackbar from '../core/Snackbar';
import useSnackbar from '../../hooks/useSnackbar';
import { removeTag } from '../../api/client';
import { useOutletContext } from 'react-router-dom';

export default function RemoveTagModal({ open, setOpen, tag }) {
  const {
    client,
    setTags,
    tasks,
    setTasks
  } = useOutletContext();

  const clientId = client.id;

  const [isLoading, setLoading] = useState(false);

  const {
    isOpen,
    openSnackBar,
    type,
    message
  } = useSnackbar();

  const handleRemoveTag = async () => {
    setLoading(true);

    try {
      const result = await removeTag({
        clientId,
        tagId: tag.id
      });

      const success = result.success;
      const resultMessage = result.message;

      if (success) {
        const tasksClone = [...tasks];
        tasksClone.forEach(task => {
          if (task.tags) {
            task.tags.replace(tag.id, '');
          }
        });

        setTimeout(() => {
          openSnackBar('Successully removed.', 'success');
        }, 250);

        setTags(curTags => curTags.filter(t => t.id !== tag.id));
        setTasks(tasksClone);
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
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <DialogContentText sx={{ mb: 5 }}>
            Are you sure you want to remove the <strong>"{tag?.name}"</strong> tag?
            <br></br>
            <br></br>
            If you proceed, the tag will be removed from all tasks in which is it currently placed.
          </DialogContentText>
          <DialogActions>
            <Button
              disabled={isLoading}
              onClick={handleClose}>
              Cancel
            </Button>
            <LoadingButton
              variant='contained'
              onClick={handleRemoveTag}
              required
              loading={isLoading}
              color="error">
              Yes, remove "{tag?.name}"
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