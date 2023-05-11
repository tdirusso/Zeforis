import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { useState } from 'react';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { LoadingButton } from '@mui/lab';
import { batchUpdateTasks } from '../../api/tasks';
import { Grid, FormControl, Select, InputLabel, MenuItem, Autocomplete, TextField, Chip } from '@mui/material';
import { useOutletContext } from 'react-router-dom';
import { statuses } from '../../lib/constants';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers';

export default function EditSelectedTasksModal(props) {
  const {
    taskIds,
    open,
    setOpen,
    setSelectedTasks
  } = props;

  const {
    clientAdmins,
    clientMembers,
    folders,
    setTasks,
    client,
    tasksMap,
    openSnackBar
  } = useOutletContext();

  const clientId = client.id;

  const [isLoading, setLoading] = useState(false);
  const [action, setAction] = useState('');
  const [status, setStatus] = useState('');
  const [assignee, setAssignee] = useState(null);
  const [folder, setFolder] = useState(null);
  const [dateDue, setDateDue] = useState(null);

  const handleBatchUpdate = async () => {
    setLoading(true);

    try {
      const { updatedTasks, message } = await batchUpdateTasks({
        clientId,
        taskIds,
        action,
        status,
        dateDue,
        folderId: folder?.id,
        assigneeId: assignee?.id
      });

      if (updatedTasks) {
        updatedTasks.forEach(updatedTask => tasksMap[updatedTask.task_id] = updatedTask);
        setTasks(Object.values(tasksMap));
        setSelectedTasks([]);
        openSnackBar(`Successully updated ${updatedTasks.length} tasks.`, 'success');
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
      setAction('');
      setStatus('');
      setFolder(null);
      setAssignee(null);
      setDateDue(null);
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
              disabled={isLoading}>
              {
                statuses.map(({ name }) =>
                  <MenuItem
                    value={name}
                    onClick={() => setStatus(name)}
                    key={name}>
                    <Chip
                      label={name}
                      className={name}
                      sx={{ cursor: 'pointer' }}
                    />
                  </MenuItem>
                )}
            </Select>
          </>
        );
      case 'assignee':
        return (
          <Autocomplete
            value={assignee}
            renderOption={(props, option) => <li {...props} key={option.id}>{option.firstName} {option.lastName}</li>}
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
            renderOption={(props, option) => <li {...props} key={option.id}>{option.name}</li>}
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
      case 'dateDue':
        return (
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <DatePicker
              disabled={isLoading}
              format="MM/DD/YYYY"
              value={dateDue}
              onChange={value => setDateDue(value)}
              renderInput={(params) => <TextField
                {...params}
                fullWidth
                label='To'
              />}
            ></DatePicker>
          </LocalizationProvider>
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
                  <MenuItem value="dateDue">Due Date</MenuItem>
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
              onClick={handleBatchUpdate}
              required
              fullWidth
              loading={isLoading}>
              Apply Changes
            </LoadingButton>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </div>
  );
};