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
import './styles/Header.scss';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import { logout } from "../../api/auth";
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import { SwapHorizOutlined } from "@mui/icons-material";
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import HelpIcon from '@mui/icons-material/Help';

export default function Header(props) {
  const [anchorEl, setAnchorEl] = useState(null);

  const navigate = useNavigate();

  const {
    isAdmin,
    user,
    org,
    engagement,
    openModal,
    openDrawer,
    toggleSideNav,
    isSideNavOpen,
    openDialog
  } = props;

  const actionsMenuOpen = Boolean(anchorEl?.className.includes('actions-menu'));
  const orgMenuOpen = Boolean(anchorEl?.className.includes('org-menu'));

  const customLoginPageUrl = `${process.env.REACT_APP_APP_DOMAIN}/login?cp=${window.btoa(`orgId=${org.id}`)}`;

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

  const openChangeOrgOrEngagement = () => {
    setAnchorEl(null);
    openDialog('choose-engagement');
  };

  const openCreateFolderDrawer = () => {
    setAnchorEl(null);
    openDrawer('folder');
  };

  const openSearch = () => {
    setAnchorEl(null);
    openModal('search');
  };

  const openCreateEngagementDialog = () => {
    setAnchorEl(null);
    openDialog('create-engagement');
  };

  const openGettingStartedDrawer = () => {
    setAnchorEl(null);
    openDrawer('getting-started');
  };

  return (
    <Grid
      item
      xs={12}
      className="header"
      component="header">
      <Box className="header-box">
        <Box>
          <Tooltip title={isSideNavOpen ? 'Close Menu' : 'Open Menu'}>
            <Paper className="header-button">
              <IconButton
                size="large"
                onClick={toggleSideNav}>
                <MenuOpenIcon
                  style={{
                    transform: isSideNavOpen ? 'rotate(0deg)' : 'rotate(180deg)',
                    transition: 'transform 200ms'
                  }}
                />
              </IconButton>
            </Paper>
          </Tooltip>
        </Box>
        <Box display="flex">
          <Box mr={2}>
            <Tooltip title="Search">
              <Paper className="header-button">
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
              <Paper className="header-button">
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
              <Divider />
              <MenuItem onClick={openCreateEngagementDialog}>
                <ListItemIcon>
                  <AccountBoxIcon />
                </ListItemIcon>
                <ListItemText>
                  <Typography>
                    New Engagement
                  </Typography>
                </ListItemText>
              </MenuItem>
            </Menu>
          </Box>

          <Box>
            <Tooltip title="Settings">
              <Paper style={{ padding: 0, borderRadius: '24px' }}>
                <IconButton
                  className="org-menu"
                  style={{ borderRadius: '24px' }}
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
                style: {
                  minWidth: '300px',
                  paddingBottom: '15px !important',
                  maxWidth: '350px'
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

              <Divider style={{ margin: '8px 0' }} />
              <Box
                flexDirection='column'
                py={1}
                ml={2.25}
                gap={2.5}
                mr={2.25}
                display="flex"
                flexWrap='wrap'>
                <Box>
                  <Box display="flex">
                    <Typography color="#a5a5a5" mr={1}>
                      Engagement:
                    </Typography>
                    <Typography >
                      {engagement.name}
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
                  startIcon={<SwapHorizOutlined />}
                  onClick={openChangeOrgOrEngagement}
                  variant="outlined">
                  Change
                </Button>
              </Box>
              <Divider style={{ margin: '8px 0' }} />
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
              <MenuItem onClick={openGettingStartedDrawer}>
                <ListItemIcon>
                  <HelpIcon />
                </ListItemIcon>
                <ListItemText>
                  <Typography>
                    Help
                  </Typography>
                </ListItemText>
              </MenuItem>
              <Divider />
              <MenuItem onClick={() => logout(user.email, customLoginPageUrl)}>
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
      </Box>
      <Divider style={{ marginTop: '1.25rem', marginBottom: '1rem' }} />
    </Grid>
  );
};
