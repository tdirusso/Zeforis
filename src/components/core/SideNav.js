import { Box, Button, ButtonBase, Divider, Typography } from "@mui/material";
import './styles/SideNav.css';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import FolderIcon from '@mui/icons-material/Folder';
import SettingsIcon from '@mui/icons-material/Settings';
import { NavLink } from "react-router-dom";
import SpeedIcon from '@mui/icons-material/Speed';
import zeforisLogo from '../../assets/zeforis-logo.png';
import BarChartIcon from '@mui/icons-material/BarChart';
import BuildIcon from '@mui/icons-material/Build';

export default function SideNav(props) {

  const {
    engagement,
    org,
    isSideNavOpen,
    isAdmin
  } = props;

  const buttonBaseStyles = {
    width: '100%',
    height: '100%',
    px: 2,
    py: 1.5,
    borderRadius: '8px',
    justifyContent: 'flex-start'
  };

  const sideNavPosition = isSideNavOpen ? '0px' : '-281px';

  return (
    <Box
      className="Sidenav"
      sx={{ left: sideNavPosition }}
    >
      <Box className="flex-centered container">
        {
          org.logo ? <img
            src={org.logo}
            alt=""
            width={110}
          /> :
            <Typography color="primary" variant="h6" fontWeight={600}>
              {org.name}
            </Typography>
        }
        <Typography
          variant="body1"
          mt={1}>
          {engagement.name}
        </Typography>
        <Divider
          sx={{
            borderWidth: '1px',
            borderColor: '#eceef1',
            mt: 2,
            mb: 5,
            width: '200px'
          }}
        />
        <Box className="menu">
          <ul>
            <NavLink to="/home/dashboard">
              <li>
                <ButtonBase sx={buttonBaseStyles}>
                  <Typography
                    variant="body2"
                    display="flex"
                    alignItems="center">
                    <SpeedIcon />
                    Dashboard
                  </Typography>
                </ButtonBase>
              </li>

            </NavLink>
            <NavLink to="/home/tasks">
              <li>
                <ButtonBase sx={buttonBaseStyles}>
                  <Typography
                    variant="body2"
                    display="flex"
                    alignItems="center">
                    <TaskAltIcon />
                    Tasks
                  </Typography>
                </ButtonBase>
              </li>
            </NavLink>
            <NavLink to="/home/folders">
              <li>
                <ButtonBase sx={buttonBaseStyles}>
                  <Typography
                    variant="body2"
                    display="flex"
                    alignItems="center">
                    <FolderIcon />
                    Folders
                  </Typography>
                </ButtonBase>
              </li>
            </NavLink>
            <NavLink to="/home/analytics">
              <li>
                <ButtonBase sx={buttonBaseStyles}>
                  <Typography
                    variant="body2"
                    display="flex"
                    alignItems="center">
                    <BarChartIcon />
                    Analytics
                  </Typography>
                </ButtonBase>
              </li>
            </NavLink>
            {
              isAdmin ? <NavLink to="/home/tools">
                <li>
                  <ButtonBase sx={buttonBaseStyles}>
                    <Typography
                      variant="body2"
                      display="flex"
                      alignItems="center">
                      <BuildIcon />
                      Tools
                    </Typography>
                  </ButtonBase>
                </li>
              </NavLink> :
                null
            }
            <NavLink to="/home/settings">
              <li>
                <ButtonBase sx={buttonBaseStyles}>
                  <Typography
                    variant="body2"
                    display="flex"
                    alignItems="center">
                    <SettingsIcon />
                    Settings
                  </Typography>
                </ButtonBase>
              </li>
            </NavLink>
          </ul>
        </Box>
      </Box>
      <Box className="buttons">
        <Box
          sx={{
            color: '#5f5f5f !important',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 'small'
          }}
          component="a"
          href="https://www.zeforis.com"
          target="_blank">
          Powered by  <img src={zeforisLogo} alt="Zeforis" height={13} style={{ marginLeft: '4px' }} />
        </Box>
      </Box>
    </Box>
  );
};
