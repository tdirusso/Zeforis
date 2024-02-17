import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { useState } from 'react';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { LoadingButton } from '@mui/lab';
import { deleteTasks } from '../../api/tasks';
import { DialogTitle, Typography } from '@mui/material';
import { Task } from '@shared/types/Task';
import { AppContext } from 'src/types/AppContext';
import { Engagement } from '@shared/types/Engagement';

type DeleteTasksModalProps = {
  isOpen: boolean,
  closeModal: () => void,
  taskIds: number[],
  setSelectedTasks: React.Dispatch<React.SetStateAction<number[]>>,
  setTasks: AppContext['setTasks'],
  engagement: Engagement,
  tasksMap: AppContext['tasksMap'],
  openSnackBar: AppContext['openSnackBar'];
};

export default function DeleteTasksModal(props: DeleteTasksModalProps) {

  const {
    isOpen,
    closeModal,
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
          openSnackBar(`Deleted ${deletedLength} tasks.`, 'success');
        }, 250);

        taskIds.forEach(id => delete tasksMap[id]);

        if (setSelectedTasks) {
          setSelectedTasks([]);
        }

        setTasks(Object.values(tasksMap));
        handleClose();
      } else {
        openSnackBar(resultMessage, 'error');
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
      <Dialog
        PaperProps={{
          style: {
            padding: 0
          }
        }}
        open={isOpen}
        onClose={handleClose}
        className='modal'>
        <DialogTitle>
          Delete Tasks
        </DialogTitle>
        <DialogContent>
          <Typography mb={3}>
            Are you sure you want to <strong>permanently delete</strong> {taskIds.length} tasks?
          </Typography>
          <DialogActions style={{ padding: 0 }} className='wrap-on-small'>
            <Button
              disabled={isLoading}
              onClick={handleClose}>
              Cancel
            </Button>
            <LoadingButton
              variant='contained'
              onClick={handleDeleteTasks}
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