import { Grid, Paper, Box, Divider, Button, Chip, Tooltip, Menu, TextField, Tabs, Tab, InputAdornment } from "@mui/material";
import ClientMenu from "../../ClientMenu";
import { setActiveClientId } from "../../../../api/clients";
import { useOutletContext } from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CreateClientModal from "../../../admin/CreateClientModal";
import EditClientModal from "../../../admin/EditClientModal";
import React, { useState } from "react";
import InviteClientUserModal from "../../../admin/InviteClientUserModal";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import RemoveClientUserModal from "../../../admin/RemoveClientUserModal";
import IconButton from '@mui/material/IconButton';
import RemoveClientModal from "../../../admin/DeleteClientModal";
import CloseIcon from '@mui/icons-material/Close';
import { LoadingButton } from "@mui/lab";
import { deleteTag, updateTag } from "../../../../api/tags";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import PeopleOutlineOutlinedIcon from '@mui/icons-material/PeopleOutlineOutlined';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import SwapHorizOutlinedIcon from '@mui/icons-material/SwapHorizOutlined';
import GeneralTab from "./GeneralTab";

export default function ClientsTab() {
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
    setTags,
    tasks,
    setTasks,
    openDrawer
  } = useOutletContext();

  const [createClientModalOpen, setCreateClientModalOpen] = useState(false);
  const [editClientModalOpen, setEditClientModalOpen] = useState(false);
  const [inviteClientUserModalOpen, setInviteClientUserModalOpen] = useState(false);
  const [removeClientUserModalOpen, setRemoveClientUserModalOpen] = useState(false);
  const [removeClientModalOpen, setRemoveClientModalOpen] = useState(false);
  const [editTagMenuAnchor, setEditTagMenuAnchor] = useState(null);
  const [deleteTagMenuAnchor, setDeleteTagMenuAnchor] = useState(null);
  const [updatingTag, setUpdatingTag] = useState(false);
  const [deletingTag, setDeletingTag] = useState(false);
  const [clientName, setClientName] = useState(client.name);
  const [tabVal, setTabVal] = useState(0);

  const [userToModify, setUserToModify] = useState(null);
  const [tagToDelete, setTagToDelete] = useState(null);
  const [tagToEdit, setTagToEdit] = useState(null);
  const [editingTagName, setEditingTagName] = useState('');

  const editTagMenuOpen = Boolean(editTagMenuAnchor);
  const deleteTagMenuOpen = Boolean(deleteTagMenuAnchor);

  const handleChangeClient = (clientObject) => {
    setActiveClientId(clientObject.id);
    window.location.reload();
  };

  const handleRemoveClientUser = (userObject) => {
    setUserToModify(userObject);
    setRemoveClientUserModalOpen(true);
  };

  const handleDeleteTag = async () => {
    setDeletingTag(true);

    try {
      const result = await deleteTag({
        clientId: client.id,
        tagId: tagToDelete.id
      });

      const success = result.success;
      const resultMessage = result.message;

      if (success) {
        delete tagsMap[tagToDelete];

        const tasksClone = [...tasks];
        tasksClone.forEach(task => {
          if (task.tags) {
            task.tags = task.tags.replace(tagToDelete.id, '') || null;
          }
        });

        setTasks(tasksClone);
        setTags(curTags => curTags.filter(t => t.id !== tagToDelete.id));
        setDeletingTag(false);
        setDeleteTagMenuAnchor(null);
        openSnackBar('Successully deleted.', 'success');
      } else {
        openSnackBar(resultMessage, 'error');
        setDeletingTag(false);
      }
    } catch (error) {
      openSnackBar(error.message, 'error');
      setDeletingTag(false);
    }
  };

  const handleEditTag = (e, tag) => {
    setTagToEdit(tag);
    setEditingTagName(tag.name);
    setEditTagMenuAnchor(e.currentTarget);
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
        setEditTagMenuAnchor(null);
        openSnackBar('Tag successfully updated.', 'success');
        tagsMap[tagToEdit.id].name = editingTagName;
        setTags(Object.values(tagsMap));
        setUpdatingTag(false);
      } else {
        openSnackBar(message, 'error');
        setUpdatingTag(false);
      }
    } catch (error) {
      setUpdatingTag(false);
      openSnackBar(error.message, 'error');
    }
  };

  const openDeleteTagConfirmation = (e, tag) => {
    setTagToDelete(tag);
    setDeleteTagMenuAnchor(e.currentTarget);
  };

  const getTabContent = () => {
    switch (tabVal) {
      case 0:
        return <GeneralTab />;
      default:
        break;
    }
  };

  return (
    <Grid item xs={12}>
      <Paper>
        <Tabs value={tabVal} onChange={(_, newVal) => setTabVal(newVal)}>
          <Tab label="General" icon={<InfoOutlinedIcon />} iconPosition="start" />
          <Tab label="Members" icon={<PeopleOutlineOutlinedIcon />} iconPosition="start" />
          <Tab label="Tags" icon={<LocalOfferOutlinedIcon />} iconPosition="start" />
        </Tabs>

        {
          getTabContent()
        }
      </Paper>

      {/* <Paper sx={{ my: 3 }}>
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
                  onDelete={e => openDeleteTagConfirmation(e, tag)}>
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
          anchorEl={editTagMenuAnchor}
          open={editTagMenuOpen}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          onClose={() => setEditTagMenuAnchor(null)}>
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
                onClick={() => setEditTagMenuAnchor(null)}
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
        <Menu
          anchorEl={deleteTagMenuAnchor}
          open={deleteTagMenuOpen}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          onClose={() => setDeleteTagMenuAnchor(null)}>
          <Box px={2} py={1}>
            <Box>
              <Button
                onClick={() => setDeleteTagMenuAnchor(null)}
                size="small"
                disabled={deletingTag}
                sx={{ mr: 0.5 }}>
                Cancel
              </Button>
              <LoadingButton
                disabled={deletingTag}
                size="small"
                color="error"
                loading={deletingTag}
                onClick={handleDeleteTag}
                variant="contained">
                Delete
              </LoadingButton>
            </Box>
          </Box>
        </Menu>
      </Paper> */}

      <CreateClientModal
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
    </Grid>
  );
};
