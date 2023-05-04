import DialogContent from '@mui/material/DialogContent';
import { useEffect, useState } from 'react';
import {
  Autocomplete,
  Box,
  Button,
  Drawer,
  IconButton,
  TextField,
  Typography,
  Chip,
  Divider,
  Alert,
  Menu,
  MenuItem,
  Slider
} from '@mui/material';
import { FormControl } from "@mui/material";
import InputAdornment from '@mui/material/InputAdornment';
import { createTag } from '../../api/clients';
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
    setTasks,
    user,
    openSnackBar,
    tasks,
    foldersMap,
    tagsMap,
    isAdmin,
    taskProp
  } = props;

  const clientId = client.id;

  const [isLoading, setLoading] = useState(false);
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
  const [dateDue, setDateDue] = useState(null);

  const statusMenuOpen = Boolean(statusMenuAnchor);

  useEffect(() => {
    setTask(taskProp || defaultTask);
    if (taskProp) {
      setTask(taskProp);
      setName(taskProp.task_name);
      setDescription(taskProp.description);
      setLinkUrl(taskProp.link_url);
      setProgress(taskProp.progress);
      setDateDue(taskProp.date_due || null);
      setFolder(foldersMap[taskProp.folder_id] || null);
      setAssignedTo(membersAndAdmins.find(u => u.id === taskProp.assigned_to_id) || null);
    }
  }, [taskProp]);

  const taskTagIds = task.tags?.split(',').filter(Boolean) || [];
  const taskTags = taskTagIds.map(id => tagsMap[id].name);

  const tagIdNameMap = {};
  tags.forEach(tag => tagIdNameMap[tag.id] = tag.name);

  const handleCopyLink = () => {
    window.navigator.clipboard.writeText(task.link_url);
    setCopyButtonText('Copied!');
    setTimeout(() => {
      setCopyButtonText('Copy Link');
    }, 500);
  };

  const handleClose = () => {
    close();
    setTimeout(() => {
      setFolder(null);
      setAssignedTo(null);
      setSelectedTags([]);
      setLoading(false);
    }, 500);
  };

  const handleStatusMenuClose = () => {
    setStatusMenuAnchor(null);
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
      } else {
        openSnackBar(result.message, 'error');
      }
    }
  };

  const handleNameChange = e => {
    setName(e.target.value);
  };

  const handleDescriptionChange = e => {
    setDescription(e.target.value);
  };

  const handleUpdateStatus = () => {
    setStatusMenuAnchor(null);
  };

  const handleLinkChange = e => {
    setLinkUrl(e.target.value);
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
          pb: 0
        }
      }}>
      <DialogContent>
        <Box
          mb={4}
          mt={1}
          display="flex"
          position="relative"
          alignItems="center"
          justifyContent="center">
          <IconButton
            size='large'
            onClick={handleClose}
            sx={{
              position: 'absolute',
              left: '-8px',
            }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box mt={2}>
          <Box>
            <TextField
              fullWidth
              placeholder='Task name'
              variant="standard"
              value={name}
              multiline
              onChange={handleNameChange}
              sx={{}}
              inputProps={{
                sx: { fontSize: '1.25rem' }
              }}
            />
          </Box>
          <Box my={2}>
            <TextField
              fullWidth
              placeholder='Description'
              variant="standard"
              value={description}
              multiline
              onChange={handleDescriptionChange}
            />
          </Box>
          {
            task.is_key_task ?
              <Box display="flex" alignItems="center" mt={0.5}>
                <StarIcon htmlColor="gold" fontSize="small" />
                <Typography variant="caption">Key Task</Typography>
              </Box>
              :
              ''
          }
        </Box>
        <Chip
          label={task.status}
          deleteIcon={<MoreVertIcon />}
          onClick={e => setStatusMenuAnchor(e.currentTarget)}
          onDelete={() => { }}
          className={task.status}>
        </Chip>
        <Menu
          anchorEl={statusMenuAnchor}
          open={statusMenuOpen}
          onClose={() => setStatusMenuAnchor(null)}
        >
          {
            statuses.map(statusName => {
              return (
                <MenuItem
                  key={statusName}
                  onClick={() => handleUpdateStatus(statusName)}>
                  <Chip
                    label={statusName}
                    className={statusName}
                    onClick={() => { }}
                  />
                </MenuItem>
              );
            })
          }
        </Menu>
        <Divider sx={{ mt: 4 }} />
        <Box my={4}>
          <Box my={2}>
            <TextField
              fullWidth
              placeholder='https://'
              variant="standard"
              value={linkUrl}
              multiline
              onChange={handleLinkChange}
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
                disabled={isLoading}
                value={folder}
                renderOption={(props, option) => <li {...props} key={option.id}>{option.name}</li>}
                onChange={(_, val) => setFolder(val)}
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
                disabled={isLoading}
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
                disabled={isLoading}
                onChange={(_, newVal) => setSelectedTags(newVal)}
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
            &nbsp;{new Date(new Date(task.date_last_updated).toLocaleString() + ' UTC').toLocaleString()}
          </Alert>
        </Box>
      </DialogContent>
    </Drawer>
  );
};