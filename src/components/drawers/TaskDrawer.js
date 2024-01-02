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
  Paper,
  CircularProgress,
  Typography
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
import CheckIcon from '@mui/icons-material/Check';
import moment from 'moment';

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
    setTasks,
    user,
    tasksMap,
    tagsMap,
    drawerProps: { taskProp }
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
  const [isDeleting, setDeleting] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState([]);

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
      setDateDue(taskProp.date_due ? moment(taskProp.date_due) : null);
      setIsKeyTask(Boolean(taskProp.is_key_task));
      setFolder(foldersMap[taskProp.folder_id] || null);
      setStatus(taskProp.status);
      setAssignedTo(membersAndAdmins.find(u => u.id === taskProp.assigned_to_id) || null);
      setSelectedTags(tagIds.map(tagId => ({
        id: Number(tagId),
        name: tagsMap[tagId].name
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

  const curTagsIds = task.tags?.split(',').filter(Boolean) || [];

  const curTags = curTagsIds.map(tagId => ({
    id: Number(tagId),
    name: tagsMap[tagId].name
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
      setFormErrors([]);
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
      } else {
        openSnackBar(result.message, 'error');
      }
    }
  };

  const handleStatusChange = status => {
    setStatus(status);
    setStatusMenuAnchor(null);
  };

  const handleIsKeyChange = (_, val) => {
    setIsKeyTask(val);
  };

  const handleTagsChange = (_, newTagsArray) => {
    setSelectedTags(newTagsArray);
  };

  const handleUpdateTask = async () => {
    const folderId = folder?.id;
    const assignedToId = assignedTo?.id || null;

    const errors = [];

    if (!name) {
      errors.push('name');
    }

    if (errors.length) {
      setFormErrors(errors);
      openSnackBar('Task name and folder are required.');
      return;
    }

    if (dateDue && !dateDue.isValid()) {
      openSnackBar('Due date is invalid.');
      return;
    }

    setLoading(true);

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
        const now = new Date().toISOString();
        let dateCompletedToSet = null;

        if (status === 'Complete') {
          if (task.date_completed) {
            dateCompletedToSet = task.date_completed;
          } else {
            dateCompletedToSet = now;
          }
        }

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
          date_completed: dateCompletedToSet,
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
        setLoading(false);
        handleClose();
        openSnackBar('Task successfully updated.', 'success');
      } else {
        setLoading(false);
        openSnackBar(message, 'error');
      }
    } catch (error) {
      setLoading(false);
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

  const handleNameChange = e => {
    setName(e.target.value);
    if (e.target.value && formErrors.includes('name')) {
      setFormErrors(prev => prev.filter(er => er !== 'name'));
    }
  };

  const handleFolderChange = (_, newVal) => {
    setFolder(newVal);
    if (newVal && formErrors.includes('folder')) {
      setFormErrors(prev => prev.filter(er => er !== 'folder'));
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
      <Paper className='p0 minimize-btn br50'>
        <Tooltip title="Close">
          <IconButton onClick={handleClose}>
            <KeyboardDoubleArrowRightIcon />
          </IconButton>
        </Tooltip>
      </Paper>
      <Paper className='p0 close-btn br50' hidden={!isAdmin}>
        <Tooltip title="Cancel" placement='top'>
          <IconButton onClick={handleClose} disabled={isLoading}>
            <CloseIcon color={isLoading ? '' : 'error'} />
          </IconButton>
        </Tooltip>
      </Paper>
      <Paper className='p0 save-btn br50' hidden={!isAdmin}>
        <Tooltip title="Save">
          <IconButton onClick={handleUpdateTask}>
            {
              isLoading ?
                <CircularProgress size='20px' /> :
                <CheckIcon htmlColor='#00c975' />
            }
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
                  disabled={isLoading}
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
              disabled={isLoading}
              fullWidth
              placeholder='Task name'
              variant="standard"
              value={name}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleUpdateTask();
                }
              }}
              multiline
              onChange={handleNameChange}
              error={formErrors.includes('name')}
              inputProps={{
                style: { fontSize: '1.25rem' }
              }}
              InputProps={{ readOnly: !isAdmin }}
              className={!isAdmin ? 'no-border-textfield' : ''}
            />
          </Box>
        </Box>
        <Box display="flex" alignItems="center" mt={2.5}>
          <Chip
            disabled={isLoading}
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
              disabled={!isAdmin || isLoading}
              icon={<StarBorderIcon />}
              checkedIcon={<StarIcon htmlColor='gold' />}
              checked={isKeyTask}
              onChange={handleIsKeyChange}
            />}
            label="Key task"
          />
        </Box>
        <Box display='inline-block' mt={1}>
          {
            task.date_completed ?
              <Alert severity="success">
                <Typography variant='caption'>
                  Completed {moment(task.date_completed).format('LLLL')}
                </Typography>
              </Alert> :
              null
          }
        </Box>

        <Divider style={{ marginTop: '2rem' }} />
        <Box my={3}>
          <TextField
            disabled={isLoading}
            fullWidth
            placeholder='Description'
            variant="standard"
            value={description}
            multiline
            inputRef={descriptionTextarea}
            inputProps={{ style: { resize: 'vertical' } }}
            onChange={e => setDescription(e.target.value)}
            InputProps={{ readOnly: !isAdmin }}
            className={!isAdmin ? 'no-border-textfield' : ''}
          />
        </Box>
        <Divider />
        <Box my={4}>
          <Box my={2}>
            <TextField
              disabled={isLoading}
              fullWidth
              helperText='Resource link'
              placeholder='https://'
              variant="standard"
              value={linkUrl}
              onChange={e => setLinkUrl(e.target.value)}
              className={!isAdmin ? 'no-border-textfield' : ''}
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
              disabled={!Boolean(task.link_url) || isLoading}
              style={{ marginRight: '0.75rem' }}
              onClick={() => window.open(task.link_url, '_blank')}
              endIcon={<OpenInNewIcon />}
              variant="outlined">
              Open
            </Button>
            <Button
              onClick={handleCopyLink}
              disabled={!Boolean(task.link_url) || isLoading}
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
                disabled={isLoading}
                readOnly={!isAdmin}
                options={folders}
                getOptionLabel={(option) => option.name || ''}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                value={folder}
                renderOption={(props, option) => <li {...props} key={option.id}>{option.name}</li>}
                onChange={handleFolderChange}
                renderInput={(params) => (
                  <TextField
                    placeholder='Folder'
                    error={formErrors.includes('folder')}
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
                disabled={isLoading}
                readOnly={!isAdmin}
                options={membersAndAdmins}
                renderOption={(props, option) => <li {...props} key={option.id}>{option.firstName} {option.lastName}</li>}
                getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                groupBy={(option) => option.role}
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
                disabled={isLoading}
                readOnly={!isAdmin}
                format="MM/DD/YYYY"
                value={dateDue}
                InputProps={{
                  style: {
                    flexDirection: 'row-reverse'
                  }
                }}
                onChange={value => setDateDue(value)}
                onAccept={value => setDateDue(value)}
                renderInput={(params) => <TextField
                  {...params}
                  fullWidth
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
                disabled={isLoading}
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
                className={!isAdmin ? 'no-border-textfield' : ''}
                componentsProps={{
                  popper: {
                    placement: 'top'
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    helperText='"&#x23CE;" to create new tags'
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
            <Typography variant='body2'>
              Last updated by <strong>{task.updated_by_first} {task.updated_by_last}</strong> on &ndash;
            </Typography>
            <Typography variant='body2'>
              {moment(task.date_last_updated).format('LLLL')}
            </Typography>
          </Alert>
        </Box>
      </DialogContent>
    </Drawer>
  );
};