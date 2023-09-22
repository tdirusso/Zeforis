/* eslint-disable react-hooks/exhaustive-deps */
import DialogContent from '@mui/material/DialogContent';
import { useEffect, useRef, useState } from 'react';
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
  FormControlLabel,
  Checkbox,
  Tooltip,
  Grid,
  Paper
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
import './styles.scss';
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
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';

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
    isAdmin,
    close,
    folders,
    engagementMembers,
    engagementAdmins,
    engagement,
    tags,
    setTags,
    openSnackBar,
    foldersMap,
    taskProp,
    setTasks,
    user,
    tasksMap
  } = props;

  const engagementId = engagement.id;

  const [selectedTags, setSelectedTags] = useState([]);
  const [assignedTo, setAssignedTo] = useState(null);
  const [folder, setFolder] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [copyButtonText, setCopyButtonText] = useState('Copy Link');
  const [task, setTask] = useState(defaultTask);
  const [membersAndAdmins] = useState([...engagementAdmins, ...engagementMembers]);
  const [statusMenuAnchor, setStatusMenuAnchor] = useState(null);
  const [deleteMenuAnchor, setDeleteMenuAnchor] = useState(null);
  const [dateDue, setDateDue] = useState(null);
  const [isKeyTask, setIsKeyTask] = useState(false);
  const [status, setStatus] = useState(null);
  const [needsUpdating, setNeedsUpdating] = useState(false);
  const [isDeleting, setDeleting] = useState(false);

  const descriptionTextarea = useRef();

  const statusMenuOpen = Boolean(statusMenuAnchor);
  const deleteMenuOpen = Boolean(deleteMenuAnchor);

  useEffect(() => {
    if (taskProp) {
      const tagIds = taskProp.tags?.split(',').filter(Boolean) || [];
      setTask(taskProp);
      setName(taskProp.task_name);
      setDescription(taskProp.description);
      setLinkUrl(taskProp.link_url);
      setDateDue(taskProp.date_due ? new Date(taskProp.date_due) : null);
      setIsKeyTask(Boolean(taskProp.is_key_task));
      setFolder(foldersMap[taskProp.folder_id] || null);
      setStatus(taskProp.status);
      setAssignedTo(membersAndAdmins.find(u => u.id === taskProp.assigned_to_id) || null);
      setSelectedTags(tagIds.map(tagId => ({
        id: Number(tagId),
        name: tagIdNameMap[tagId],
        engagement_id: engagementId
      })));
    } else {
      setTask(defaultTask);
      setName('');
      setDescription('');
      setLinkUrl('');
      setDateDue(null);
      setIsKeyTask(false);
      setFolder(null);
      setStatus(null);
      setAssignedTo(null);
      setSelectedTags([]);
    }
  }, [taskProp]);

  const tagIdNameMap = {};
  tags.forEach(tag => tagIdNameMap[tag.id] = tag.name);

  const curTagsIds = task.tags?.split(',').filter(Boolean) || [];

  const curTags = curTagsIds.map(tagId => ({
    id: Number(tagId),
    name: tagIdNameMap[tagId],
    engagement_id: engagementId
  }));

  const handleCopyLink = () => {
    window.navigator.clipboard.writeText(task.link_url);
    setCopyButtonText('Copied');
    setTimeout(() => {
      setCopyButtonText('Copy Link');
    }, 500);
  };

  const handleClose = () => {
    close();
    setTimeout(() => {
      descriptionTextarea.current.style.height = 'auto';
    }, 500);
  };

  const handleCreateTag = async e => {
    const key = e.key;
    const newTagValue = e.target.value;

    if (key === 'Enter' && newTagValue) {
      const result = await createTag({
        name: newTagValue,
        engagementId
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

  const handleFolderChange = () => {
    if (!folder) {
      openSnackBar('Please choose a folder for the task.');
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
      openSnackBar('Please choose a folder for the task.');
      return;
    }

    try {
      const { message, success } = await updateTask({
        name,
        description,
        linkUrl,
        status,
        assignedToId,
        folderId,
        engagementId,
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
        engagementId,
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
        className: 'drawer'
      }}>
      <Paper className='p0' style={{ position: 'absolute', top: '50vh', left: '-20px' }}>
        <Tooltip title="Close">
          <IconButton onClick={handleClose}>
            <KeyboardDoubleArrowRightIcon />
          </IconButton>
        </Tooltip>
      </Paper>
      <DialogContent style={{ paddingTop: '15px' }}>
        <Grid container rowSpacing={0} columnSpacing={1.5}>
          <Grid item xs={12} mb={2}>
            <Box display='flex' justifyContent='space-between'>
              <Tooltip title='Close'>
                <IconButton
                  onClick={handleClose}>
                  <CloseIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title='Delete task' hidden={!isAdmin}>
                <IconButton

                  onClick={e => setDeleteMenuAnchor(e.currentTarget)}>
                  <DeleteOutlineIcon htmlColor="red" />
                </IconButton>
              </Tooltip>

              <Menu
                anchorEl={deleteMenuAnchor}
                open={deleteMenuOpen}
                onClose={() => setDeleteMenuAnchor(null)}>
                <Box px={2} py={1}>
                  <LoadingButton
                    color='error'
                    variant='contained'
                    loading={isDeleting}
                    onClick={() => handleDeleteTask()}>
                    Delete
                  </LoadingButton>
                </Box>
              </Menu>
            </Box>
          </Grid>
        </Grid>



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
              inputProps={{
                style: { fontSize: '1.25rem' }
              }}
              InputProps={{ readOnly: !isAdmin }}
              className={!isAdmin ? 'readonly-textfield' : ''}
            />
          </Box>
        </Box>
        <Box display="flex" alignItems="center" mt={2.5}>
          <Chip
            label={status}
            deleteIcon={<MoreVertIcon />}
            onClick={isAdmin ? e => setStatusMenuAnchor(e.currentTarget) : () => { }}
            style={{
              marginRight: '2rem',
              cursor: isAdmin ? 'pointer' : 'unset'
            }}
            onDelete={isAdmin ? e => setStatusMenuAnchor(e.currentTarget) : () => { }}
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
                      style={{ cursor: 'pointer' }}
                    />
                  </MenuItem>
                );
              })
            }
          </Menu>
          <FormControlLabel
            componentsProps={{ typography: { fontWeight: '300' } }}
            control={<Checkbox
              disabled={!isAdmin}
              icon={<StarBorderIcon />}
              checkedIcon={<StarIcon htmlColor='gold' />}
              checked={isKeyTask}
              onChange={handleIsKeyChange}
            />}
            label="Key task"
          />
        </Box>
        <Divider style={{ marginTop: '2rem' }} />
        <Box my={3}>
          <TextField
            fullWidth
            placeholder='Description'
            variant="standard"
            value={description}
            multiline
            inputRef={descriptionTextarea}
            inputProps={{ style: { resize: 'vertical' } }}
            onBlur={handleDescriptionChange}
            onChange={e => setDescription(e.target.value)}
            InputProps={{ readOnly: !isAdmin }}
            className={!isAdmin ? 'readonly-textfield' : ''}
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
              className={!isAdmin ? 'readonly-textfield' : ''}
              InputProps={{
                startAdornment:
                  <InputAdornment position='start' style={{ transform: 'rotate(-45deg)' }}>
                    <LinkIcon />
                  </InputAdornment>,
                readOnly: !isAdmin
              }}
            />
          </Box>
          <Box>
            <Button
              disabled={!Boolean(task.link_url)}
              style={{ marginRight: '0.75rem' }}
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
                readOnly={!isAdmin}
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
                        </InputAdornment>,
                      endAdornment: isAdmin ? params.InputProps.endAdornment : null
                    }}
                  />
                )}
              />
            </FormControl>
          </Box>

          <Box my={2}>
            <FormControl fullWidth>
              <Autocomplete
                readOnly={!isAdmin}
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
                        </InputAdornment>,
                      endAdornment: isAdmin ? params.InputProps.endAdornment : null
                    }}
                  />
                )}
              />
            </FormControl>
          </Box>

          <Box my={2}>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DatePicker
                readOnly={!isAdmin}
                format="MM/DD/YYYY"
                value={dateDue}
                InputProps={{
                  style: {
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
          <Box component="h4" mb={2}>Tags</Box>
          <Box>
            <FormControl fullWidth>
              <Autocomplete
                readOnly={!isAdmin}
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
                className={!isAdmin ? 'readonly-textfield' : ''}
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
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: isAdmin ? params.InputProps.endAdornment : null
                    }}
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