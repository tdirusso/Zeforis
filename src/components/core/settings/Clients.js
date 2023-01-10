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
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import InviteClientMemberModal from "../../admin/InviteClientMemberModal";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import RemoveClientMemberModal from "../../admin/RemoveClientMemberModal";
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';
import RemoveTagModal from "../../admin/RemoveTagModal";

export default function Clients() {
  const [createClientModalOpen, setCreateClientModalOpen] = useState(false);
  const [editClientModalOpen, setEditClientModalOpen] = useState(false);
  const [inviteClientMemberModalOpen, setInviteClientModalOpen] = useState(false);
  const [removeClientMemberModalOpen, setRemoveClientModalOpen] = useState(false);
  const [removeTagModalOpen, setRemoveTagModalOpen] = useState(false);

  const [userToModify, setUserToModify] = useState(null);
  const [tagToDelete, setTagToDelete] = useState(null);

  const [tabVal, setTabVal] = useState(0);

  const {
    client,
    clientMembers,
    clientAdmins,
    user,
    tags
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
    }, 1000);
  };

  const handleRemoveClientMember = (userObject) => {
    setUserToModify(userObject);
    setRemoveClientModalOpen(true);
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
          onClick={() => setInviteClientModalOpen(true)}
          startIcon={<PersonAddIcon />}>
          Invite someone to {client.name}
        </Button>
        <Tabs value={tabVal} onChange={(_, index) => setTabVal(index)}>
          <Tab label="Members" />
          <Tab label="Administrators" />
        </Tabs>

        <Box hidden={tabVal !== 0}>
          <List dense>
            {
              clientMembers.map((member, index) => {
                return (
                  <React.Fragment key={member.id}>
                    <ListItem
                      secondaryAction={
                        <IconButton
                          edge="end"
                          onClick={() => handleRemoveClientMember(member)}>
                          <ClearIcon fontSize="small" />
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

        <Box hidden={tabVal !== 1}>
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
                            !isYou ? <EditIcon /> : null
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
      </Paper>

      <Paper sx={{ my: 3 }}>
        <Box component="h6" display="flex" alignItems="center">
          {client.name} Tags
        </Box>
        <Box>
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
      </Paper>

      <AddClientModal
        open={createClientModalOpen}
        setOpen={setCreateClientModalOpen}
      />

      <EditClientModal
        open={editClientModalOpen}
        setOpen={setEditClientModalOpen}
        clientToUpdate={client}
      />

      <InviteClientMemberModal
        open={inviteClientMemberModalOpen}
        setOpen={setInviteClientModalOpen}
      />

      <RemoveClientMemberModal
        open={removeClientMemberModalOpen}
        setOpen={setRemoveClientModalOpen}
      />

      <RemoveTagModal
        open={removeTagModalOpen}
        setOpen={setRemoveTagModalOpen}
        tag={tagToDelete}
      />

      <Snackbar
        isOpen={isOpen}
        type={type}
        message={message}
      />
    </>
  );
};
