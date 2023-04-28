import { Grid, IconButton, Paper, Box, Typography, Button, Tooltip, Divider } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useState } from "react";
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import AddTaskIcon from '@mui/icons-material/AddTask';
import FolderIcon from '@mui/icons-material/Folder';
import AddTaskModal from "../admin/AddTaskModal";
import AddFolderModal from "../admin/AddFolderModal";
import SearchModal from "./SearchModal";
import { useOutletContext } from "react-router-dom";
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import './styles/Header.css';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';

export default function Header(props) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [addTaskModalOpen, setAddTaskModalOpen] = useState(false);
  const [addFolderModalOpen, setAddFolderModalOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  const {
    isAdmin,
    user,
    account,
    client,
    openModal,
    openDrawer
  } = props;

  const actionsMenuOpen = Boolean(anchorEl?.className.includes('actions-menu'));
  const accountMenuOpen = Boolean(anchorEl?.className.includes('account-menu'));

  const handleMenuClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const openAddTask = () => {
    setAnchorEl(null);
    openDrawer('add-task');
  };

  const openAddFolder = () => {
    setAnchorEl(null);
    setAddFolderModalOpen(true);
  };

  return (
    <Grid
      item
      xs={12}
      className="Header"
      component="header">
      <Box
        sx={{
          height: 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'right',
          width: '100%'
        }}>
        <Box mr={2}>
          <Tooltip title="Search">
            <Paper sx={{ p: 0, borderRadius: '50%' }}>
              <IconButton
                size="large"
                onClick={() => setSearchModalOpen(true)}>
                <SearchIcon />
              </IconButton>
            </Paper>
          </Tooltip>
        </Box>
        <Box hidden={!isAdmin} mr={2}>
          <Tooltip title="Actions">
            <Paper sx={{ p: 0, borderRadius: '50%' }}>
              <IconButton
                className="actions-menu"
                size="large"
                onClick={handleMenuClick}>
                <MoreVertIcon />
              </IconButton>
            </Paper>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            open={actionsMenuOpen}
            onClose={handleMenuClose}
            PaperProps={{
              style: {
                width: '20ch',
              }
            }}>
            <MenuItem onClick={openAddTask}>
              <ListItemIcon>
                <AddTaskIcon />
              </ListItemIcon>
              <ListItemText>
                <Typography>
                  New Task
                </Typography>
              </ListItemText>
            </MenuItem>
            <MenuItem onClick={openAddFolder}>
              <ListItemIcon>
                <FolderIcon />
              </ListItemIcon>
              <ListItemText>
                <Typography>
                  New Folder
                </Typography>
              </ListItemText>
            </MenuItem>
          </Menu>
        </Box>

        <Box>
          <Tooltip title="Account">
            <Paper sx={{ p: 0, borderRadius: '24px' }}>
              <IconButton
                className="account-menu"
                sx={{ borderRadius: '24px' }}
                size="large"
                onClick={handleMenuClick}>
                <Box className="account-circle" display="flex">
                  <AccountCircleRoundedIcon />
                </Box>
                <KeyboardArrowDownRoundedIcon />
              </IconButton>
            </Paper>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            open={accountMenuOpen}
            onClose={handleMenuClose}
            PaperProps={{
              style: {
                minWidth: '275px',
              }
            }}>
            <Box p="23px 28px 14px 25px">
              <Typography>
                <b>{user.firstName} {user.lastName}</b>
              </Typography>
              <Typography variant="body2">
                {user.email}
              </Typography>
            </Box>

            <Divider sx={{ my: '8px' }} />

            <Box
              py={1}
              display="flex"
              justifyContent="space-around"
              textAlign="center">
              <Box>
                <Typography color="#a5a5a5">
                  Client
                </Typography>
                <Typography >
                  {client.name}
                </Typography>
                <Button
                  sx={{ mt: '10px', mb: '5px' }}
                  size="small"
                  variant="outlined">
                  Change
                </Button>
              </Box>
              <Box>
                <Typography color="#a5a5a5">
                  Org
                </Typography>
                <Typography>
                  {account.name}
                </Typography>
                <Button
                  sx={{ mt: '10px', mb: '5px' }}
                  size="small"
                  variant="outlined">
                  Change
                </Button>
              </Box>
            </Box>
            <Divider sx={{ my: '8px' }} />
            <MenuItem onClick={openAddTask}>
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText>
                <Typography>
                  My account
                </Typography>
              </ListItemText>
            </MenuItem>
            <MenuItem onClick={openAddTask}>
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText>
                <Typography>
                  Settings
                </Typography>
              </ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem onClick={openAddFolder}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText>
                <Typography>
                  Log out
                </Typography>
              </ListItemText>
            </MenuItem>
          </Menu>
        </Box>
      </Box>
      <Divider sx={{ mt: 2.5, mb: 2 }} />

      {/* <AddTaskModal
        open={addTaskModalOpen}
        setOpen={setAddTaskModalOpen}
      />

      <AddFolderModal
        open={addFolderModalOpen}
        setOpen={setAddFolderModalOpen}
      />

      <SearchModal
        open={searchModalOpen}
        setOpen={setSearchModalOpen}
      /> */}
    </Grid>
  );
};
