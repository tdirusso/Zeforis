/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Chip, Grid, Paper, Typography, IconButton, Tooltip, Button } from "@mui/material";
import './styles.css';
import FolderIcon from '@mui/icons-material/Folder';
import { useNavigate, useOutletContext } from "react-router-dom";
import { useState } from "react";
import Divider from '@mui/material/Divider';
import React from 'react';
import StarIcon from '@mui/icons-material/Star';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteFolderModal from "../../../components/admin/DeleteFolderModal";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import HelpIcon from '@mui/icons-material/Help';

export default function FoldersPage() {
  const [deleteFolderModalOpen, setDeleteFolderModalOpen] = useState(false);
  const [folderToEdit, setFolderToEdit] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  const {
    folders,
    isAdmin,
    openDrawer
  } = useOutletContext();

  const handleMenuClick = (e, folder) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
    setFolderToEdit(folder);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setFolderToEdit(null);
  };

  const keyFolders = [];
  const otherFolders = [];

  folders.forEach(folder => folder.is_key_folder ?
    keyFolders.push(folder) :
    otherFolders.push(folder)
  );

  const handleEditClick = () => {
    openDrawer('folder', { folderProp: folderToEdit });
    setAnchorEl(null);
  };

  const handleDeleteClick = () => {
    setDeleteFolderModalOpen(true);
    setAnchorEl(null);
  };

  return (
    <>
      <Grid item xs textAlign='center'>
        <Button
          style={{ marginBottom: '0.5rem' }}
          hidden={!isAdmin}
          onClick={() => openDrawer('folder')}
          variant="contained">
          New Folder
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Divider textAlign="center">
          <Chip
            color="primary"
            icon={<StarIcon style={{ color: '#fffd00' }} />}
            label="Key Folders"
          />
        </Divider>
      </Grid>

      <Grid item xs={12}>
        <Box className="flex-centered" gap={3} flexWrap='wrap'>
          {
            keyFolders.length === 0 ? <Grid item xs={12}>
              <Typography>No key folders.</Typography>
            </Grid> :
              keyFolders.map(folder =>
                <Folder
                  key={folder.id}
                  folder={folder}
                  handleMenuClick={handleMenuClick}
                />)
          }
        </Box>
      </Grid>

      <Grid item xs={12}>
        <Divider textAlign="center">
          <Chip label="Other Folders" color="primary"/>
        </Divider>
      </Grid>

      <Grid item xs={12}>
        <Box className="flex-centered" gap={3} flexWrap='wrap'>
          {
            otherFolders.length === 0 ? <Grid item xs={12}>
              <Typography>No other folders.</Typography>
            </Grid> :
              otherFolders.map(folder =>
                <Folder
                  key={folder.id}
                  folder={folder}
                  handleMenuClick={handleMenuClick}
                />)
          }
        </Box>
      </Grid>

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
                style={{ marginRight: '5px' }}
              />
              <Typography variant="body2" color="error">
                Delete Folder
              </Typography>
            </Box>

          </ListItemText>
        </MenuItem>
      </Menu>

      <DeleteFolderModal
        open={deleteFolderModalOpen}
        setOpen={setDeleteFolderModalOpen}
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
    <Box>
      <Paper
        className="folder-item"
        onClick={() => navigate(`/home/tasks?folderId=${folder.id}`)}
        style={{
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
    </Box>
  );
}