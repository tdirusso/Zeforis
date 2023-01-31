import { Box, Button, ButtonBase, Divider, Typography } from "@mui/material";
import './styles/SideNav.css';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import FolderIcon from '@mui/icons-material/Folder';
import SettingsIcon from '@mui/icons-material/Settings';
import { NavLink } from "react-router-dom";
//import InsightsIcon from '@mui/icons-material/Insights';
import SpeedIcon from '@mui/icons-material/Speed';

export default function SideNav({ client, account, isAdmin }) {

  const buttonBaseStyles = {
    width: '100%',
    height: '100%',
    px: 2,
    py: 1.5,
    borderRadius: '8px',
    justifyContent: 'flex-start'
  };

  //console.log(client)

  return (
    <Box className="Sidenav">
      <Box className="flex-centered container">
        <img
          src={client.logo}
          alt=""
          width={60}
        />
        <Typography
          variant="body1"
          mt={1}>
          {client.name}
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
                    <TaskAltIcon />Tasks
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
        <Button
          variant="contained"
          fullWidth
          sx={{ mb: 2 }}>
          Upgrade Plan
        </Button>
        <Button
          variant="outlined"
          fullWidth>
          Contact Support
        </Button>
      </Box>
    </Box>
  );
};
