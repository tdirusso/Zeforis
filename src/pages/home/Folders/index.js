import { Box, Chip, Grid, Paper, Typography, IconButton } from "@mui/material";
import './styles.css';
import FolderIcon from '@mui/icons-material/Folder';
import AddFolderModal from "../../../components/admin/AddFolderModal";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useState } from "react";
import Divider from '@mui/material/Divider';
import React from 'react';
import Header from "../../../components/core/Header";
import StarIcon from '@mui/icons-material/Star';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditFolderModal from "../../../components/admin/EditFolderModal";

export default function FoldersPage() {
  const [addFolderModalOpen, setAddFolderModalOpen] = useState(false);
  const [editFolderModalOpen, setEditFolderModalOpen] = useState(false);
  const [folderToEdit, setFolderToEdit] = useState(null);

  const {
    client,
    folders,
    setFolders
  } = useOutletContext();

  const keyFolders = [];
  const otherFolders = [];

  folders.forEach(folder => folder.is_key_folder ?
    keyFolders.push(folder) :
    otherFolders.push(folder)
  );

  const handleEditClick = (e, folder) => {
    e.stopPropagation();
    setFolderToEdit(folder);
    setEditFolderModalOpen(true);
  };

  return (
    <>
      <Header />
      <Grid item>
        <Paper
          className="folder-item"
          onClick={() => setAddFolderModalOpen(true)}
          sx={{
            height: '100%',
            position: 'relative',
            minWidth: 180
          }}>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center">
            <FolderIcon
              fontSize="large"
              color="primary"
            />
            <Box
              component="h6"
              mt={1}
              color="var(--colors-primary)">
              Add Folder +
            </Box>
          </Box>
        </Paper>
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
            handleEditClick={handleEditClick}
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
            handleEditClick={handleEditClick}
          />)
      }

      <AddFolderModal
        open={addFolderModalOpen}
        setOpen={setAddFolderModalOpen}
        clientId={client.id}
        setFolders={setFolders}
      />

      <EditFolderModal
        open={editFolderModalOpen}
        setOpen={setEditFolderModalOpen}
        folder={folderToEdit}
      />
    </>
  );
};


function Folder({ folder, handleEditClick }) {
  const navigate = useNavigate();

  return (
    <Grid item>
      <Paper
        className="folder-item"
        onClick={() => navigate(`/home/tasks?folderId=${folder.id}`)}
        sx={{
          height: '100%',
          position: 'relative',
          minWidth: 180
        }}>
        <IconButton
          size="small"
          className="edit-folder-button"
          onClick={(e) => handleEditClick(e, folder)}>
          <MoreVertIcon fontSize="small" />
        </IconButton>
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
              {folder.name}
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