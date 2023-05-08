import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { useState } from 'react';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { LoadingButton } from '@mui/lab';
import { useOutletContext } from 'react-router-dom';
import { deleteTag } from '../../api/tags';

export default function DeleteTagModal({ open, setOpen, tag }) {
  const {
    client,
    setTags,
    tasks,
    setTasks,
    openSnackBar
  } = useOutletContext();

  const clientId = client.id;

  const [isLoading, setLoading] = useState(false);

  const handleDeleteTag = async () => {
    setLoading(true);

    try {
      const result = await deleteTag({
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
          openSnackBar('Successully deleted.', 'success');
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
            Are you sure you want to delete the <strong>"{tag?.name}"</strong> tag?
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
              onClick={handleDeleteTag}
              required
              loading={isLoading}
              color="error">
              Yes, delete "{tag?.name}"
            </LoadingButton>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </div>
  );
};