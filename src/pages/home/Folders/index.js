import { Box, Chip, Grid, Paper, Typography, IconButton, Tooltip, Button } from "@mui/material";
import './styles.css';
import FolderIcon from '@mui/icons-material/Folder';
import AddFolderModal from "../../../components/admin/AddFolderModal";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useState } from "react";
import Divider from '@mui/material/Divider';
import React from 'react';
import StarIcon from '@mui/icons-material/Star';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditFolderModal from "../../../components/admin/EditFolderModal";
import RemoveFolderModal from "../../../components/admin/RemoveFolderModal";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

export default function FoldersPage() {
  const [addFolderModalOpen, setAddFolderModalOpen] = useState(false);
  const [editFolderModalOpen, setEditFolderModalOpen] = useState(false);
  const [removeFolderModalOpen, setRemoveFolderModalOpen] = useState(false);
  const [folderToEdit, setFolderToEdit] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  const handleMenuClick = (e, folder) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
    setFolderToEdit(folder);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setFolderToEdit(null);
  };

  const {
    client,
    folders,
    isAdmin,
    openDrawer
  } = useOutletContext();

  const keyFolders = [];
  const otherFolders = [];

  folders.forEach(folder => folder.is_key_folder ?
    keyFolders.push(folder) :
    otherFolders.push(folder)
  );

  const handleEditClick = () => {
    setEditFolderModalOpen(true);
    setAnchorEl(null);
  };

  const handleDeleteClick = () => {
    setRemoveFolderModalOpen(true);
    setAnchorEl(null);
  };

  return (
    <>
      <Grid item>
        <Button
          onClick={() => openDrawer('create-folder')}
          size="large"
          variant="contained">
          New Folder
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Divider textAlign="left">
          <Chip label="Key Folders" />
        </Divider>
      </Grid>
      {
        keyFolders.map(folder =>
          <Folder
            key={folder.id}
            folder={folder}
            handleMenuClick={handleMenuClick}
          />)
      }
      <Grid item xs={12}>
        <Divider textAlign="left">
          <Chip label="Other Folders" />
        </Divider>
      </Grid>
      {
        otherFolders.map(folder =>
          <Folder
            key={folder.id}
            folder={folder}
            handleMenuClick={handleMenuClick}
          />)
      }

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        PaperProps={{
          style: {
            width: '20ch',
          }
        }}>
        <MenuItem onClick={handleEditClick}>
          <ListItemText>
            <Typography variant="body2">
              Edit Folder
            </Typography>
          </ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDeleteClick}>
          <ListItemText>
            <Box display="flex" alignItems="center" ml="-5px">
              <DeleteOutlineIcon
                fontSize="small"
                color="error"
                sx={{ mr: 0.5 }}
              />
              <Typography variant="body2" color="error">
                Delete Folder
              </Typography>
            </Box>

          </ListItemText>
        </MenuItem>
      </Menu>

      <AddFolderModal
        open={addFolderModalOpen}
        setOpen={setAddFolderModalOpen}
        clientId={client.id}
      />

      <EditFolderModal
        open={editFolderModalOpen}
        setOpen={setEditFolderModalOpen}
        folder={folderToEdit}
      />

      <RemoveFolderModal
        open={removeFolderModalOpen}
        setOpen={setRemoveFolderModalOpen}
        folder={folderToEdit}
      />
    </>
  );
};


function Folder({ folder, handleMenuClick }) {
  const navigate = useNavigate();
  const { isAdmin } = useOutletContext();

  let folderName = folder.name;

  if (folderName.length > 30) {
    folderName = folderName.substring(0, 30) + '...';
  }

  return (
    <Grid item>
      <Paper
        className="folder-item"
        onClick={() => navigate(`/home/tasks?folderId=${folder.id}`)}
        sx={{
          height: '100%',
          position: 'relative',
          width: 180
        }}>
        {
          isAdmin ?
            <Tooltip title="More Options">
              <IconButton
                size="small"
                className="edit-folder-button"
                onClick={(e) => handleMenuClick(e, folder)}>
                <MoreVertIcon fontSize="small" />
              </IconButton>
            </Tooltip> : null
        }
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          textAlign="center"
          justifyContent="center">
          <FolderIcon
            htmlColor="#8ca3ba"
            fontSize="large"
          />
          <Box component="h6" mt={1}>
            <Box display="flex" alignItems="center">
              {folder.is_key_folder ? <StarIcon
                fontSize="small"
                htmlColor="gold"
              /> : ''}
              {folderName}
            </Box>
          </Box>
          <Typography
            variant="caption">
            {folder.tasks.length} tasks
          </Typography>
        </Box>
      </Paper>
    </Grid>
  );
}