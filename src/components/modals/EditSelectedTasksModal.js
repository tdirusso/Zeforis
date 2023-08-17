import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { useState } from 'react';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { LoadingButton } from '@mui/lab';
import { batchUpdateTasks } from '../../api/tasks';
import { Grid, FormControl, Select, InputLabel, MenuItem, Autocomplete, TextField, Chip, ListItemIcon, ListItemText, Box, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { useOutletContext } from 'react-router-dom';
import { statuses } from '../../lib/constants';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import { Folder, Person } from '@mui/icons-material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

export default function EditSelectedTasksModal(props) {
  const {
    taskIds,
    open,
    setOpen,
    setSelectedTasks
  } = props;

  const {
    engagementAdmins,
    engagementMembers,
    folders,
    setTasks,
    engagement,
    tasksMap,
    openSnackBar,
    tags
  } = useOutletContext();

  const engagementId = engagement.id;

  const [isLoading, setLoading] = useState(false);
  const [action, setAction] = useState('');
  const [status, setStatus] = useState('');
  const [assignee, setAssignee] = useState(null);
  const [folder, setFolder] = useState(null);
  const [dateDue, setDateDue] = useState(null);
  const [isKey, setIsKey] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [tagAction, setTagAction] = useState('add');

  const handleBatchUpdate = async () => {
    switch (action) {
      case 'folder':
        if (!folder) {
          return openSnackBar('Select a folder.');
        }
        break;
      case 'status':
        if (!status) {
          return openSnackBar('Select a status.');
        }
        break;
      case 'tags':
        if (selectedTags.length === 0) {
          return openSnackBar('Select tags to add or remove.');
        }
        break;
      default:
        break;
    }

    setLoading(true);

    try {
      const { updatedTasks, message } = await batchUpdateTasks({
        engagementId,
        taskIds,
        action,
        status,
        dateDue,
        folderId: folder?.id,
        assigneeId: assignee?.id,
        isKey,
        tags: selectedTags,
        tagAction
      });

      if (updatedTasks) {
        updatedTasks.forEach(updatedTask => tasksMap[updatedTask.task_id] = updatedTask);
        setTasks(Object.values(tasksMap));
        setSelectedTasks([]);
        openSnackBar(`Updated ${updatedTasks.length} tasks.`, 'success');
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
      setIsKey('');
      setSelectedTags([]);
      setTagAction('add');
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
                      style={{ cursor: 'pointer' }}
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
            options={[...engagementAdmins, ...engagementMembers]}
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
      case 'keyTask':
        return (
          <>
            <InputLabel id="to-label">To</InputLabel>
            <Select
              labelId="to-label"
              value={isKey}
              label="To"
              SelectDisplayProps={{
                style: {
                  display: 'flex'
                }
              }}
              disabled={isLoading}>
              <MenuItem
                value='yes'
                onClick={() => setIsKey('yes')}>
                <ListItemIcon style={{ alignSelf: 'center' }}>
                  <StarIcon fontSize="small" htmlColor='gold' />
                </ListItemIcon>
                <ListItemText>Yes</ListItemText>
              </MenuItem>
              <MenuItem
                value='no'
                onClick={() => setIsKey('no')}>
                <ListItemIcon style={{ alignSelf: 'center' }}>
                  <StarBorderIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>No</ListItemText>
              </MenuItem>
            </Select>
          </>
        );
      case 'tags':
        return (
          <Box>
            <Autocomplete
              multiple
              options={tags}
              renderOption={(props, option) => <li {...props} key={option.id}>{option.name}</li>}
              isOptionEqualToValue={(option, value) => option.name === value.name}
              getOptionLabel={(option) => option.name}
              filterSelectedOptions
              disableCloseOnSelect
              onChange={(_, newVal) => setSelectedTags(newVal)}
              value={selectedTags}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="To"
                  InputProps={{
                    ...params.InputProps
                  }}
                />
              )}
            />
            <RadioGroup
              row
              value={tagAction}
              onChange={(_, val) => setTagAction(val)}
              name="row-radio-buttons-group">
              <FormControlLabel
                value="add"
                control={<Radio size="small" />}
                label="Add"
              />
              <FormControlLabel
                value="delete"
                control={<Radio size="small" />}
                label="Remove"
              />
            </RadioGroup>
          </Box>
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
    setIsKey('');
    setSelectedTags([]);
    setTagAction('add');
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        style: {
          maxWidth: '750px',
        }
      }}>
      <DialogContent>
        <DialogContentText style={{ marginBottom: '1.5rem' }}>
          Please choose the action and corresponding value to apply to <strong>{taskIds.length}</strong> selected tasks.
        </DialogContentText>

        <Grid container rowSpacing={2} columnSpacing={2}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="action-label">Set</InputLabel>
              <Select
                SelectDisplayProps={{ className: 'flex-ac' }}
                MenuProps={{ className: 'flex-ac' }}
                labelId="action-label"
                value={action}
                label="Set"
                disabled={isLoading}
                onChange={handleChangeAction}>
                <MenuItem value="assignee">
                  <ListItemIcon>
                    <Person fontSize='small' />
                  </ListItemIcon>
                  Assignee
                </MenuItem>
                <MenuItem value="dateDue">
                  <ListItemIcon>
                    <CalendarMonthIcon fontSize='small' />
                  </ListItemIcon>
                  Date Due
                </MenuItem>
                <MenuItem value="folder">
                  <ListItemIcon>
                    <Folder fontSize='small' />
                  </ListItemIcon>
                  Folder
                </MenuItem>
                <MenuItem value="keyTask">
                  <ListItemIcon>
                    <StarIcon fontSize='small' />
                  </ListItemIcon>
                  Key Task
                </MenuItem>
                <MenuItem value="status">
                  <ListItemIcon>
                    <CheckCircleIcon fontSize='small' />
                  </ListItemIcon>
                  Status
                </MenuItem>
                <MenuItem value="tags">
                  <ListItemIcon>
                    <LocalOfferIcon fontSize='small' />
                  </ListItemIcon>
                  Tags
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              {getValueField()}
            </FormControl>
          </Grid>
        </Grid>

        <DialogActions style={{ padding: 0, marginTop: '2rem' }} className='wrap-on-small'>
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
  );
};