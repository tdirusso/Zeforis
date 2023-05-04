import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useEffect, useRef, useState } from 'react';
import {
  Autocomplete,
  Box,
  Button,
  Drawer,
  Grid,
  IconButton,
  TextField,
  Typography,
  Chip,
  Divider,
  LinearProgress,
  Alert
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { FormControl } from "@mui/material";
import { createTask } from '../../api/tasks';
import InputAdornment from '@mui/material/InputAdornment';
import { createTag } from '../../api/clients';
import LinkIcon from '@mui/icons-material/Link';
import FolderIcon from '@mui/icons-material/Folder';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import CloseIcon from '@mui/icons-material/Close';
import StarIcon from '@mui/icons-material/Star';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

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
    defaultFolder,
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

  const linkUrl = useRef();
  const navigate = useNavigate();

  const [isLoading, setLoading] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [assignedTo, setAssignedTo] = useState(null);
  const [folder, setFolder] = useState(defaultFolder || null);
  const [name, setName] = useState('');
  const [copyButtonText, setCopyButtonText] = useState('Copy Link URL');
  const [task, setTask] = useState(defaultTask);

  useEffect(() => {
    setTask(taskProp || defaultTask);
    if (taskProp) {
      setTask(taskProp);
      setName(taskProp.task_name);
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
      setCopyButtonText('Copy Link URL');
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

  return (
    <Drawer
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
              inputProps={{
                sx: { fontSize: '1.25rem' }
              }}
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
          className={task.status}>
        </Chip>
        <Box my={2}>
          <Typography variant="body1">
            {
              task.description ? task.description : 'No description.'
            }
          </Typography>
        </Box>
        <Divider sx={{ mt: 4 }} />
        <Box my={4}>
          <Box component="h4" mb={0.5}>Link URL</Box>
          <Typography mb={1} sx={{ overflowWrap: 'break-word' }}>
            {
              task.link_url ? task.link_url : 'None.'
            }
          </Typography>
          <Box>
            <Button
              disabled={!Boolean(task.link_url)}
              sx={{ mr: 1.5 }}
              onClick={() => window.open(task.link_url, '_blank')}
              endIcon={<OpenInNewIcon />}
              variant="outlined">
              Open Link URL
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
        <Box my={4}>
          <Box component="h4" mb={2}>Progress</Box>
          <Box display="flex" alignItems="center">
            <LinearProgress
              variant="determinate"
              value={task.progress}
              sx={{
                height: 10,
                width: '100%',
                mr: 1.5,
                borderRadius: 25
              }}
            />
            <Typography variant="body2">
              {task.progress}%
            </Typography>
          </Box>
        </Box>

        <Divider />

        <Box my={4}
          display="flex"
          justifyContent="space-evenly"
          textAlign="center"
          flexWrap="wrap"
          gap={2}>
          <Box>
            <Box component="h4" mb={1}>Folder</Box>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate(`/home/tasks?folderId=${task.folder_id}`)}
              startIcon={<FolderIcon />}>
              {foldersMap[task.folder_id]?.name}
            </Button>
          </Box>

          <Box>
            <Box component="h4" mb={1}>Assigned To</Box>
            <Box display="flex" alignItems="center">
              <Avatar sx={{ mr: 1 }}>
                <PersonIcon />
              </Avatar>
              <Typography mb={0.5}>
                {
                  task.assigned_to_id ?
                    `${task.assigned_first} ${task.assigned_last}`
                    : 'None'
                }
              </Typography>
            </Box>
          </Box>

          <Box>
            <Box component="h4" mb={1}>Date Due</Box>
            <Box display="flex" alignItems="center">
              <Avatar sx={{ mr: 1 }}>
                <CalendarTodayIcon />
              </Avatar>
              <Typography mb={0.5}>
                {
                  task.date_due ? new Date(task.date_due).toLocaleDateString() : 'None'
                }
              </Typography>
            </Box>
          </Box>
        </Box>
        <Divider />

        <Box my={4}>
          <Box component="h4" mb={2}>Tags</Box>
          <Box>
            {
              taskTags.length > 0 ?
                taskTags.map(tag => <Chip
                  label={tag}
                  key={tag}
                  sx={{ m: 0.5 }}
                />) :
                'None.'
            }
          </Box>
        </Box>
        <Divider />

        <Box my={4}>
          <Alert severity="info">
            Last updated by {task.updated_by_first} {task.updated_by_last} on
            &nbsp;{new Date(new Date(task.date_last_updated).toLocaleString() + ' UTC').toLocaleString()}
          </Alert>
        </Box>
      </DialogContent>
    </Drawer>
  );
};