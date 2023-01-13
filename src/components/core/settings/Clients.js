import { Paper, Box, Divider, Button, Chip, Typography } from "@mui/material";
import useSnackbar from "../../../hooks/useSnackbar";
import ClientMenu from "../../admin/ClientMenu";
import { setActiveClientId } from "../../../api/client";
import Snackbar from "../Snackbar";
import { useOutletContext } from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddClientModal from "../../admin/AddClientModal";
import EditClientModal from "../../admin/EditClientModal";
import React, { useState } from "react";
import InviteClientUserModal from "../../admin/InviteClientUserModal";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import RemoveClientUserModal from "../../admin/RemoveClientUserModal";
import IconButton from '@mui/material/IconButton';
import RemoveTagModal from "../../admin/RemoveTagModal";
import RemoveClientModal from "../../admin/RemoveClientModal";
import CloseIcon from '@mui/icons-material/Close';

export default function Clients() {
  const [createClientModalOpen, setCreateClientModalOpen] = useState(false);
  const [editClientModalOpen, setEditClientModalOpen] = useState(false);
  const [inviteClientUserModalOpen, setInviteClientUserModalOpen] = useState(false);
  const [removeClientUserModalOpen, setRemoveClientUserModalOpen] = useState(false);
  const [removeTagModalOpen, setRemoveTagModalOpen] = useState(false);
  const [removeClientModalOpen, setRemoveClientModalOpen] = useState(false);

  const [userToModify, setUserToModify] = useState(null);
  const [tagToDelete, setTagToDelete] = useState(null);

  const {
    client,
    clientMembers,
    clientAdmins,
    user,
    tags,
    account,
    clients
  } = useOutletContext();

  const {
    isOpen,
    openSnackBar,
    type,
    message
  } = useSnackbar();

  const handleChangeClient = (clientObject) => {
    setActiveClientId(clientObject.id);
    openSnackBar(`Loading ${clientObject.name}...`, 'info');
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  const handleRemoveClientUser = (userObject) => {
    setUserToModify(userObject);
    setRemoveClientUserModalOpen(true);
  };

  const handleRemoveTag = (tag) => {
    setTagToDelete(tag);
    setRemoveTagModalOpen(true);
  };

  return (
    <>
      <Paper>
        <Box component="h6">Clients</Box>
        <Divider sx={{ my: 4 }} />

        <Button
          onClick={() => setCreateClientModalOpen(true)}
          variant="contained">
          Create Client
        </Button>

        <Box maxWidth={360} mt={5} mb={2}>
          <ClientMenu
            changeHandler={handleChangeClient}
            client={client}
            clients={clients}
          />
        </Box>
        <Box>
          <Button
            startIcon={<EditIcon />}
            sx={{ mr: 2 }}
            onClick={() => setEditClientModalOpen(true)}
            variant="outlined">
            Edit {client.name}
          </Button>
          <Button
            startIcon={<DeleteIcon />}
            color="error"
            onClick={() => setRemoveClientModalOpen(true)}
            variant="outlined">
            Delete {client.name}
          </Button>
        </Box>
      </Paper>

      <Paper sx={{ my: 3 }}>
        <Box component="h6">{client.name} Team</Box>
        <Divider sx={{ my: 4 }} />
        <Button
          variant="outlined"
          size="small"
          sx={{ mb: 2 }}
          onClick={() => setInviteClientUserModalOpen(true)}
          startIcon={<PersonAddIcon />}>
          Invite someone to {client.name}
        </Button>
        <Box>
          <Divider textAlign="left">
            <Chip label="Members" size="small" />
          </Divider>
          <List dense>
            {
              clientMembers.length === 0 ?
                <Typography variant="body2">
                  No client members.
                </Typography> : ''
            }
            {
              clientMembers.map((member, index) => {
                return (
                  <React.Fragment key={member.id}>
                    <ListItem
                      secondaryAction={
                        <IconButton
                          edge="end"
                          onClick={() => handleRemoveClientUser(member)}>
                          <CloseIcon fontSize="small" />
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

        <Box>
          <Divider textAlign="left">
            <Chip label="Administrators" size="small" />
          </Divider>
          <List dense>
            {
              clientAdmins.length === 0 ?
                <Typography variant="body2">
                  No client administrators.
                </Typography> : ''
            }
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
                      secondaryAction={isYou ?
                        <IconButton
                          edge="end"
                          onClick={() => handleRemoveClientUser(member)}>
                          <CloseIcon
                            fontSize="small"
                          />
                        </IconButton> : null
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
      </Paper>

      <Paper sx={{ my: 3 }}>
        <Box component="h6" display="flex" alignItems="center">
          {client.name} Tags
        </Box>
        <Box>
          <Typography variant="caption">New tags can be added when creating a new task.</Typography>
          <Divider sx={{ my: 4 }} />
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
      </Paper>

      <AddClientModal
        open={createClientModalOpen}
        setOpen={setCreateClientModalOpen}
        account={account}
      />

      <EditClientModal
        open={editClientModalOpen}
        setOpen={setEditClientModalOpen}
        clientToUpdate={client}
      />

      <InviteClientUserModal
        open={inviteClientUserModalOpen}
        setOpen={setInviteClientUserModalOpen}
      />

      <RemoveClientUserModal
        open={removeClientUserModalOpen}
        setOpen={setRemoveClientUserModalOpen}
        user={userToModify}
      />

      <RemoveTagModal
        open={removeTagModalOpen}
        setOpen={setRemoveTagModalOpen}
        tag={tagToDelete}
      />


      <RemoveClientModal
        open={removeClientModalOpen}
        setOpen={setRemoveClientModalOpen}
      />

      <Snackbar
        isOpen={isOpen}
        type={type}
        message={message}
      />
    </>
  );
};
