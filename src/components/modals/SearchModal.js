import { Divider, InputAdornment, TextField, Typography } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import { Box } from '@mui/system';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import FolderIcon from '@mui/icons-material/Folder';
import { isMobile } from '../../lib/constants';
import SearchIcon from '@mui/icons-material/Search';

export default function SearchModal(props) {
  const navigate = useNavigate();

  const [query, setQuery] = useState('');

  const {
    folders,
    tasks,
    isOpen,
    close,
    openDrawer
  } = props;

  const filteredTasks = tasks.filter(task => {
    if (!query) {
      return true;
    }

    return task.task_name.toLowerCase().includes(query.toLowerCase());
  });

  const filteredFolders = folders.filter(folder => {
    if (!query) {
      return true;
    }

    return folder.name.toLowerCase().includes(query.toLowerCase());
  });

  const handleTaskClick = (task) => {
    openDrawer('task', { taskProp: task });
    close();
    setTimeout(() => {
      setQuery('');
    }, 500);
  };

  const handleFolderClick = (folder) => {
    navigate(`/home/tasks?folderId=${folder.id}`);
    close();
    setTimeout(() => {
      setQuery('');
    }, 500);
  };

  const handleClose = () => {
    close();
    setQuery('');
    setTimeout(() => {
      setQuery('');
    }, 500);
  };

  return (
    <div>
      <Dialog
        PaperProps={{
          className: 'search-dialog'
        }}
        open={isOpen}
        onClose={handleClose}>
        <Box>
          <TextField
            autoFocus={!isMobile}
            size='small'
            fullWidth
            onChange={e => setQuery(e.target.value)}
            placeholder="Search..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              )
            }}
          />
        </Box>
        <Divider className='my2' />
        <Box overflow='auto'>
          <Typography variant='caption'>
            Folders
          </Typography>
          <List dense>
            {
              filteredFolders.map(folder => {
                return (
                  <ListItem disablePadding key={folder.id}>
                    <ListItemButton onClick={() => handleFolderClick(folder)}>
                      <ListItemIcon>
                        <FolderIcon />
                      </ListItemIcon>
                      <ListItemText primary={folder.name} />
                    </ListItemButton>
                  </ListItem>
                );
              })
            }
          </List>
          <Divider className='my2' />
          <Typography variant='caption'>
            Tasks
          </Typography>
          <List dense>
            {
              filteredTasks.map(task => {
                return (
                  <ListItem disablePadding key={task.task_id}>
                    <ListItemButton onClick={() => handleTaskClick(task)}>
                      <ListItemIcon>
                        <TaskAltIcon />
                      </ListItemIcon>
                      <ListItemText primary={task.task_name} />
                    </ListItemButton>
                  </ListItem>
                );
              })
            }
          </List>
        </Box>
      </Dialog>
    </div>
  );
};