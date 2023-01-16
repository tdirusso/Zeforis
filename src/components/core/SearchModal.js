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
import HistoryIcon from '@mui/icons-material/History';

export default function SearchModal({ open, setOpen }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState(JSON.parse(localStorage.getItem('recent-searches')) || []);

  const {
    folders,
    tasks
  } = useOutletContext();

  const filteredTasks = tasks.filter(task =>
    query && task.task_name.toLowerCase().includes(query.toLowerCase())
  );

  const filteredFolders = folders.filter(folder =>
    query && folder.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleTaskClick = (task) => {
    const path = `/home/task/${task.task_id}?exitPath=${pathname}`;
    const newItem = {
      name: task.task_name,
      path
    };

    localStorage.setItem('recent-searches', JSON.stringify([newItem, ...recentSearches]));
    setRecentSearches(rs => [newItem, ...rs]);
    navigate(path);
  };

  const handleFolderClick = (folder) => {
    const newItem = {
      name: folder.name,
      path: `/home/tasks?folderId=${folder.id}`
    };

    localStorage.setItem('recent-searches', JSON.stringify([newItem, ...recentSearches]));
    setRecentSearches(rs => [newItem, ...rs]);
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
        {
          !query ? <RecentSearchesSection
            recentSearches={recentSearches}
            setRecentSearches={setRecentSearches}
          />
            :
            <>
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
            </>
        }
      </Dialog>
    </div>
  );
};

function RecentSearchesSection({ recentSearches, setRecentSearches }) {
  return (
    <>
      <Typography variant='caption' display="flex" alignItems="center">
        <HistoryIcon fontSize='small' sx={{ mr: 0.5 }} />
        Recent Searches
      </Typography>
      <List dense>
        {
          recentSearches.map(searchItem => {
            return (
              <ListItem disablePadding key={searchItem.id}>
                <ListItemButton>
                  <ListItemIcon>
                    <HistoryIcon />
                  </ListItemIcon>
                  <ListItemText primary={searchItem.name} />
                </ListItemButton>
              </ListItem>
            );
          })
        }
      </List>
    </>
  );
}