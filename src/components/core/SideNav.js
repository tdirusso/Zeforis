import { Box, Button, Divider, Typography } from "@mui/material";
import './core.css';
import appleLogo from '../../assets/apple-logo.svg';
import GridViewIcon from '@mui/icons-material/GridView';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import FolderIcon from '@mui/icons-material/Folder';
import SettingsIcon from '@mui/icons-material/Settings';

export default function SideNav() {
  return (
    <Box className="Sidenav">
      <div className="flex-centered container">
        <img src={appleLogo} alt="" width={55} />
        <Typography variant="body1" mt={1}>Apple</Typography>
        <Typography variant="body1" mt={2} color="primary">
          <strong>Your Digital Dashboard</strong>
        </Typography>
        <Divider
          sx={{
            borderWidth: '1px',
            borderColor: '#eceef1',
            mt: 5,
            mb: 5,
            width: '200px'
          }}
        />

        <div className="menu">
          <ul>
            <li><GridViewIcon />Dashboard</li>
            <li><TaskAltIcon />Tasks</li>
            <li><FolderIcon />Folders</li>
            <li><SettingsIcon /> Settings</li>
          </ul>
        </div>
      </div>
      <div className="buttons">
        <Button variant="contained" fullWidth sx={{mb: 2}}>Upgrade Plan</Button>
        <Button variant="outlined" fullWidth>Contact Support</Button>
      </div>
    </Box>
  );
};
