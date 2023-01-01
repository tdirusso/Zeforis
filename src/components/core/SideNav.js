import { Box, Button, Divider, Typography } from "@mui/material";
import './styles/SideNav.css';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import FolderIcon from '@mui/icons-material/Folder';
import SettingsIcon from '@mui/icons-material/Settings';
import { NavLink } from "react-router-dom";
import InsightsIcon from '@mui/icons-material/Insights';
import SpeedIcon from '@mui/icons-material/Speed';

export default function SideNav({ client }) {
  return (
    <Box className="Sidenav">
      <Box className="flex-centered container">
        <img
          //src={client.logoUrl} 
          alt=""
          width={45} />
        <Typography variant="body1" mt={1}>{client.name}</Typography>
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
                <Typography
                  variant="body2"
                  display="flex"
                  alignItems="center">
                  <SpeedIcon />
                  Dashboard
                </Typography>
              </li>
            </NavLink>
            <NavLink to="/home/tasks">
              <li>
                <Typography
                  variant="body2"
                  display="flex"
                  alignItems="center">
                  <TaskAltIcon />Tasks
                </Typography>
              </li>
            </NavLink>
            <NavLink to="/home/folders">
              <li>
                <Typography
                  variant="body2"
                  display="flex"
                  alignItems="center">
                  <FolderIcon />
                  Folders
                </Typography>
              </li>
            </NavLink>
            <NavLink to="/home/analytics">
              <li>
                <Typography
                  variant="body2"
                  display="flex"
                  alignItems="center">
                  <InsightsIcon />
                  Analytics
                </Typography>
              </li>
            </NavLink>
            <NavLink to="/home/settings">
              <li>
                <Typography
                  variant="body2"
                  display="flex"
                  alignItems="center">
                  <SettingsIcon />
                  Settings
                </Typography>
              </li>
            </NavLink>
          </ul>
        </Box>
      </Box>
      <Box className="buttons">
        <Button variant="contained" fullWidth sx={{ mb: 2 }}>Upgrade Plan</Button>
        <Button variant="outlined" fullWidth>Contact Support</Button>
      </Box>
    </Box>
  );
};
