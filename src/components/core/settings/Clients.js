import { Paper, Box, Divider, Button, Chip, Tooltip, Menu, TextField } from "@mui/material";
import ClientMenu from "../../core/ClientMenu";
import { setActiveClientId } from "../../../api/clients";
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
import DeleteTagModal from "../../admin/DeleteTagModal";
import RemoveClientModal from "../../admin/RemoveClientModal";
import CloseIcon from '@mui/icons-material/Close';
import { LoadingButton } from "@mui/lab";
import { updateTag } from "../../../api/tags";

export default function Clients() {
  const [createClientModalOpen, setCreateClientModalOpen] = useState(false);
  const [editClientModalOpen, setEditClientModalOpen] = useState(false);
  const [inviteClientUserModalOpen, setInviteClientUserModalOpen] = useState(false);
  const [removeClientUserModalOpen, setRemoveClientUserModalOpen] = useState(false);
  const [deleteTagModalOpen, setDeleteTagModalOpen] = useState(false);
  const [removeClientModalOpen, setRemoveClientModalOpen] = useState(false);
  const [tagMenuAnchor, setTagMenuAnchor] = useState(null);
  const [updatingTag, setUpdatingTag] = useState(false);

  const [userToModify, setUserToModify] = useState(null);
  const [tagToDelete, setTagToDelete] = useState(null);
  const [tagToEdit, setTagToEdit] = useState(null);
  const [editingTagName, setEditingTagName] = useState('');

  const tagMenuOpen = Boolean(tagMenuAnchor);

  const {
    client,
    clientMembers,
    clientAdmins,
    user,
    tags,
    org,
    clients,
    isAdmin,
    openSnackBar,
    tagsMap,
    setTags
  } = useOutletContext();

  const handleChangeClient = (clientObject) => {
    setActiveClientId(clientObject.id);
    window.location.reload();
  };

  const handleRemoveClientUser = (userObject) => {
    setUserToModify(userObject);
    setRemoveClientUserModalOpen(true);
  };

  const handleRemoveTag = (tag) => {
    setTagToDelete(tag);
    setDeleteTagModalOpen(true);
  };

  const handleEditTag = (e, tag) => {
    setTagToEdit(tag);
    setEditingTagName(tag.name);
    setTagMenuAnchor(e.currentTarget);
  };

  const handleUpdateTag = async () => {
    if (!editingTagName) {
      openSnackBar('Please enter a tag name.');
      return;
    }

    setUpdatingTag(true);

    try {
      const { message, success } = await updateTag({
        name: editingTagName,
        tagId: tagToEdit.id,
        clientId: client.id
      });

      if (success) {
        setTagMenuAnchor(null);
        openSnackBar('Tag successfully updated.', 'success');
        tagsMap[tagToEdit.id].name = editingTagName;
        setTags(Object.values(tagsMap));
        setUpdatingTag(false);
      } else {
        openSnackBar(message, 'error');
      }
    } catch (error) {
      openSnackBar(error.message, 'error');
    }
  };

  return (
    <>
      <Paper>
        <Box component="h6">{org.name} Clients</Box>
        <Divider sx={{ my: 4 }} />

        <Button
          hidden={!isAdmin}
          size="large"
          onClick={() => setCreateClientModalOpen(true)}
          variant="contained">
          Create Client
        </Button>

        <Box
          maxWidth={360}
          mt={5}
          mb={2}>
          <ClientMenu
            changeHandler={handleChangeClient}
            curClientId={client.id}
            clients={clients}
          />
        </Box>

        <Box hidden={!isAdmin}>
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
          hidden={!isAdmin}
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
                <ListItem>
                  <ListItemText>
                    No client members.
                  </ListItemText>
                </ListItem> : ''
            }
            {
              clientMembers.map((member, index) => {
                return (
                  <React.Fragment key={member.id}>
                    <ListItem
                      secondaryAction={
                        isAdmin ?
                          <Tooltip title="Remove Member">
                            <IconButton
                              edge="end"
                              onClick={() => handleRemoveClientUser(member)}>
                              <CloseIcon fontSize="small" />
                            </IconButton>
                          </Tooltip> : null
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
                <ListItem>
                  <ListItemText>
                    No client administators.
                  </ListItemText>
                </ListItem> : ''
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
                      secondaryAction={!isYou && isAdmin ?
                        <Tooltip title="Remove Administrator">
                          <IconButton
                            edge="end"
                            onClick={() => handleRemoveClientUser(member)}>
                            <CloseIcon
                              fontSize="small"
                            />
                          </IconButton>
                        </Tooltip> : null
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
          <Divider sx={{ my: 4 }} />
          {
            tags.map(tag =>
              isAdmin ?
                <Chip
                  label={tag.name}
                  key={tag.id}
                  sx={{ mr: 1, mb: 1 }}
                  onClick={e => handleEditTag(e, tag)}
                  onDelete={() => handleRemoveTag(tag)}>
                </Chip> :
                <Chip
                  label={tag.name}
                  key={tag.id}
                  sx={{ mr: 1, mb: 1 }}>
                </Chip>
            )
          }
        </Box>
        <Menu
          anchorEl={tagMenuAnchor}
          open={tagMenuOpen}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          onClose={() => setTagMenuAnchor(null)}>
          <Box px={2} py={1}>
            <TextField
              value={editingTagName}
              onChange={e => setEditingTagName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' ? handleUpdateTag() : null}
              size="small"
              disabled={updatingTag}
              placeholder="Tag name"
              fullWidth sx={{ mb: 1 }}>
            </TextField>
            <Box>
              <Button
                onClick={() => setTagMenuAnchor(null)}
                size="small"
                disabled={updatingTag}
                sx={{ mr: 0.5 }}>
                Cancel
              </Button>
              <LoadingButton
                disabled={updatingTag}
                size="small"
                loading={updatingTag}
                onClick={handleUpdateTag}
                variant="contained">
                Save
              </LoadingButton>
            </Box>
          </Box>
        </Menu>
      </Paper>

      <AddClientModal
        open={createClientModalOpen}
        setOpen={setCreateClientModalOpen}
        org={org}
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

      <DeleteTagModal
        open={deleteTagModalOpen}
        setOpen={setDeleteTagModalOpen}
        tag={tagToDelete}
      />


      <RemoveClientModal
        open={removeClientModalOpen}
        setOpen={setRemoveClientModalOpen}
      />
    </>
  );
};
