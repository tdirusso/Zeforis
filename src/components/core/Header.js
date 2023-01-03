import { Grid, IconButton, Paper, Box } from "@mui/material";
import './styles/Header.css';
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

export default function Header() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [addTaskModalOpen, setAddTaskModalOpen] = useState(false);
  const [addFolderModalOpen, setAddFolderModalOpen] = useState(false);

  const open = Boolean(anchorEl);

  const handleMenuClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const openAddTask = () => {
    setAnchorEl(null);
    setAddTaskModalOpen(true);
  };

  return (
    <Grid item xs={12} component="header">
      <Paper
        sx={{ width: '100%' }}
        className="Header">
        <Box>
          <IconButton size="large">
            <SearchIcon color="primary" size="large" />
          </IconButton>
        </Box>
        <Box>
          <IconButton onClick={handleMenuClick}>
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            PaperProps={{
              style: {
                width: '20ch',
              }
            }}>
            <MenuItem onClick={openAddTask}>
              <ListItemIcon>
                <AddTaskIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>New Task</ListItemText>
            </MenuItem>
            <MenuItem>
              <ListItemIcon>
                <FolderIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>New Folder</ListItemText>
            </MenuItem>
          </Menu>
        </Box>
      </Paper>

      <AddTaskModal
        open={addTaskModalOpen}
        setOpen={setAddTaskModalOpen}
      />

      <AddFolderModal
        open={addFolderModalOpen}
        setOpen={setAddFolderModalOpen}
      />
    </Grid>
  );
};
