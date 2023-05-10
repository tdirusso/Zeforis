/* eslint-disable react-hooks/exhaustive-deps */
import DialogContent from '@mui/material/DialogContent';
import { useEffect, useState } from 'react';
import {
  Autocomplete,
  Box,
  Button,
  Drawer,
  IconButton,
  TextField,
  Chip,
  Divider,
  Alert,
  Menu,
  MenuItem,
  Slider,
  FormControlLabel,
  Checkbox,
  Tooltip
} from '@mui/material';
import { FormControl } from "@mui/material";
import InputAdornment from '@mui/material/InputAdornment';
import { createTag } from '../../api/tags';
import LinkIcon from '@mui/icons-material/Link';
import FolderIcon from '@mui/icons-material/Folder';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CloseIcon from '@mui/icons-material/Close';
import StarIcon from '@mui/icons-material/Star';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import './styles/TaskDrawer.css';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { statuses } from '../../lib/constants';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { updateTask } from '../../api/tasks';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { deleteTasks } from '../../api/tasks';
import { LoadingButton } from '@mui/lab';

const defaultTask = {
  task_id: null,
  task_name: null,
  description: null,
  date_created: null,
  created_by_id: null,
  status: null,
  folder_id: null,
  link_url: null,
  assigned_to_id: null,
  progress: 0,
  date_completed: null,
  is_key_task: 0,
  date_due: null,
  date_last_updated: null,
  tags: null,
  assigned_first: null,
  assigned_last: null,
  created_first: null,
  created_last: null,
  updated_by_first: null,
  updated_by_last: null
};

