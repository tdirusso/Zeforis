import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { useState } from 'react';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { LoadingButton } from '@mui/lab';
import Snackbar from '../core/Snackbar';
import useSnackbar from '../../hooks/useSnackbar';
import { bulkUpdateTasks } from '../../api/task';
import { Grid, FormControl, Select, InputLabel, MenuItem, Autocomplete, TextField } from '@mui/material';
import { useOutletContext } from 'react-router-dom';

const statuses = [
  'New',
  'Next Up',
  'In Progress',
  'Currently Writing',
  'Pending Approval',
  'Approved',
  'Ready to Implement',
  'Complete'
];

export default function EditSelectedTasksModal(props) {
  const {
    taskIds,
    clientId,
    open,
    setOpen,
    setSelectedTasks
  } = props;

  const {
    clientAdmins,
    clientMembers,
    folders,
    tasks,
    setTasks
  } = useOutletContext();

  const [isLoading, setLoading] = useState(false);
  const [action, setAction] = useState('');
  const [status, setStatus] = useState('');
  const [assignee, setAssignee] = useState(null);
  const [folder, setFolder] = useState(null);

  const {
    isOpen,
    openSnackBar,
    type,
    message
  } = useSnackbar();

  const handleBulkUpdate = () => {
    setLoading(true);

    setTimeout(async () => {
      try {
        const { updatedTasks, message } = await bulkUpdateTasks({
          clientId,
          taskIds,
          action,
          status,
          folderId: folder?.id,
          assigneeId: assignee?.id
        });

        if (updatedTasks) {
          const idToTaskMap = {};
          tasks.forEach(task => idToTaskMap[task.task_id] = task);

          updatedTasks.forEach(updatedTask => idToTaskMap[updatedTask.task_id] = updatedTask);

          setTimeout(() => {
            openSnackBar('Successully .', 'success');
          }, 250);

          setTasks(Object.values(idToTaskMap));
          setSelectedTasks([]);
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
      setAction('');
    }, 500);
  };

  const getValueField = () => {
    switch (action) {
      case 'status':
        return (
          <>
            <InputLabel id="to-label">To</InputLabel>
            <Select
              labelId="to-label"
              value={status}
              label="To"
              disabled={isLoading}
              onChange={e => setStatus(e.target.value)}>
              {
                statuses.map(status =>
                  <MenuItem
                    key={status}
                    value={status}>
                    {status}
                  </MenuItem>)
              }
            </Select>
          </>
        );
      case 'assignee':
        return (
          <Autocomplete
            value={assignee}
            options={[...clientAdmins, ...clientMembers]}
            getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            groupBy={(option) => option.role}
            onChange={(_, newVal) => setAssignee(newVal)}
            disabled={isLoading}
            renderInput={(params) => (
              <TextField
                {...params}
                label="To"
              />
            )}
          />
        );
      case 'folder':
        return (
          <Autocomplete
            value={folder}
            options={folders}
            disabled={isLoading}
            getOptionLabel={(option) => option.name || ''}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onChange={(_, newVal) => setFolder(newVal)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="To"
              />
            )}
          />
        );
      default:
        break;
    }
  };

  const handleChangeAction = e => {
    setAssignee(null);
    setFolder(null);
    setStatus('');
    setAction(e.target.value);
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Please select the action and corresponding value to apply to <strong>{taskIds.length}</strong> selected tasks.
          </DialogContentText>

          <Grid container rowSpacing={2} columnSpacing={2}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="action-label">Set</InputLabel>
                <Select
                  labelId="action-label"
                  value={action}
                  label="Set"
                  disabled={isLoading}
                  onChange={handleChangeAction}>
                  <MenuItem value="assignee">Assignee</MenuItem>
                  <MenuItem value="folder">Folder</MenuItem>
                  <MenuItem value="status">Status</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                {getValueField()}
              </FormControl>
            </Grid>
          </Grid>

          <DialogActions sx={{ p: 0, mt: 3 }}>
            <Button
              fullWidth
              variant="outlined"
              disabled={isLoading}
              onClick={handleClose}>
              Cancel
            </Button>
            <LoadingButton
              variant='contained'
              onClick={handleBulkUpdate}
              required
              fullWidth
              loading={isLoading}>
              Apply Changes
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