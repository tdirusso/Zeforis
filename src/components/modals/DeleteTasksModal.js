import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { useState } from 'react';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { LoadingButton } from '@mui/lab';
import { deleteTasks } from '../../api/tasks';
import DeleteIcon from '@mui/icons-material/Delete';

export default function DeleteTasksModal(props) {

  const {
    isOpen,
    close,
    taskIds = [],
    setSelectedTasks,
    setTasks,
    engagement,
    tasksMap,
    openSnackBar
  } = props;

  const engagementId = engagement.id;

  const [isLoading, setLoading] = useState(false);

  const handleDeleteTasks = async () => {
    setLoading(true);

    try {
      const result = await deleteTasks({
        engagementId,
        taskIds
      });

      const success = result.success;
      const resultMessage = result.message;

      if (success) {
        const deletedLength = taskIds.length;

        setTimeout(() => {
          openSnackBar(`Successully deleted ${deletedLength} tasks.`, 'success');
        }, 250);

        taskIds.forEach(id => delete tasksMap[id]);

        setTasks(Object.values(tasksMap));
        setSelectedTasks([]);
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
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  return (
    <div>
      <Dialog open={isOpen} onClose={handleClose} className='modal'>
        <DialogContent>
          <DialogContentText style={{ marginBottom: '2rem' }}>
            Are you sure you want to <strong>permanently delete</strong> {taskIds.length} tasks?
          </DialogContentText>
          <DialogActions style={{ padding: 0 }} className='wrap-on-small'>
            <Button
              disabled={isLoading}
              fullWidth
              variant='outlined'
              onClick={handleClose}>
              Cancel
            </Button>
            <LoadingButton
              variant='contained'
              onClick={handleDeleteTasks}
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