import { Box, Button, Divider, Typography } from "@mui/material";
import { useOutletContext } from "react-router-dom";
import ClientMenu from "../../components/admin/ClientMenu";
import EditIcon from '@mui/icons-material/Edit';
import './styles/settings.css';
import { useEffect, useState } from "react";
import AddClientModal from "../../components/admin/AddClientModal";
import DeleteIcon from '@mui/icons-material/Delete';
import EditClientModal from "../../components/admin/EditClientModal";
import { getSettingsData, setActiveClientId } from "../../api/client";
import useSnackbar from "../../hooks/useSnackbar";
import Snackbar from "../../components/core/Snackbar";
import Loader from "../../components/core/Loader";
import { logout } from "../../api/auth";

export default function Settings() {
  const [createClientModalOpen, setCreateClientModalOpen] = useState(false);
  const [editClientModalOpen, setEditClientModalOpen] = useState(false);
  const { client, clients, account } = useOutletContext();
  const [settingsData, setSettingsData] = useState(null);
  const [isLoading, setLoading] = useState(true);

  const {
    isOpen,
    openSnackBar,
    type,
    message
  } = useSnackbar();

  useEffect(() => {
    async function fetchSettingsData() {
      const { settings, message } = await getSettingsData(account._id, client._id);

      //console.log(settings);
      if (settings) {
        setSettingsData(settings);
        setLoading(false);
      } else {
        openSnackBar(message, 'error');
      }
    }

    fetchSettingsData();
  }, []);

  const changeClient = (clientObject) => {
    setActiveClientId(clientObject._id);
    openSnackBar(`Loading ${clientObject.name}...`, 'info');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="Settings">
      <Typography variant="h5" gutterBottom>Settings</Typography>
      <Divider sx={{ mb: 3 }} />
      <Typography variant="h6" gutterBottom>Clients</Typography>
      <Box sx={{ width: '300px', mt: 3 }}>
        <ClientMenu
          client={client}
          clients={clients}
          parentHandler={changeClient}
        />
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
      <Typography variant="h6" gutterBottom>{account.name} Users</Typography>
      <Divider sx={{ mt: 4, mb: 4 }} />
      <Typography variant="h6" gutterBottom>Account</Typography>
      <Button
        variant="contained"
        onClick={logout}>
        Sign Out
      </Button>

      <AddClientModal
        open={createClientModalOpen}
        setOpen={setCreateClientModalOpen}
        accountId={account._id}
      />

      <EditClientModal
        open={editClientModalOpen}
        setOpen={setEditClientModalOpen}
        clientToUpdate={client}
      />

      <Snackbar
        isOpen={isOpen}
        type={type}
        message={message}
      />
    </div>
  );
};