export default function TaskDrawer(props) {
  const {
    isOpen,
    close,
    folders,
    clientMembers,
    clientAdmins,
    client,
    tags,
    setTags,
    openSnackBar,
    foldersMap,
    taskProp,
    setTasks,
    user,
    tasksMap
  } = props;

  const clientId = client.id;

  const [selectedTags, setSelectedTags] = useState([]);
  const [assignedTo, setAssignedTo] = useState(null);
  const [folder, setFolder] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [progress, setProgress] = useState(0);
  const [copyButtonText, setCopyButtonText] = useState('Copy Link');
  const [task, setTask] = useState(defaultTask);
  const [membersAndAdmins] = useState([...clientAdmins, ...clientMembers]);
  const [statusMenuAnchor, setStatusMenuAnchor] = useState(null);
  const [deleteMenuAnchor, setDeleteMenuAnchor] = useState(null);
  const [dateDue, setDateDue] = useState(null);
  const [isKeyTask, setIsKeyTask] = useState(false);
  const [status, setStatus] = useState(null);
  const [needsUpdating, setNeedsUpdating] = useState(false);
  const [isDeleting, setDeleting] = useState(false);

  const statusMenuOpen = Boolean(statusMenuAnchor);
  const deleteMenuOpen = Boolean(deleteMenuAnchor);

  useEffect(() => {
    setTask(taskProp || defaultTask);
    if (taskProp) {
      const tagIds = taskProp.tags?.split(',').filter(Boolean) || [];

      setTask(taskProp);
      setName(taskProp.task_name);
      setDescription(taskProp.description);
      setLinkUrl(taskProp.link_url);
      setProgress(taskProp.progress);
      setDateDue(taskProp.date_due ? new Date(taskProp.date_due) : null);
      setIsKeyTask(Boolean(taskProp.is_key_task));
      setFolder(foldersMap[taskProp.folder_id] || null);
      setStatus(taskProp.status);
      setAssignedTo(membersAndAdmins.find(u => u.id === taskProp.assigned_to_id) || null);
      setSelectedTags(tagIds.map(tagId => ({
        id: Number(tagId),
        name: tagIdNameMap[tagId],
        client_id: clientId
      })).sort((a, b) => a.name.localeCompare(b.name)));
    }
  }, [taskProp]);

  const tagIdNameMap = {};
  tags.forEach(tag => tagIdNameMap[tag.id] = tag.name);

  const curTagsIds = task.tags?.split(',').filter(Boolean) || [];

  const curTags = curTagsIds.map(tagId => ({
    id: Number(tagId),
    name: tagIdNameMap[tagId],
    client_id: clientId
  }));

  const handleCopyLink = () => {
    window.navigator.clipboard.writeText(task.link_url);
    setCopyButtonText('Copied!');
    setTimeout(() => {
      setCopyButtonText('Copy Link');
    }, 500);
  };

  const handleClose = () => {
    close();
  };

  const handleCreateTag = async e => {
    const key = e.key;
    const newTagValue = e.target.value;

    if (key === 'Enter' && newTagValue) {
      const result = await createTag({
        name: newTagValue,
        clientId
      });

      if (result.success) {
        const newTag = result.tag;
        setTags(tags => [...tags, newTag]);
        setSelectedTags(tags => [...tags, newTag]);
        setNeedsUpdating(true);
      } else {
        openSnackBar(result.message, 'error');
      }
    }
  };

  const handleNameChange = () => {
    if (!name) {
      openSnackBar('Please enter a task name.');
      return;
    } else if (name !== task.task_name) {
      setNeedsUpdating(true);
    }
  };

  const handleDescriptionChange = () => {
    if (description !== task.description) {
      setNeedsUpdating(true);
    }
  };

  const handleLinkChange = () => {
    if (linkUrl !== task.link_url) {
      setNeedsUpdating(true);
    }
  };

  const handleStatusChange = status => {
    setStatus(status);

    if (status === 'Complete') {
      setProgress(100);
    } else if (progress === 100) {
      setProgress(0);
    }

    setStatusMenuAnchor(null);
    setNeedsUpdating(true);
  };

  const handleIsKeyChange = (_, val) => {
    setIsKeyTask(val);
    setNeedsUpdating(true);
  };

  const handleAssignedToChange = () => {
    const assignedToId = assignedTo?.id || null;

    if (!assignedToId && task.assigned_to_id) {
      setNeedsUpdating(true);
    } else if (assignedToId !== task.assigned_to_id) {
      setNeedsUpdating(true);
    }
  };

  const handleDateDueChange = (eventOrVal) => {
    if (eventOrVal.type === 'blur') {
      if (dateDue !== task.date_due) {
        const newDate = new Date(dateDue);
        if (!isNaN(newDate.getTime())) {
          setNeedsUpdating(true);
        } else {
          openSnackBar('Invalid due date format.');
        }
      }
    } else {
      setDateDue(eventOrVal);
      setNeedsUpdating(true);
    }
  };

  const handleProgressChange = () => {
    if (progress === 100) {
      setStatus('Complete');
    } else if (status === 'Complete') {
      setStatus('In Progress');
    }
    setNeedsUpdating(true);
  };

  const handleFolderChange = () => {
    if (!folder) {
      openSnackBar('Please select a folder for the task.');
      return;
    } else if (folder.id !== task.folder_id) {
      setNeedsUpdating(true);
    }
  };

  const handleTagsChange = (_, newTagsArray) => {
    setSelectedTags(newTagsArray);
    setNeedsUpdating(true);
  };

  useEffect(() => {
    if (needsUpdating) {
      handleUpdateTask();
      setNeedsUpdating(false);
    }
  }, [needsUpdating]);

  const handleUpdateTask = async () => {
    const folderId = folder?.id;
    const assignedToId = assignedTo?.id;

    if (!name) {
      openSnackBar('Please enter a name for the task.');
      return;
    }

    if (!folderId) {
      openSnackBar('Please select a folder for the task.');
      return;
    }

    try {
      const { message, success } = await updateTask({
        name,
        description,
        linkUrl,
        status,
        assignedToId,
        progress,
        folderId,
        clientId,
        tags: selectedTags,
        isKeyTask,
        dateDue,
        taskId: task.task_id,
        currentTags: curTags
      });

      if (success) {
        openSnackBar('Task successfully updated.', 'success');
        const now = new Date().toISOString();

        const newTaskObject = {
          task_id: task.task_id,
          task_name: name,
          description,
          date_created: task.date_created,
          created_by_id: task.created_by_id,
          status: status,
          folder_id: folderId,
          link_url: linkUrl,
          assigned_to_id: assignedToId,
          progress: progress,
          date_completed: status === 'Complete' ? now : null,
          is_key_task: Number(isKeyTask),
          date_due: dateDue ? dateDue.toISOString() : null,
          date_last_updated: now,
          tags: selectedTags.length > 0 ? selectedTags.map(t => t.id).join(',') : null,
          assigned_first: assignedTo?.firstName || null,
          assigned_last: assignedTo?.lastName || null,
          created_first: task.created_first,
          created_last: task.created_last,
          updated_by_first: user.firstName,
          updated_by_last: user.lastName
        };

        tasksMap[task.task_id] = newTaskObject;
        setTask(newTaskObject);
        setTasks(Object.values(tasksMap));
      } else {
        openSnackBar(message, 'error');
      }
    } catch (error) {
      openSnackBar(error.message, 'error');
    }
  };

  const handleDeleteTask = async () => {
    setDeleting(true);

    try {
      const result = await deleteTasks({
        clientId,
        taskIds: [task.task_id]
      });

      const success = result.success;
      const resultMessage = result.message;

      if (success) {
        openSnackBar(`Successully deleted.`, 'success');
        delete tasksMap[task.task_id];
        handleClose();
        setDeleteMenuAnchor(null);
        setDeleting(false);
        setTasks(Object.values(tasksMap));
      } else {
        openSnackBar(resultMessage, 'error');
        setDeleting(false);
      }
    } catch (error) {
      openSnackBar(error.message, 'error');
      setDeleting(false);
    }
  };

  return (
    <Drawer
      className='task-drawer'
      anchor="right"
      open={isOpen}
      onClose={handleClose}
      hideBackdrop
      variant='persistent'
      PaperProps={{
        sx: {
          width: '550px',
          py: 0,
          pt: 7
        }
      }}>
      <DialogContent>
        <Box
          mb={5}
          mt={1}
          width={'450px'}
          top={0}
          position="absolute">
          <Tooltip title='Close'>
            <IconButton
              size='large'
              onClick={handleClose}
              sx={{
                position: 'absolute',
                left: '-15px',
              }}>
              <CloseIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title='Delete task'>
            <IconButton
              size='large'
              onClick={e => setDeleteMenuAnchor(e.currentTarget)}
              sx={{
                position: 'absolute',
                right: '0',
              }}>
              <DeleteOutlineIcon htmlColor="red" />
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={deleteMenuAnchor}
            open={deleteMenuOpen}
            onClose={() => setDeleteMenuAnchor(null)}>
            <Box px={2} py={1}>
              <Button
                sx={{ mr: 0.5 }}
                disabled={isDeleting}
                onClick={() => setDeleteMenuAnchor(null)}>
                Cancel
              </Button>
              <LoadingButton
                disabled={isDeleting}
                color='error'
                variant='contained'
                loading={isDeleting}
                onClick={() => handleDeleteTask()}>
                Delete
              </LoadingButton>
            </Box>
          </Menu>
        </Box>
        <Box>
          <Box>
            <TextField
              fullWidth
              placeholder='Task name'
              variant="standard"
              value={name}
              multiline
              onBlur={handleNameChange}
              onChange={e => setName(e.target.value)}
              sx={{}}
              inputProps={{
                sx: { fontSize: '1.25rem' }
              }}
            />
          </Box>
        </Box>
        <Box display="flex" alignItems="center" mt={2.5}>
          <Chip
            label={status}
            deleteIcon={<MoreVertIcon />}
            onClick={e => setStatusMenuAnchor(e.currentTarget)}
            sx={{ mr: 4 }}
            onDelete={e => setStatusMenuAnchor(e.currentTarget)}
            className={status}>
          </Chip>
          <Menu
            anchorEl={statusMenuAnchor}
            open={statusMenuOpen}
            onClose={() => setStatusMenuAnchor(null)}>
            {
              statuses.map(({ name }) => {
                return (
                  <MenuItem
                    key={name}
                    onClick={() => handleStatusChange(name)}>
                    <Chip
                      label={name}
                      className={name}
                      sx={{ cursor: 'pointer' }}
                    />
                  </MenuItem>
                );
              })
            }
          </Menu>
          <FormControlLabel
            componentsProps={{ typography: { fontWeight: '300' } }}
            control={<Checkbox
              icon={<StarBorderIcon />}
              checkedIcon={<StarIcon htmlColor='gold' />}
              checked={isKeyTask}
              onChange={handleIsKeyChange}
            />}
            label="Key task"
          />
        </Box>
        <Divider sx={{ mt: 4 }} />
        <Box my={3}>
          <TextField
            fullWidth
            placeholder='Description'
            variant="standard"
            value={description}
            multiline
            onBlur={handleDescriptionChange}
            onChange={e => setDescription(e.target.value)}
          />
        </Box>
        <Divider />
        <Box my={4}>
          <Box my={2}>
            <TextField
              fullWidth
              placeholder='https://'
              variant="standard"
              value={linkUrl}
              multiline
              onBlur={handleLinkChange}
              onChange={e => setLinkUrl(e.target.value)}
              InputProps={{
                startAdornment:
                  <InputAdornment position='start' sx={{ transform: 'rotate(-45deg)' }}>
                    <LinkIcon />
                  </InputAdornment>
              }}
            />
          </Box>
          <Box>
            <Button
              disabled={!Boolean(task.link_url)}
              sx={{ mr: 1.5 }}
              onClick={() => window.open(task.link_url, '_blank')}
              endIcon={<OpenInNewIcon />}
              variant="outlined">
              Open
            </Button>
            <Button
              onClick={handleCopyLink}
              disabled={!Boolean(task.link_url)}
              startIcon={<ContentCopyIcon />}>
              {copyButtonText}
            </Button>
          </Box>
        </Box>
        <Divider />
        <Box my={4} maxWidth="300px">
          <Box my={2}>
            <FormControl fullWidth>
              <Autocomplete
                options={folders}
                getOptionLabel={(option) => option.name || ''}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                value={folder}
                renderOption={(props, option) => <li {...props} key={option.id}>{option.name}</li>}
                onChange={(_, val) => setFolder(val)}
                onBlur={handleFolderChange}
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
          </Box>

          <Box my={2}>
            <FormControl fullWidth>
              <Autocomplete
                options={membersAndAdmins}
                renderOption={(props, option) => <li {...props} key={option.id}>{option.firstName} {option.lastName}</li>}
                getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                groupBy={(option) => option.role}
                onBlur={handleAssignedToChange}
                onChange={(_, val) => setAssignedTo(val)}
                value={assignedTo}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Assigned to"
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
          </Box>

          <Box my={2}>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DatePicker
                format="MM/DD/YYYY"
                value={dateDue}
                InputProps={{
                  sx: {
                    flexDirection: 'row-reverse'
                  }
                }}
                onChange={value => setDateDue(value)}
                onAccept={handleDateDueChange}
                renderInput={(params) => <TextField
                  {...params}
                  fullWidth
                  onBlur={handleDateDueChange}
                  helperText='Date due'
                />}
              ></DatePicker>
            </LocalizationProvider>
          </Box>
        </Box>
        <Divider />
        <Box my={4}>
          <Box component="h4" mb={2}>Progress</Box>
          <Box display="flex" alignItems="center" width="96%">
            <Slider
              valueLabelDisplay="auto"
              step={5}
              marks={[
                { value: 3, label: '0%' },
                { value: 96, label: '100%' }
              ]}
              min={0}
              max={100}
              value={progress}
              onChangeCommitted={handleProgressChange}
              onChange={e => setProgress(e.target.value)}
              valueLabelFormat={val => `${val}%`}
            />
          </Box>
        </Box>
        <Divider />
        <Box my={4}>
          <Box component="h4" mb={2}>Tags</Box>
          <Box>
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
                onKeyDown={handleCreateTag}
                onChange={handleTagsChange}
                componentsProps={{
                  popper: {
                    placement: 'top'
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant='standard'
                    placeholder={selectedTags.length === 0 ? 'Add tags' : ''}
                  />
                )}
              />
            </FormControl>
          </Box>
        </Box>
        <Box my={6}>
          <Alert severity="info">
            Last updated by {task.updated_by_first} {task.updated_by_last} on
            &nbsp;{new Date(task.date_last_updated).toLocaleString()}
          </Alert>
        </Box>
      </DialogContent>
    </Drawer >
  );
};