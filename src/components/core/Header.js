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
import { useNavigate } from "react-router-dom";
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import './styles/Header.css';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import { logout } from "../../api/auth";

export default function Header(props) {
  const [anchorEl, setAnchorEl] = useState(null);
  
  const navigate = useNavigate();

  const {
    isAdmin,
    user,
    org,
    client,
    openModal,
    openDrawer
  } = props;

  const actionsMenuOpen = Boolean(anchorEl?.className.includes('actions-menu'));
  const orgMenuOpen = Boolean(anchorEl?.className.includes('org-menu'));

  const handleMenuClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const openCreateTaskDrawer = () => {
    setAnchorEl(null);
    openDrawer('create-task');
  };

  const openSettings = () => {
    setAnchorEl(null);
    navigate('/home/settings');
  };

  const openChangeOrgOrClient = () => {
    setAnchorEl(null);
    openDrawer('change-org-or-client');
  };

  const openCreateFolderDrawer = () => {
    setAnchorEl(null);
    openDrawer('create-folder');
  };

  const openMyAccount = () => {
    setAnchorEl(null);
    navigate('/home/settings?tab=Account');
  };

  const openSearch = () => {
    setAnchorEl(null);
    openModal('search');
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
                onClick={openSearch}>
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
            <MenuItem onClick={openCreateTaskDrawer}>
              <ListItemIcon>
                <AddTaskIcon />
              </ListItemIcon>
              <ListItemText>
                <Typography>
                  New Task
                </Typography>
              </ListItemText>
            </MenuItem>
            <MenuItem onClick={openCreateFolderDrawer}>
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
          <Tooltip title="Organization">
            <Paper sx={{ p: 0, borderRadius: '24px' }}>
              <IconButton
                className="org-menu"
                sx={{ borderRadius: '24px' }}
                size="large"
                onClick={handleMenuClick}>
                <Box className="org-circle" display="flex">
                  <AccountCircleRoundedIcon />
                </Box>
                <KeyboardArrowDownRoundedIcon />
              </IconButton>
            </Paper>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            open={orgMenuOpen}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                minWidth: '300px',
                pb: '15px !important'
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
              ml={2.25}
              gap={2.5}
              mr={2.25}
              display="flex">
              <Box>
                <Box display="flex">
                  <Typography color="#a5a5a5" mr={1}>
                    Client:
                  </Typography>
                  <Typography >
                    {client.name}
                  </Typography>
                </Box>
                <Box display="flex">
                  <Typography color="#a5a5a5" mr={1}>
                    Org:
                  </Typography>
                  <Typography>
                    {org.name}
                  </Typography>
                </Box>
              </Box>
              <Button
                sx={{ mt: '10px', mb: '5px' }}
                size="small"
                onClick={openChangeOrgOrClient}
                variant="outlined">
                Change
              </Button>
            </Box>
            <Divider sx={{ my: '8px' }} />
            <MenuItem onClick={openMyAccount}>
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText>
                <Typography>
                  My account
                </Typography>
              </ListItemText>
            </MenuItem>
            <MenuItem onClick={openSettings}>
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
            <MenuItem onClick={() => logout()}>
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
    </Grid>
  );
};
