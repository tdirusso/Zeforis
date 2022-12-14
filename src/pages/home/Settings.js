import { Box, Button, Divider, Typography } from "@mui/material";
import { useOutletContext } from "react-router-dom";
import ClientMenu from "../../components/admin/ClientMenu";
import EditIcon from '@mui/icons-material/Edit';
import './styles/settings.css';
import React, { useEffect, useState } from "react";
import AddClientModal from "../../components/admin/AddClientModal";
import DeleteIcon from '@mui/icons-material/Delete';
import EditClientModal from "../../components/admin/EditClientModal";
import { getSettingsData, setActiveClientId } from "../../api/client";
import useSnackbar from "../../hooks/useSnackbar";
import Snackbar from "../../components/core/Snackbar";
import Loader from "../../components/core/Loader";
import { logout } from "../../api/auth";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import InviteClientMemberModal from "../../components/admin/InviteClientMemberModal";

export default function Settings() {
  const [createClientModalOpen, setCreateClientModalOpen] = useState(false);
  const [editClientModalOpen, setEditClientModalOpen] = useState(false);
  const [inviteClientMemberModalOpen, setInviteClientModalOpen] = useState(false);

  const { client, clients, account } = useOutletContext();
  const [clientMembers, setClientMembers] = useState([]);
  const [clientAdmins, setClientAdmins] = useState([]);
  const [accountMembers, setAccountMembers] = useState([]);

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

      if (settings) {
        setClientMembers(settings.client.members);
        setClientAdmins(settings.client.admins);
        setAccountMembers(settings.account.members);
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

      <Box sx={{ mt: 4.5, maxWidth: 500 }}>
        <Typography variant="body1" gutterBottom>
          <strong>Members</strong>
          <Button
            variant="outlined"
            size="small"
            sx={{ ml: 1.5 }}
            onClick={() => setInviteClientModalOpen(true)}
            startIcon={<PersonAddIcon />}>
            Invite someone from {client.name}
          </Button>
        </Typography>
        <List dense>
          {
            clientMembers.map((member, index) => {
              return (
                <React.Fragment key={member._id}>
                  <ListItem
                    secondaryAction={
                      <IconButton edge="end" aria-label="delete">
                        <ClearIcon />
                      </IconButton>
                    }>
                    <ListItemText
                      primary={`${member.firstName} ${member.lastName}`}
                      secondary={member.email}
                    />
                  </ListItem>
                  {index !== clientMembers.length - 1 ? <Divider /> : null}
                </React.Fragment>
              );
            })
          }
        </List>
      </Box>

      <Box sx={{ mt: 4.5, maxWidth: 500 }}>
        <Typography variant="body1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <strong>
            Administrators
          </strong>
          <Button
            variant="outlined"
            size="small"
            sx={{ ml: 1.5 }}
          >
            Manage Access
          </Button>
        </Typography>
        <List dense>
          {
            clientAdmins.map((member, index) => {
              return (
                <React.Fragment key={member._id}>
                  <ListItem
                    secondaryAction={
                      <IconButton edge="end" aria-label="delete">
                        <ClearIcon />
                      </IconButton>
                    }>
                    <ListItemText
                      primary={`${member.firstName} ${member.lastName}`}
                      secondary={member.email}
                    />
                  </ListItem>
                  {index !== clientAdmins.length - 1 ? <Divider /> : null}
                </React.Fragment>
              );
            })
          }
        </List>
      </Box>
      <Divider sx={{ mt: 4, mb: 4 }} />
      <Typography variant="h6" gutterBottom>{account.name} Users</Typography>
      <List dense sx={{ maxWidth: 500 }}>
        {
          accountMembers.map((member, index) => {
            return (
              <React.Fragment key={member._id}>
                <ListItem
                  secondaryAction={
                    <IconButton edge="end" aria-label="delete">
                      <EditIcon fontSize="small" />
                    </IconButton>
                  }>
                  <ListItemText
                    primary={`${member.firstName} ${member.lastName}`}
                    secondary={member.email}
                  />
                </ListItem>
                {index !== accountMembers.length - 1 ? <Divider /> : null}
              </React.Fragment>
            );
          })
        }
      </List>

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

      <InviteClientMemberModal
        open={inviteClientMemberModalOpen}
        setOpen={setInviteClientModalOpen}
        clientId={client._id}
        clientName={client.name}
        accountId={account._id}
      />

      <Snackbar
        isOpen={isOpen}
        type={type}
        message={message}
      />
    </div>
  );
};
