/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Button, Chip, Divider, Paper, Typography } from "@mui/material";
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
import RemoveClientMemberModal from "../../components/admin/RemoveClientMemberModal";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import AccountMenu from "../../components/core/AccountMenu";
import { setActiveAccountId } from "../../api/account";
import EditProfileModal from "../../components/core/EditProfileModal";

export default function Settings() {
  const [createClientModalOpen, setCreateClientModalOpen] = useState(false);
  const [editClientModalOpen, setEditClientModalOpen] = useState(false);
  const [inviteClientMemberModalOpen, setInviteClientModalOpen] = useState(false);
  const [removeClientMemberModalOpen, setRemoveClientModalOpen] = useState(false);
  const [editProfileModalOpen, setEditProfileModalOpen] = useState(false);

  const [userToModify, setUserToModify] = useState(null);

  const { client, clients, account, user } = useOutletContext();

  const [clientMembers, setClientMembers] = useState([]);
  const [clientAdmins, setClientAdmins] = useState([]);
  const [accountMembers, setAccountMembers] = useState([]);
  const [accountAdmins, setAccountAdmins] = useState([]);

  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);

  const [isLoading, setLoading] = useState(true);

  const [accountTabVal, setAccountTabVal] = useState(0);

  const {
    isOpen,
    openSnackBar,
    type,
    message
  } = useSnackbar();

  const accountUsersLength = accountMembers.length + accountAdmins.length;

  useEffect(() => {
    async function fetchSettingsData() {
      const { settings, message } = await getSettingsData(account._id, client._id);

      if (settings) {
        setClientMembers(settings.client.members);
        setClientAdmins(settings.client.admins);
        setAccountMembers(settings.account.members);
        setAccountAdmins(settings.account.admins);
        setLoading(false);
      } else {
        openSnackBar(message, 'error');
      }
    }

    fetchSettingsData();
  }, []);

  const handleChangeClient = (clientObject) => {
    setActiveClientId(clientObject._id);
    openSnackBar(`Loading ${clientObject.name}...`, 'info');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handleRemoveClientMember = (userObject) => {
    setUserToModify(userObject);
    setRemoveClientModalOpen(true);
  };

  if (isLoading) {
    return <Loader />;
  };

  const handleAccountSelection = accountId => {
    const selectedAccountObject = user.memberOfAccounts.find(account => account._id === accountId);
    setActiveAccountId(selectedAccountObject._id);
    openSnackBar(`Loading ${selectedAccountObject.name}...`, 'info');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };


  function TabPanel(props) {
    const { children, value, index } = props;

    return (
      <div
        hidden={value !== index}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            {children}
          </Box>
        )}
      </div>
    );
  }

  return (
    <Paper sx={{ p: 5 }}>
      <Typography variant="h5" gutterBottom>Settings</Typography>

      <Divider textAlign="left" sx={{ mb: 5, mt: 6 }}>
        <Chip label="Clients" />
      </Divider>
      <Box sx={{ width: '300px', mt: 3 }}>
        <ClientMenu
          client={client}
          clients={clients}
          parentHandler={handleChangeClient}
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
          <strong>Members of {client.name}</strong>
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
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleRemoveClientMember(member)}>
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
            Administrators of {client.name}
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
              const isYou = member._id === user._id;

              let primaryText = <span>{member.firstName} {member.lastName}</span>;

              if (isYou) {
                primaryText = <span>
                  {member.firstName} {member.lastName}
                  <span style={{ color: '#bababa' }}>{` (you)`}</span>
                </span>;
              }

              return (
                <React.Fragment key={member._id}>
                  <ListItem
                    secondaryAction={
                      <IconButton edge="end" aria-label="delete">
                        {
                          !isYou ? <ClearIcon /> : null
                        }
                      </IconButton>
                    }>
                    <ListItemText
                      primary={primaryText}
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

      <Divider textAlign="left" sx={{ mt: 6, mb: 3 }} >
        <Chip label={`${account.name} Users (${accountUsersLength})`} />
      </Divider>
      <Tabs value={accountTabVal} onChange={(_, val) => setAccountTabVal(val)}>
        <Tab label={`Administrators (${accountAdmins.length})`} />
        <Tab label={`Members (${accountMembers.length})`} />
      </Tabs>

      <TabPanel value={accountTabVal} index={0}>
        <List dense sx={{ maxWidth: 500 }}>
          {
            accountAdmins.map((member, index) => {
              const isYou = member._id === user._id;

              let primaryText = <span>{member.firstName} {member.lastName}</span>;

              if (isYou) {
                primaryText = <span>
                  {member.firstName} {member.lastName}
                  <span style={{ color: '#bababa' }}>{` (you)`}</span>
                </span>;
              }

              return (
                <React.Fragment key={member._id}>
                  <ListItem
                    secondaryAction={
                      <IconButton edge="end" aria-label="delete">
                        {
                          !isYou ? <EditIcon fontSize="small" /> : null
                        }
                      </IconButton>
                    }>
                    <ListItemText
                      primary={primaryText}
                      secondary={member.email}
                    />
                  </ListItem>
                  {index !== accountMembers.length - 1 ? <Divider /> : null}
                </React.Fragment>
              );
            })
          }
        </List>
      </TabPanel>

      <TabPanel value={accountTabVal} index={1}>
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
      </TabPanel>

      <Divider textAlign="left" sx={{ mb: 3 }}>
        <Chip label="Account" />
      </Divider>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="body1" sx={{ mr: 2 }}>
          <strong>Name:</strong>
        </Typography>
        <Typography variant="body1">{firstName} {lastName}</Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="body1" sx={{ mr: 2 }}>
          <strong>Email:</strong>
        </Typography>
        <Typography variant="body1">{user.email}</Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="body1" sx={{ mr: 2 }}>
          <strong>Created:</strong>
        </Typography>
        <Typography variant="body1">{new Date(user.dateCreated).toLocaleString()}</Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Button
          variant="outlined"
          sx={{ mt: 2 }}
          startIcon={<EditIcon />}
          onClick={() => setEditProfileModalOpen(true)}>Edit
        </Button>
      </Box>
      <Box sx={{ mt: 4, maxWidth: 300 }}>
        <AccountMenu
          accounts={user.memberOfAccounts}
          accountId={account._id}
          parentHandler={handleAccountSelection}
        />
      </Box>
      <Button
        sx={{ mt: 6 }}
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
        setClientMembers={setClientMembers}
        setAccountMembers={setAccountMembers}
      />

      <RemoveClientMemberModal
        open={removeClientMemberModalOpen}
        setOpen={setRemoveClientModalOpen}
        clientId={client._id}
        clientName={client.name}
        accountId={account._id}
        user={userToModify}
        setClientMembers={setClientMembers}
        setAccountMembers={setAccountMembers}
      />

      <EditProfileModal
        setFirstName={setFirstName}
        setLastName={setLastName}
        user={user}
        open={editProfileModalOpen}
        setOpen={setEditProfileModalOpen}
      />

      <Snackbar
        isOpen={isOpen}
        type={type}
        message={message}
      />


    </Paper>
  );
};
