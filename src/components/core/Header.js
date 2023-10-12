import { Grid, IconButton, Paper, Box, Typography, Tooltip, Divider, ToggleButtonGroup, ToggleButton } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useState } from "react";
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import { useNavigate } from "react-router-dom";
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import './styles/Header.scss';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import { logout } from "../../api/auth";
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import HelpIcon from '@mui/icons-material/Help';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { updateTheme } from "../../lib/utils";
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';

export default function Header(props) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [themeVal, setThemeVal] = useState(localStorage.getItem('theme') || 'light');

  const navigate = useNavigate();

  const {
    user,
    org,
    engagement,
    openModal,
    openDrawer,
    toggleSideNav,
    isSideNavOpen,
    openDialog,
    setTheme
  } = props;

  const orgMenuOpen = Boolean(anchorEl?.className.includes('org-menu'));

  const customLoginPageUrl = `${process.env.REACT_APP_APP_DOMAIN}/login?cp=${window.btoa(`orgId=${org.id}`)}`;

  const handleMenuClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const openSettings = () => {
    setAnchorEl(null);
    navigate('/home/settings/engagement/collaborators');
  };

  const openSearch = () => {
    setAnchorEl(null);
    openModal('search');
  };

  const openGettingStartedDrawer = () => {
    setAnchorEl(null);
    openDrawer('getting-started');
  };

  const handleThemeChange = (_, newThemeMode) => {
    if (newThemeMode) {
      setThemeVal(newThemeMode);
      updateTheme(setTheme, newThemeMode);
    }
  };

  return (
    <Grid
      style={{ paddingTop: '15px' }}
      item
      xs={12}
      className="header"
      component="header">
      <Box className="header-box">
        <Box>
          <Tooltip title={isSideNavOpen ? 'Close Menu' : 'Open Menu'}>
            <IconButton
              onClick={toggleSideNav}>
              <MenuOpenIcon
                style={{
                  transform: isSideNavOpen ? 'rotate(0deg)' : 'rotate(180deg)',
                  transition: 'transform 200ms'
                }}
              />
            </IconButton>
          </Tooltip>
        </Box>
        <Box className="engagement-title">
          <Box className="flex-ac">
            <Typography variant='h1' style={{ fontSize: '1.55rem', fontWeight: 200 }} mr={2}>
              {engagement.name}
            </Typography>
            <Tooltip title="Change Engagement">
              <Paper className="header-button">
                <IconButton
                  size="small"
                  onClick={() => openDialog('choose-engagement')}>
                  <SwapHorizIcon />
                </IconButton>
              </Paper>
            </Tooltip>
          </Box>
        </Box>
        <Box className="flex-ac">
          <Box mr={2}>
            <Tooltip title="Search">
              <IconButton
                onClick={openSearch}>
                <SearchIcon />
              </IconButton>
            </Tooltip>
          </Box>
          <Box>
            <Tooltip title="Settings">
              <Paper style={{ padding: 0, borderRadius: '24px' }}>
                <IconButton
                  className="org-menu"
                  style={{ borderRadius: '24px' }}
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
              <Box p="10px 20px 5px 20px">
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
                <Box className="flex-ac">
                  <Box>
                    <Box display="flex">
                      <Typography color="#a5a5a5" mr={1}>
                        Engagement:
                      </Typography>
                      <Typography>
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
                  <Tooltip title="Change Engagement">
                    <Paper className="p0 br50" style={{ marginLeft: '1.5rem' }}>
                      <IconButton
                        size="small"
                        onClick={() => openDialog('choose-engagement')}>
                        <SwapHorizIcon />
                      </IconButton>
                    </Paper>
                  </Tooltip>
                </Box>
              </Box>
              <Divider style={{ margin: '8px 0' }} />
              <MenuItem onClick={openSettings} dense>
                <ListItemIcon>
                  <SettingsIcon />
                </ListItemIcon>
                <ListItemText>
                  <Typography>
                    Settings
                  </Typography>
                </ListItemText>
              </MenuItem>
              <MenuItem onClick={openGettingStartedDrawer} dense>
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

              <Box textAlign='center'>
                <ToggleButtonGroup
                  style={{ width: '90%' }}
                  size="small"
                  onChange={handleThemeChange}
                  exclusive
                  fullWidth
                  value={themeVal}>
                  <ToggleButton
                    value='light'
                    color="primary">
                    <LightModeIcon style={{ marginRight: '5px' }} fontSize="small" /> Light
                  </ToggleButton>
                  <ToggleButton
                    value='dark'
                    color="primary">
                    <DarkModeIcon style={{ marginRight: '5px' }} fontSize="small" /> Dark
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>

              <Divider style={{ margin: '8px 0' }} />

              <MenuItem onClick={() => logout(customLoginPageUrl)} dense>
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
      <Divider style={{ marginTop: '10px' }} />
    </Grid>
  );
};
