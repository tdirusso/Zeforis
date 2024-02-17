import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { useState } from 'react';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { LoadingButton } from '@mui/lab';
import { removeOrgUser } from '../../api/orgs';
import { DialogTitle, Typography } from '@mui/material';
import { AppContext } from 'src/types/AppContext';
import { User } from '@shared/types/User';
import { Org } from '@shared/types/Org';
import { Task } from '@shared/types/Task';

type RemoveOrgUserModalProps = {
  isOpen: boolean,
  closeModal: () => void,
  org: Org,
  setOrgUsers: AppContext['setOrgUsers'],
  openSnackBar: AppContext['openSnackBar'],
  user: User,
  tasks: Task[],
  setTasks: AppContext['setTasks'];
};

export default function RemoveOrgUserModal(props: RemoveOrgUserModalProps) {
  const {
    isOpen,
    closeModal,
    org,
    setOrgUsers,
    openSnackBar,
    user,
    tasks,
    setTasks
  } = props;

  const orgId = org.id;
  const orgName = org.name;
  const userId = user?.id;
  const name = user?.firstName + ' ' + user?.lastName;

  const [isLoading, setLoading] = useState(false);

  const handleRemoveOrgUser = async () => {
    setLoading(true);

    try {
      const result = await removeOrgUser(orgId, userId);

      const success = result.success;
      const resultMessage = result.message;

      if (success) {
        setOrgUsers(orgUsers => orgUsers.filter(u => u.id !== user.id));

        const tasksClone = [...tasks];
        tasksClone.forEach(task => {
          if (task.assigned_to_id && task.assigned_to_id === user.id) {
            task.assigned_to_id = null;
          }
        });
        setTasks(tasksClone);

        openSnackBar('Successully removed.', 'success');
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
    setLoading(false);
  };

  return (
    <div>
      <Dialog open={isOpen} onClose={closeModal} className='modal'>
        <DialogTitle>
          Remove User
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to remove <strong>{name}</strong> from <strong>{orgName}?</strong>
          </Typography>
          <Typography mt={1} mb={3}>
            Proceeding will remove them from all engagements within {orgName} and unassign all tasks that are currently assigned to them.
          </Typography>
          <DialogActions style={{ padding: 0 }} className='wrap-on-small'>
            <Button
              disabled={isLoading}
              onClick={handleClose}>
              Cancel
            </Button>
            <LoadingButton
              variant='contained'
              onClick={handleRemoveOrgUser}
              loading={isLoading}
              color="error">
              Yes, remove {name}
            </LoadingButton>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </div>
  );
};