import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { useRef, useState } from 'react';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { Autocomplete, Box, Checkbox, FormControlLabel, Grid, TextField, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Snackbar from '../core/Snackbar';
import useSnackbar from '../../hooks/useSnackbar';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Slider from '@mui/material/Slider';
import { FormControl } from "@mui/material";
import { updateTask } from '../../api/task';
import InputAdornment from '@mui/material/InputAdornment';
import Input from '@mui/material/Input';
import { addTags } from '../../api/client';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { useOutletContext } from 'react-router-dom';

export default function EditTaskModal(props) {
  const {
    open,
    setOpen,
    task
  } = props;

  const {
    folders,
    clientMembers,
    clientAdmins,
    client,
    tags,
    setTags,
    setTasks,
    foldersMap,
    tasksMap
  } = useOutletContext();

  const clientId = client.id;

  const name = useRef();
  const description = useRef();
  const linkUrl = useRef();
  const newTags = useRef();

  const tagIdNameMap = {};
  tags.forEach(tag => tagIdNameMap[tag.id] = tag.name);

  const curTagsIds = task.tags?.split(',').filter(Boolean) || [];

  const defaultTags = curTagsIds.length > 0 ? curTagsIds.map(tagId => ({
    id: Number(tagId),
    name: tagIdNameMap[tagId],
    client_id: clientId
  })) : [];

  const defaultFolder = foldersMap[task.folder_id] || null;

  const defaultAssignee = task.assigned_to_id ?
    {
      id: task.assigned_to_id,
      firstName: task.assigned_first,
      lastName: task.assigned_last
    } :
    null;

  const [isLoading, setLoading] = useState(false);
  const [status, setStatus] = useState(task.status);
  const [folder, setFolder] = useState(defaultFolder);
  const [assignedTo, setAssignedTo] = useState(defaultAssignee);
  const [progress, setProgress] = useState(task.progress);
  const [selectedTags, setSelectedTags] = useState(defaultTags);
  const [isAddingTags, setIsAddingTags] = useState(false);
  const [isKeyTask, setIsKeyTask] = useState(Boolean(task.is_key_task));
  const [dueDate, setDueDate] = useState(task.date_due);

  const {
    isOpen,
    openSnackBar,
    type,
    message
  } = useSnackbar();

  const handleUpdateTask = () => {
    const nameVal = name.current.value;
    const descriptionVal = description.current.value;
    const linkVal = linkUrl.current.value;
    const folderIdVal = folder?.id;
    const assignedToVal = assignedTo?.id;

    if (!nameVal) {
      openSnackBar('Please enter a name for the task.', 'error');
      return;
    }

    if (!folderIdVal) {
      openSnackBar('Please select which folder the task should reside in.', 'error');
      return;
    }

    if (!assignedToVal) {
      openSnackBar('Please select an assignee for the task.', 'error');
      return;
    }

    setLoading(true);

    setTimeout(async () => {
      try {
        const { message, updatedTask } = await updateTask({
          name: nameVal,
          description: descriptionVal,
          linkUrl: linkVal,
          status,
          assignedToId: assignedToVal,
          progress,
          folderId: folderIdVal,
          clientId,
          tags: selectedTags,
          isKeyTask,
          dueDate,
          taskId: task.task_id,
          currentTags: defaultTags
        });

        if (updatedTask) {
          setTimeout(() => {
            setLoading(false);
            openSnackBar('Task successfully updated.', 'success');
          }, 300);

          tasksMap[updatedTask.task_id] = updatedTask;
          setTasks(Object.values(tasksMap));
          setOpen(false);
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

  const handleAddTags = () => {
    const newTagsVal = newTags.current.value;

    if (newTagsVal) {
      const newTagsArray = newTagsVal.split(',');

      setIsAddingTags(true);

      setTimeout(async () => {
        const result = await addTags({
          tags: newTagsArray,
          clientId
        });

        if (result.success) {
          const insertedTags = result.tags;
          setTags(tags => [...tags, ...insertedTags]);
          setSelectedTags(tags => [...tags, ...insertedTags]);
          setIsAddingTags(false);
          newTags.current.value = '';
        } else {
          openSnackBar(result.message, 'error');
          setIsAddingTags(false);
        }
      }, 1000);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      setLoading(false);
      setStatus(task.status);
      setFolder(defaultFolder);
      setAssignedTo(defaultAssignee);
      setProgress(task.progress);
      setSelectedTags(defaultTags);
      setIsKeyTask(Boolean(task.is_key_task));
      setDueDate(task.date_due);
    }, 500);
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <DialogContentText>
            You can edit the task details below.
          </DialogContentText>
          <Box sx={{ mt: 3, mb: 3 }}>
            <Grid container rowSpacing={2} columnSpacing={1.5}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Name"
                  fullWidth
                  disabled={isLoading}
                  inputRef={name}
                  defaultValue={task.task_name}
                  required>
                </TextField>
              </Grid>
              <Grid item xs={13} md={6}>
                <TextField
                  label="Description"
                  fullWidth
                  defaultValue={task.description}
                  disabled={isLoading}
                  inputRef={description}>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Link URL"
                  fullWidth
                  disabled={isLoading}
                  defaultValue={task.link_url}
                  inputRef={linkUrl}>
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <Autocomplete
                    options={folders}
                    disabled={isLoading}
                    getOptionLabel={(option) => option.name || ''}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    value={folder}
                    onChange={(_, newVal) => setFolder(newVal || null)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Folder"
                      />
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <Autocomplete
                    options={[...clientAdmins, ...clientMembers]}
                    getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    disabled={isLoading}
                    groupBy={(option) => option.role}
                    value={assignedTo}
                    onChange={(_, newVal) => setAssignedTo(newVal || null)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Assigned To"
                      />
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel id="status-label">Status</InputLabel>
                  <Select
                    defaultValue='New'
                    labelId="status-label"
                    value={status}
                    label="Status"
                    disabled={isLoading}
                    onChange={e => setStatus(e.target.value)}>
                    <MenuItem value="New">New</MenuItem>
                    <MenuItem value="Next Up">Next Up</MenuItem>
                    <MenuItem value="In Progress">In Progress</MenuItem>
                    <MenuItem value="Currently Writing">Currently Writing</MenuItem>
                    <MenuItem value="Pending Approval">Pending Approval</MenuItem>
                    <MenuItem value="Approved">Approved</MenuItem>
                    <MenuItem value="Ready to Implement">Ready to Implement</MenuItem>
                    <MenuItem value="Complete">Complete</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DesktopDatePicker
                    label="Due Date"
                    inputFormat="MM/DD/YYYY"
                    value={dueDate}
                    onChange={value => setDueDate(value)}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  ></DesktopDatePicker>
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Autocomplete
                    multiple
                    options={tags}
                    isOptionEqualToValue={(option, value) => option.name === value.name}
                    getOptionLabel={(option) => option.name}
                    filterSelectedOptions
                    disableCloseOnSelect
                    disabled={isLoading}
                    value={selectedTags}
                    onChange={(_, newVal) => setSelectedTags(newVal)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Tags"
                      />
                    )}
                  />
                </FormControl>
                <Box sx={{ mt: 1 }}>
                  <Input
                    variant='standard'
                    size='small'
                    placeholder='Tag 1, Tag 2...'
                    fullWidth
                    inputRef={newTags}
                    disabled={isAddingTags || isLoading}
                    endAdornment={
                      <InputAdornment position="end">
                        <LoadingButton
                          onClick={handleAddTags}
                          loading={isAddingTags}
                          disabled={isLoading}
                          size='small'>
                          Add Tags
                        </LoadingButton>
                      </InputAdornment>
                    }
                  ></Input>
                  <Typography variant='caption'>
                    To add new tags, type them into the text field above, comma separated, and click "Add Tags".
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sx={{ mt: '-10px' }}>
                <FormControlLabel
                  componentsProps={{ typography: { fontWeight: '300' } }}
                  control={<Checkbox
                    value={isKeyTask}
                    checked={isKeyTask}
                    onChange={(_, val) => setIsKeyTask(val)}
                    disabled={isLoading} />}
                  label="Is this a Key Task?"
                />
              </Grid>
              <Grid item xs={12} sx={{ mt: '-10px' }}>
                <Box width={'98%'}>
                  <Slider
                    defaultValue={0}
                    valueLabelDisplay="auto"
                    step={5}
                    marks={[
                      { value: 8, label: '0% Progress' },
                      { value: 90, label: '100% Progress' }
                    ]}
                    min={0}
                    max={100}
                    disabled={isLoading}
                    value={progress}
                    onChange={e => setProgress(e.target.value)}
                    valueLabelFormat={val => `${val}%`}
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>
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
              onClick={handleUpdateTask}
              fullWidth
              loading={isLoading}>
              Update Task
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