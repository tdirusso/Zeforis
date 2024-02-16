import { Box, ButtonBase, Divider, IconButton, Typography, useMediaQuery } from "@mui/material";
import './styles/SideNav.scss';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import FolderIcon from '@mui/icons-material/Folder';
import SettingsIcon from '@mui/icons-material/Settings';
import { NavLink } from "react-router-dom";
import BarChartIcon from '@mui/icons-material/BarChart';
import BuildIcon from '@mui/icons-material/Build';
import Watermark from "./Watermark";
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import { Engagement } from "@shared/types/Engagement";
import { Org } from "@shared/types/Org";

type SideNavProps = {
  engagement: Engagement,
  org: Org,
  isSideNavOpen: boolean,
  isAdmin: boolean,
  toggleSideNav: () => void;
};


export default function SideNav(props: SideNavProps) {

  const isSmallScreen = useMediaQuery('(max-width: 900px)');

  const {
    engagement,
    org,
    isSideNavOpen,
    isAdmin,
    toggleSideNav
  } = props;

  const handleNavClick = () => {
    if (isSmallScreen) {
      toggleSideNav();
    }
  };

  return (
    <Box
      className={`Sidenav ${isSideNavOpen ? 'open' : 'closed'}`}>
      <IconButton
        className="close-btn"
        size="large"
        onClick={toggleSideNav}>
        <MenuOpenIcon
          style={{
            transform: isSideNavOpen ? 'rotate(0deg)' : 'rotate(180deg)',
            transition: 'transform 200ms'
          }}
        />
      </IconButton>
      <Box className="flex-centered container">
        {
          org.logo ? <img
            src={org.logo}
            alt=""
            width={110}
          /> :
            <Typography color="primary" variant="h6" fontWeight={600} textAlign='center'>
              {org.name}
            </Typography>
        }
        <Typography
          className="engagement-header"
          variant="body1"
          mt={1}>
          {engagement.name}
        </Typography>
        <Divider className="divider" />
        <Box className="menu">
          <ul>
            <NavLink draggable={false} to="/home/dashboard" onClick={handleNavClick}>
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
            <NavLink to="/home/tasks" draggable={false} onClick={handleNavClick}>
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
            <NavLink to="/home/folders" draggable={false} onClick={handleNavClick}>
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
            <NavLink to="/home/analytics" draggable={false} onClick={handleNavClick}>
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
              isAdmin ? <NavLink to="/home/tools" draggable={false} onClick={handleNavClick}>
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
            <NavLink to="/home/settings" draggable={false} onClick={handleNavClick}>
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
