import { Box, Paper } from "@mui/material";
import './styles.css';
import Fab from '@mui/material/Fab';
import FolderIcon from '@mui/icons-material/Folder';
import AddFolderModal from "../../../components/admin/AddFolderModal";
import { useOutletContext } from "react-router-dom";
import { useState } from "react";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import React from 'react';

export default function FoldersPage() {
  const [addFolderModalOpen, setAddFolderModalOpen] = useState(false);

  const {
    client,
    folders,
    setFolders
  } = useOutletContext();

  return (
    <Paper className="Folders" sx={{ p: 5 }}>
      <Box>
        <Fab
          variant="extended"
          disableRipple
          sx={{ textTransform: 'none', boxShadow: 'none' }}
          color="primary"
          onClick={() => setAddFolderModalOpen(true)}>
          <FolderIcon sx={{ mr: 1 }} />
          New Folder
        </Fab>
      </Box>

      <Box>
        <List dense>
          {
            folders.map((folder, index) => {
              return (
                <React.Fragment key={folder.id}>
                  <ListItem>
                    <ListItemIcon>
                      <FolderIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={`${folder.name}`}
                    />
                  </ListItem>
                  {index !== folders.length - 1 ? <Divider /> : null}
                </React.Fragment>
              );
            })
          }
        </List>
      </Box>


      <AddFolderModal
        open={addFolderModalOpen}
        setOpen={setAddFolderModalOpen}
        clientId={client.id}
        setFolders={setFolders}
      />

    </Paper>
  );
};
