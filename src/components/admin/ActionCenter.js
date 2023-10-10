import { Box, Button, Grow, IconButton, Menu, Paper, Tooltip } from "@mui/material";
import './styles.scss';
import AddIcon from '@mui/icons-material/Add';
import { useState } from "react";
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import PushPinIcon from '@mui/icons-material/PushPin';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import CreateNewFolderOutlinedIcon from '@mui/icons-material/CreateNewFolderOutlined';

export default function ActionCenter(props) {
  const {
    openDrawer
  } = props;

  const actions = {
    newFolder:
      <Grow in key="newFolder">
        <Paper
          style={{
            background: '#f5c644',
            padding: 0,
            borderRadius: '8px'
          }}
          className="pinned-btn">
          <IconButton
            style={{ borderRadius: '8px' }}
            onClick={() => openDrawer('folder')}
            size="small">
            <CreateNewFolderOutlinedIcon
              fontSize="small"
              htmlColor="white"
            />
          </IconButton>
        </Paper>
      </Grow>,
    newTask:
      <Grow key="newTask" in>
        <Button
          className="pinned-btn"
          style={{ borderRadius: '8px' }}
          size="small"
          variant="contained"
          onClick={() => openDrawer('create-task')}
          startIcon={<AddIcon style={{ marginRight: '-7px' }} />}>
          Task
        </Button>
      </Grow>
  };

  const [pinnedActions, setPinnedActions] = useState(
    (localStorage.getItem('pinnedActions') || '').split(',')
  );

  return (
    <Box className="action-center">
      {
        Object.keys(actions).map(action => pinnedActions.includes(action) ? actions[action] : null)
      }

      <ActionMenu
        setPinnedActions={setPinnedActions}
        pinnedActions={pinnedActions}
        openDrawer={openDrawer}
      />
    </Box>
  );
};


function ActionMenu({ pinnedActions, setPinnedActions, openDrawer }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handlePinAction = (action, e) => {
    e.stopPropagation();
    localStorage.setItem('pinnedActions', `${pinnedActions.join(',')},${action}`);
    setPinnedActions(prev => [...prev, action]);
  };

  const handleUnpinAction = (action, e) => {
    e.stopPropagation();
    const newPinnedActions = pinnedActions.filter(ac => action !== ac);
    localStorage.setItem('pinnedActions', newPinnedActions.join(','));
    setPinnedActions(newPinnedActions);
  };

  const handleNewFolder = () => {
    setAnchorEl(null);
    openDrawer('folder');
  };

  const handleNewTask = () => {
    setAnchorEl(null);
    openDrawer('create-task');
  };

  const newTaskPinned = pinnedActions.includes('newTask');
  const newFolderPinned = pinnedActions.includes('newFolder');

  return (
    <>
      <Paper className="action-menu-btn pinned-btn">
        <IconButton
          onClick={handleClick}>
          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16">
            <path fillRule="evenodd" clipRule="evenodd" fill="#ee5e99" d="M5 3.6H4a.4.4 0 0 0-.4.4v1c0 .22.18.4.4.4h1a.4.4 0 0 0 .4-.4V4a.4.4 0 0 0-.4-.4ZM4 2a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H4Z" >
            </path>
            <path fillRule="evenodd" clipRule="evenodd" fill="#f8ae00" d="M12 3.6h-1a.4.4 0 0 0-.4.4v1c0 .22.18.4.4.4h1a.4.4 0 0 0 .4-.4V4a.4.4 0 0 0-.4-.4ZM11 2a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2h-1Z" >
            </path>
            <path fillRule="evenodd" clipRule="evenodd" fill="#3db88b" d="M5 10.6H4a.4.4 0 0 0-.4.4v1c0 .22.18.4.4.4h1a.4.4 0 0 0 .4-.4v-1a.4.4 0 0 0-.4-.4ZM4 9a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-1a2 2 0 0 0-2-2H4Z" ></path>
            <path fillRule="evenodd" clipRule="evenodd" fill="#1090e0" d="M12 10.6h-1a.4.4 0 0 0-.4.4v1c0 .22.18.4.4.4h1a.4.4 0 0 0 .4-.4v-1a.4.4 0 0 0-.4-.4ZM11 9a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-1a2 2 0 0 0-2-2h-1Z" >
            </path>
          </svg>
        </IconButton>
      </Paper>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 100,
          horizontal: 'center'
        }}
        PaperProps={{
          style: {
            width: 200,
            borderRadius: 8
          },
          className: 'action-menu'
        }}>

        <MenuItem onClick={handleNewFolder}>
          <ListItemIcon>
            <FolderOutlinedIcon fontSize="small" htmlColor="#9988ff" />
          </ListItemIcon>
          <ListItemText>New folder</ListItemText>
          <Tooltip title={newFolderPinned ? 'Unpin' : 'Pin'} placement="left">
            <IconButton
              size="small"
              onClick={e => newFolderPinned ? handleUnpinAction('newFolder', e) : handlePinAction('newFolder', e)}>
              {newFolderPinned ? <PushPinIcon fontSize="small" /> : <PushPinOutlinedIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
        </MenuItem>

        <MenuItem onClick={handleNewTask}>
          <ListItemIcon>
            <TaskAltIcon fontSize="small" htmlColor="#67cb45" />
          </ListItemIcon>
          <ListItemText>New task</ListItemText>
          <Tooltip title={newTaskPinned ? 'Unpin' : 'Pin'} placement="left">
            <IconButton
              size="small"
              onClick={e => newTaskPinned ? handleUnpinAction('newTask', e) : handlePinAction('newTask', e)}>
              {newTaskPinned ? <PushPinIcon fontSize="small" /> : <PushPinOutlinedIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
        </MenuItem>
      </Menu>
    </>
  );
};
