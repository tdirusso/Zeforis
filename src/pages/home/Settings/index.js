/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Button, Chip, Divider, Paper, Typography } from "@mui/material";
import { useOutletContext } from "react-router-dom";
import ClientMenu from "../../../components/admin/ClientMenu";
import EditIcon from '@mui/icons-material/Edit';
import './styles.css';
import React, { useState } from "react";
import AddClientModal from "../../../components/admin/AddClientModal";
import DeleteIcon from '@mui/icons-material/Delete';
import EditClientModal from "../../../components/admin/EditClientModal";
import { setActiveClientId } from "../../../api/client";
import useSnackbar from "../../../hooks/useSnackbar";
import Snackbar from "../../../components/core/Snackbar";
import { logout } from "../../../api/auth";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import InviteClientMemberModal from "../../../components/admin/InviteClientMemberModal";
import RemoveClientMemberModal from "../../../components/admin/RemoveClientMemberModal";
import AccountMenu from "../../../components/core/AccountMenu";
import { setActiveAccountId } from "../../../api/account";
import EditProfileModal from "../../../components/core/EditProfileModal";
import RemoveTagModal from "../../../components/admin/RemoveTagModal";

export default function Settings() {
  const [createClientModalOpen, setCreateClientModalOpen] = useState(false);
  const [editClientModalOpen, setEditClientModalOpen] = useState(false);
  const [inviteClientMemberModalOpen, setInviteClientModalOpen] = useState(false);
  const [removeClientMemberModalOpen, setRemoveClientModalOpen] = useState(false);
  const [editProfileModalOpen, setEditProfileModalOpen] = useState(false);
  const [removeTagModalOpen, setRemoveTagModalOpen] = useState(false);

  const [userToModify, setUserToModify] = useState(null);
  const [tagToDelete, setTagToDelete] = useState(null);

  const {
    client,
    clients,
    account,
    user,
    clientMembers,
    clientAdmins,
    accountUsers,
    setAccountUsers,
    tags,
    setTags,
    tasks,
    setTasks
  } = useOutletContext();

  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);

  const {
    isOpen,
    openSnackBar,
    type,
    message
  } = useSnackbar();

  const accountUsersLength = accountUsers.length;

  const handleChangeClient = (clientObject) => {
    setActiveClientId(clientObject.id);
    openSnackBar(`Loading ${clientObject.name}...`, 'info');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handleRemoveClientMember = (userObject) => {
    setUserToModify(userObject);
    setRemoveClientModalOpen(true);
  };

  const handleAccountSelection = accountId => {
    const selectedAccountObject = user.memberOfAccounts.find(account => account.id === accountId);
    setActiveAccountId(selectedAccountObject.id);
    openSnackBar(`Loading ${selectedAccountObject.name}...`, 'info');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handleRemoveTag = (tag) => {
    setTagToDelete(tag);
    setRemoveTagModalOpen(true);
  };

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
                <React.Fragment key={member.id}>
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
            sx={{ ml: 1.5 }}>
            Manage Access
          </Button>
        </Typography>
        <List dense>
          {
            clientAdmins.map((member, index) => {
              const isYou = member.id === user.id;

              let primaryText = <span>{member.firstName} {member.lastName}</span>;

              if (isYou) {
                primaryText = <span>
                  {member.firstName} {member.lastName}
                  <span style={{ color: '#bababa' }}>{` (you)`}</span>
                </span>;
              }

              return (
                <React.Fragment key={member.id}>
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

        <Box>
          <Typography>Tags</Typography>
          <Typography variant="caption">New tags can be added when creating a new task.</Typography>
          <br></br>
          <br></br>
          {
            tags.map(tag =>
              <Chip
                label={tag.name}
                key={tag.id}
                sx={{ mr: 1, mb: 1 }}
                onDelete={() => handleRemoveTag(tag)}>
              </Chip>
            )
          }
        </Box>
      </Box>

      <Divider textAlign="left" sx={{ mt: 6, mb: 3 }} >
        <Chip label={`${account.name} Users (${accountUsersLength})`} />
      </Divider>

      <List dense sx={{ maxWidth: 500 }}>
        {
          accountUsers.map((accountUser, index) => {
            const isYou = accountUser.id === user.id;

            let primaryText = <span>{accountUser.firstName} {accountUser.lastName}</span>;

            if (isYou) {
              primaryText = <span>
                {accountUser.firstName} {accountUser.lastName}
                <span style={{ color: '#bababa' }}>{` (you)`}</span>
              </span>;
            }

            return (
              <React.Fragment key={accountUser.id}>
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
                    secondary={accountUser.email}
                  />
                </ListItem>
                {index !== accountUsers.length - 1 ? <Divider /> : null}
              </React.Fragment>
            );
          })
        }
      </List>

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
          accountId={account.id}
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
        accountId={account.id}
      />

      <EditClientModal
        open={editClientModalOpen}
        setOpen={setEditClientModalOpen}
        clientToUpdate={client}
      />

      <InviteClientMemberModal
        open={inviteClientMemberModalOpen}
        setOpen={setInviteClientModalOpen}
        clientId={client.id}
        clientName={client.name}
        accountId={account.id}
        accountName={account.name}
        setAccountUsers={setAccountUsers}
        accountUsers={accountUsers}
        clientMembers={clientMembers}
      />

      <RemoveClientMemberModal
        open={removeClientMemberModalOpen}
        setOpen={setRemoveClientModalOpen}
        clientId={client.id}
        clientName={client.name}
        accountId={account.id}
        user={userToModify}
        accountUsers={accountUsers}
        setAccountUsers={setAccountUsers}
      />

      <EditProfileModal
        setFirstName={setFirstName}
        setLastName={setLastName}
        user={user}
        open={editProfileModalOpen}
        setOpen={setEditProfileModalOpen}
      />

      <RemoveTagModal
        open={removeTagModalOpen}
        setOpen={setRemoveTagModalOpen}
        tag={tagToDelete}
        setTags={setTags}
        clientId={client.id}
        tasks={tasks}
        setTasks={setTasks}
      />

      <Snackbar
        isOpen={isOpen}
        type={type}
        message={message}
      />
    </Paper>
  );
};
