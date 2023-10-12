/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Chip, Grid, Paper, Typography, IconButton, Tooltip, Button } from "@mui/material";
import './styles.scss';
import { Link, useOutletContext } from "react-router-dom";
import { useState } from "react";
import Divider from '@mui/material/Divider';
import React from 'react';
import StarIcon from '@mui/icons-material/Star';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';


export default function FoldersPage() {
  const [folderToEdit, setFolderToEdit] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  const {
    folders,
    isAdmin,
    openDrawer,
    openModal
  } = useOutletContext();

  const handleMenuClick = (e, folder) => {
    e.preventDefault();
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
    openModal('delete-folder', { folder: folderToEdit });
    setAnchorEl(null);
  };

  return (
    <>
      <Grid item xs>
        <Button
          style={{ marginBottom: '0.5rem' }}
          hidden={!isAdmin}
          onClick={() => openDrawer('folder')}
          variant="contained">
          New Folder
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Divider textAlign="left">
          <Chip
            icon={<StarIcon style={{ color: '#fffd00' }} />}
            label="Key Folders"
          />
        </Divider>
      </Grid>

      <Grid item xs={12}>
        <Box display='flex' alignItems='start' gap={2} flexWrap='wrap'>
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
        <Divider textAlign="left">
          <Chip label="Other Folders" />
        </Divider>
      </Grid>

      <Grid item xs={12}>
        <Box display='flex' alignItems='start' gap={2} flexWrap='wrap'>
          {
            otherFolders.length === 0 ? <Grid item xs={12}>
              <Typography variant="body2">No other folders.</Typography>
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
              Edit folder
            </Typography>
          </ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDeleteClick}>
          <ListItemText>
            <Typography variant="body2" color="error">
              Delete folder
            </Typography>
          </ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};


function Folder({ folder, handleMenuClick }) {
  const { isAdmin } = useOutletContext();

  let folderName = folder.name;

  if (folderName.length > 23) {
    folderName = folderName.substring(0, 23) + '...';
  }

  return (
    <Link
      to={`/home/tasks?folderId=${folder.id}`}
      className="folder-container">
      <Paper
        className="folder-item folder-small">
        {
          isAdmin ?
            <Tooltip title="Edit">
              <IconButton
                size="small"
                className="edit-folder-button"
                onClick={(e) => handleMenuClick(e, folder)}>
                <EditOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip> : null
        }
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          textAlign="center"
          justifyContent="center">

        </Box>
      </Paper>
      <Box mt={1} maxWidth={80} style={{ overflowWrap: 'break-word' }}>
        <Typography variant="body2">
          {folderName}
        </Typography>
      </Box>
    </Link>
  );
}