import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from 'react';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { LoadingButton } from '@mui/lab';
import Snackbar from '../core/Snackbar';
import useSnackbar from '../../hooks/useSnackbar';
import { removeTask } from '../../api/task';
import { useNavigate } from 'react-router-dom';

export default function RemoveTaskModal(props) {

  const {
    open,
    setOpen,
    task,
    setTasks,
    clientId,
    exitPath
  } = props;

  const navigate = useNavigate();

  const [isLoading, setLoading] = useState(false);

  const {
    isOpen,
    openSnackBar,
    type,
    message
  } = useSnackbar();

  const handleRemoveTask = () => {
    setLoading(true);

    setTimeout(async () => {
      try {
        const result = await removeTask({
          clientId,
          taskId: task.task_id
        });

        const success = result.success;
        const resultMessage = result.message;

        if (success) {
          if (exitPath) {
            openSnackBar('Successully removed.', 'success');

            setTimeout(() => {
              navigate(exitPath);
              setTasks(tasks => tasks.filter(t => t.task_id !== task.task_id));
            }, 1000);
          } else {
            setTimeout(() => {
              openSnackBar('Successully removed.', 'success');
            }, 250);

            setTasks(tasks => tasks.filter(t => t.task_id !== task.task_id));
            handleClose();
          }
        } else {
          openSnackBar(resultMessage, 'error');
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
        <DialogTitle>Confirm Task Removal</DialogTitle>
        <DialogContent >
          <DialogContentText sx={{ mb: 5 }}>
            Are you sure you want to delete the task <strong>"{task?.task_name}"</strong>?
          </DialogContentText>
          <DialogActions>
            <Button
              disabled={isLoading}
              onClick={handleClose}>
              Cancel
            </Button>
            <LoadingButton
              variant='contained'
              onClick={handleRemoveTask}
              required
              loading={isLoading}
              color="error">
              Yes, Delete Task
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