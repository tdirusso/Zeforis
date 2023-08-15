import { Box, ButtonBase, Divider, Typography } from "@mui/material";
import './styles/SideNav.scss';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import FolderIcon from '@mui/icons-material/Folder';
import SettingsIcon from '@mui/icons-material/Settings';
import { NavLink } from "react-router-dom";
import BarChartIcon from '@mui/icons-material/BarChart';
import BuildIcon from '@mui/icons-material/Build';
import Watermark from "./Watermark";
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';

export default function SideNav(props) {

  const {
    engagement,
    org,
    isSideNavOpen,
    isAdmin
  } = props;

  const sideNavPosition = isSideNavOpen ? '0px' : '-281px';

  return (
    <Box
      className="Sidenav"
      style={{ left: sideNavPosition }}>
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
        <Divider className="divider" />
        <Box className="menu">
          <ul>
            <NavLink draggable={false} to="/home/dashboard">
              <li>
                <ButtonBase className='nav-button'>
                  <Typography
                    variant="body2"
                    display="flex"
                    alignItems="center">
                    <GridViewRoundedIcon />
                    Dashboard
                  </Typography>
                </ButtonBase>
              </li>

            </NavLink>
            <NavLink to="/home/tasks" draggable={false}>
              <li>
                <ButtonBase className='nav-button'>
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
            <NavLink to="/home/folders" draggable={false}>
              <li>
                <ButtonBase className='nav-button'>
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
            <NavLink to="/home/analytics" draggable={false}>
              <li>
                <ButtonBase className='nav-button'>
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
              isAdmin ? <NavLink to="/home/tools" draggable={false}>
                <li>
                  <ButtonBase className='nav-button'>
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
            <NavLink to="/home/settings" draggable={false}>
              <li>
                <ButtonBase className='nav-button'>
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
        <Watermark />
      </Box>
    </Box>
  );
};
