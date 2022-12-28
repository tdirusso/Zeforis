import { Box, Paper } from "@mui/material";
import './styles.css';
import Fab from '@mui/material/Fab';
import { useOutletContext } from "react-router-dom";
import { useState } from "react";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import React from 'react';
import AddTaskModal from "../../../components/admin/AddTaskModal";

export default function TasksPage() {
  const [addFolderModalOpen, setAddFolderModalOpen] = useState(false);

  const { client, folders, clientUsers } = useOutletContext();

  return (
    <Paper className="Folders" sx={{ p: 5 }}>
      <Box>
        <Fab
          variant="extended"
          disableRipple
          sx={{ textTransform: 'none', boxShadow: 'none' }}
          color="primary"
          onClick={() => setAddFolderModalOpen(true)}>
          New Task
        </Fab>
      </Box>

      <AddTaskModal
        open={addFolderModalOpen}
        setOpen={setAddFolderModalOpen}
        clientId={client.id}
        folders={folders}
        clientUsers={clientUsers}
      />

    </Paper>
  );
};
