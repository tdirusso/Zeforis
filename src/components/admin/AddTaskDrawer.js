import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useRef, useState } from 'react';
import Button from '@mui/material/Button';
import { Autocomplete, Box, Checkbox, Divider, Drawer, FormControlLabel, Grid, TextField, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Slider from '@mui/material/Slider';
import { FormControl } from "@mui/material";
import { addTask } from '../../api/task';
import InputAdornment from '@mui/material/InputAdornment';
import Input from '@mui/material/Input';
import { addTags } from '../../api/client';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import LinkIcon from '@mui/icons-material/Link';
import FolderIcon from '@mui/icons-material/Folder';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';

export default function AddTaskDrawer(props) {
  const {
    isOpen,
    close,
    folderToSet,
    folders,
    clientMembers,
    clientAdmins,
    client,
    tags,
    setTags,
    setTasks,
    user,
    openSnackBar
  } = props;

  const clientId = client.id;

  const name = useRef();
  const description = useRef();
  const linkUrl = useRef();
  const newTags = useRef();

  const [isLoading, setLoading] = useState(false);
  const [status, setStatus] = useState('New');
  const [folderId, setFolderId] = useState(null);
  const [assignedToId, setAssignedToId] = useState(null);
  const [assignedToName, setAssignedToName] = useState(null);
  const [progress, setProgress] = useState(0);
  const [selectedTags, setSelectedTags] = useState([]);
  const [isAddingTags, setIsAddingTags] = useState(false);
  const [isKeyTask, setIsKeyTask] = useState(false);
  const [dueDate, setDueDate] = useState(null);

  const tagIdNameMap = {};

  tags.forEach(tag => tagIdNameMap[tag.id] = tag.name);

  const handleCreateTask = async () => {
    const nameVal = name.current.value;
    const descriptionVal = description.current.value;
    const linkVal = linkUrl.current.value;
    const folderIdVal = folderId || folderToSet?.id;

    if (!nameVal) {
      openSnackBar('Please enter a name for the new task.', 'error');
      return;
    }

    if (!folderIdVal) {
      openSnackBar('Please select which folder the task should reside in.', 'error');
      return;
    }

    setLoading(true);

    try {
      const { message, taskId } = await addTask({
        name: nameVal,
        description: descriptionVal,
        linkUrl: linkVal,
        status,
        assignedToId,
        progress,
        folderId: folderIdVal,
        clientId,
        tags: selectedTags,
        isKeyTask,
        dueDate
      });

      if (taskId) {
        setTimeout(() => {
          openSnackBar('Task created.', 'success');
        }, 300);

        const now = new Date().toISOString();

        setTasks(tasks => [...tasks, {
          task_id: taskId,
          task_name: nameVal,
          description: descriptionVal,
          date_created: now,
          created_by_id: user.id,
          status: status,
          folder_id: folderIdVal,
          link_url: linkVal,
          assigned_to_id: assignedToId,
          progress: progress,
          date_completed: status === 'Complete' ? now : null,
          is_key_task: Number(isKeyTask),
          date_due: dueDate ? dueDate.toISOString() : null,
          date_last_updated: now,
          tags: selectedTags.length > 0 ? selectedTags.map(t => t.id).join(',') : null,
          assigned_first: assignedToName?.firstName || null,
          assigned_last: assignedToName?.lastName || null,
          created_first: user.firstName,
          created_last: user.lastName,
          updated_by_first: user.firstName,
          updated_by_last: user.lastName
        }]);

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

  const handleAddTags = async () => {
    const newTagsVal = newTags.current.value;

    if (newTagsVal) {
      const newTagsArray = newTagsVal.split(',');

      setIsAddingTags(true);

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
    }
  };

  const handleClose = () => {
    close();
    setTimeout(() => {
      setStatus('New');
      setFolderId(null);
      setProgress(0);
      setAssignedToId(null);
      setSelectedTags([]);
      setDueDate(null);
      setLoading(false);
    }, 500);
  };

  const handleAssignedToChange = (_, val) => {
    setAssignedToName(val ?
      {
        firstName: val.firstName,
        lastName: val.lastName
      } :
      null);

    setAssignedToId(val?.id || null);
  };

  return (
    <div>
      <Drawer
        anchor="right"
        open={isOpen}
        onClose={handleClose}
        hideBackdrop
        variant='persistent'
        PaperProps={{ sx: { width: '450px' } }}>
        <DialogTitle>Create New Task</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 3, mb: 3 }}>
            <Grid container rowSpacing={2} columnSpacing={1.5}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  autoFocus
                  disabled={isLoading}
                  inputRef={name}
                  placeholder='Task name'
                  required>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  placeholder='https://'
                  InputProps={{
                    startAdornment:
                      <InputAdornment position='start' sx={{ transform: 'rotate(-45deg)' }}>
                        <LinkIcon />
                      </InputAdornment>
                  }}
                  disabled={isLoading}
                  inputRef={linkUrl}>
                </TextField>
              </Grid>
              <Grid item xs={12}>


              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Autocomplete
                    options={folders}
                    getOptionLabel={(option) => option.name || ''}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    disabled={Boolean(folderToSet) || isLoading}
                    renderOption={(props, option) => <li {...props} key={option.id}>{option.name}</li>}
                    defaultValue={folderToSet || null}
                    onChange={(_, newVal) => setFolderId(newVal?.id || null)}
                    renderInput={(params) => (
                      <TextField
                        placeholder='Folder'
                        {...params}
                        InputProps={{
                          ...params.InputProps,
                          startAdornment:
                            <InputAdornment position='start'>
                              <FolderIcon />
                            </InputAdornment>
                        }}
                      />
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Autocomplete
                    options={[...clientAdmins, ...clientMembers]}
                    renderOption={(props, option) => <li {...props} key={option.id}>{option.firstName} {option.lastName}</li>}
                    getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    disabled={isLoading}
                    groupBy={(option) => option.role}
                    onChange={handleAssignedToChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Assigned To"
                        InputProps={{
                          ...params.InputProps,
                          startAdornment:
                            <InputAdornment position='start'>
                              <AccountCircleIcon />
                            </InputAdornment>
                        }}
                      />
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}></Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Autocomplete
                    multiple
                    value={selectedTags}
                    options={tags}
                    renderOption={(props, option) => <li {...props} key={option.id}>{option.name}</li>}
                    isOptionEqualToValue={(option, value) => option.name === value.name}
                    getOptionLabel={(option) => option.name}
                    filterSelectedOptions
                    disableCloseOnSelect
                    disabled={isLoading}
                    onChange={(_, newVal) => setSelectedTags(newVal)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Tags"
                        InputProps={{
                          ...params.InputProps,
                          startAdornment:
                            <InputAdornment position='start'>
                              <LocalOfferIcon />
                            </InputAdornment>
                        }}
                      />
                    )}
                  />
                </FormControl>
              </Grid>
            </Grid>
          </Box>

          <LoadingButton
          sx={{mt: '10px'}}
            variant='contained'
            onClick={handleCreateTask}
            type='submit'
            fullWidth
            loading={isLoading}>
            Create Task
          </LoadingButton>
        </DialogContent>
      </Drawer>
    </div>
  );
};