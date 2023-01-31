import { Grid, IconButton, Paper, Box, Typography, Button, Tooltip } from "@mui/material";
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
import SearchModal from "./SearchModal";
import { useOutletContext } from "react-router-dom";

export default function Header() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [addTaskModalOpen, setAddTaskModalOpen] = useState(false);
  const [addFolderModalOpen, setAddFolderModalOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  const {
    isAdmin
  } = useOutletContext();

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

  const openAddFolder = () => {
    setAnchorEl(null);
    setAddFolderModalOpen(true);
  };

  return (
    <Grid
      item
      xs={12}
      component="header">
      <Paper
        sx={{
          height: 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%'
        }}>
        <Box>
          <Button
            startIcon={<SearchIcon />}
            onClick={() => setSearchModalOpen(true)}
            variant="outlined">
            Search
          </Button>
        </Box>
        <Box hidden={!isAdmin}>
          <Tooltip title="Actions">
            <IconButton onClick={handleMenuClick}>
              <MoreVertIcon />
            </IconButton>
          </Tooltip>
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
              <ListItemText>
                <Typography variant="body2">
                  New Task
                </Typography>
              </ListItemText>
            </MenuItem>
            <MenuItem onClick={openAddFolder}>
              <ListItemIcon>
                <FolderIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>
                <Typography variant="body2">
                  New Folder
                </Typography>
              </ListItemText>
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

      <SearchModal
        open={searchModalOpen}
        setOpen={setSearchModalOpen}
      />
    </Grid>
  );
};
