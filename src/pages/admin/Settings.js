import { Box, Button, Divider, Typography } from "@mui/material";
import { useOutletContext } from "react-router-dom";
import ClientMenu from "../../components/admin/ClientMenu";
import EditIcon from '@mui/icons-material/Edit';
import './styles/settings.css';
import { useState } from "react";
import AddClientModal from "../../components/admin/AddClientModal";
import DeleteIcon from '@mui/icons-material/Delete';
import EditClientModal from "../../components/admin/EditClientModal";

export default function Settings() {
  const [createClientModalOpen, setCreateClientModalOpen] = useState(false);
  const [editClientModalOpen, setEditClientModalOpen] = useState(false);
  const { client, changeClient } = useOutletContext();

  return (
    <div className="Settings">
      <Typography variant="h5" gutterBottom>Settings</Typography>
      <Divider sx={{ mb: 3 }} />
      <Typography variant="h6" gutterBottom>Clients</Typography>
      <Box sx={{ width: '225px', mt: 3 }}>
        <ClientMenu client={client} parentHandler={changeClient} />
        <Button
          variant="outlined"
          sx={{ mt: 2, mr: 2 }}
          startIcon={<EditIcon />}
          onClick={() => setEditClientModalOpen(true)}>
          Edit
        </Button>
        <Button
          variant="outlined"
          sx={{ mt: 2 }}
          color="error"
          startIcon={<DeleteIcon />}>
          Delete
        </Button>
      </Box>
      <Box sx={{ mt: 2 }}>
        <Button
          variant="contained"
          onClick={() => setCreateClientModalOpen(true)}
          sx={{ mt: 2 }}>
          Create New Client
        </Button>
      </Box>
      <Divider sx={{ mt: 4, mb: 4 }} />

      <AddClientModal
        open={createClientModalOpen}
        setOpen={setCreateClientModalOpen} />

      <EditClientModal
        open={editClientModalOpen}
        setOpen={setEditClientModalOpen}
        clientToUpdate={client}
      />
    </div>
  )
};
