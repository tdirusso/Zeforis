import { Divider, TextField, Typography } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import { Box } from '@mui/system';
import { useState } from 'react';
import { useLocation, useNavigate, useOutletContext } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import FolderIcon from '@mui/icons-material/Folder';

export default function SearchModal({ open, setOpen }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [query, setQuery] = useState('');

  const {
    folders,
    tasks
  } = useOutletContext();

  const filteredTasks = tasks.filter(task => {
    if (!query) {
      return true;
    }

    return task.task_name.toLowerCase().includes(query.toLowerCase());
  }
  );

  const filteredFolders = folders.filter(folder => {
    if (!query) {
      return true;
    }

    return folder.name.toLowerCase().includes(query.toLowerCase());
  }
  );

  const handleTaskClick = (task) => {
    navigate(`/home/task/${task.task_id}?exitPath=${pathname}`);
  };

  const handleFolderClick = (folder) => {
    navigate(`/home/tasks?folderId=${folder.id}`);
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      setQuery('');
    }, 500);
  };

  return (
    <div>
      <Dialog
        PaperProps={{
          sx: {
            height: 400,
            overflowX: 'hidden'
          }
        }}
        open={open}
        onClose={handleClose}>
        <Box minWidth={500}>
          <TextField
            autoFocus
            size='small'
            fullWidth
            onChange={e => setQuery(e.target.value)}
            placeholder="Search..."
          />
        </Box>
        <Divider sx={{ my: 2 }} />

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
        <Divider sx={{ my: 2 }} />
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
      </Dialog>
    </div>
  );
};