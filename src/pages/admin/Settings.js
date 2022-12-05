import { Box, Button, Divider, Typography } from "@mui/material";
import { useOutletContext } from "react-router-dom";
import ClientMenu from "../../components/admin/ClientMenu";
import EditIcon from '@mui/icons-material/Edit';
import './styles/settings.css';
import { useState } from "react";
import AddClientModal from "../../components/admin/AddClientModal";

export default function Settings() {
  const [createClientModalOpen, setCreateClientModalOpen] = useState(false);
  const { client, changeClient } = useOutletContext();

  return (
    <div className="Settings">
      <Typography variant="h5" gutterBottom>Settings</Typography>
      <Divider sx={{ mb: 3 }} />
      <Typography variant="h6" gutterBottom>Clients</Typography>
      <Typography variant="body1" mr={1}>Current client &ndash; <strong>{client.name}</strong></Typography>

      <div className="flex current-client">
        <Typography variant="body1" gutterBottom>Change client</Typography>
        <div style={{ width: '225px', marginLeft: '20px' }}>
          <ClientMenu client={client} parentHandler={changeClient} />
        </div>
      </div>
      <Box sx={{ mt: 3 }}>
        <Button variant="outlined" sx={{ mt: 2 }} startIcon={<EditIcon />}>Edit {client.name}</Button>
        <br></br>
        <Button
          variant="contained"
          onClick={() => setCreateClientModalOpen(true)}
          sx={{ mt: 2 }}>
          Create New Client
        </Button>
      </Box>

      <AddClientModal
        open={createClientModalOpen}
        setOpen={setCreateClientModalOpen} />
    </div>
  )
};
