import { Box, Paper } from "@mui/material";
import './styles/dashboard.css';
import Fab from '@mui/material/Fab';
import FolderIcon from '@mui/icons-material/Folder';
import AddFolderModal from "../../components/admin/AddFolderModal";
import { useOutletContext } from "react-router-dom";
import { useState } from "react";

export default function Dashboard() {
  const [addFolderModalOpen, setAddFolderModalOpen] = useState(false);

  const { client } = useOutletContext();

  return (
    <Paper className="Dashboard" sx={{ p: 5 }}>
      <Box>
        <Fab
          variant="extended"
          sx={{ textTransform: 'none', boxShadow: 'none' }}
          color="primary"
          onClick={() => setAddFolderModalOpen(true)}>
          <FolderIcon sx={{ mr: 1 }} />
          New Folder
        </Fab>
      </Box>


      <AddFolderModal
        open={addFolderModalOpen}
        setOpen={setAddFolderModalOpen}
        clientId={client._id}
      />

    </Paper>
  );
};
