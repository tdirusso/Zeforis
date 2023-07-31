import { Box, FormControlLabel, FormGroup, Switch, TextField, Typography } from "@mui/material";
import { Divider, Button, Chip, Tooltip, Menu } from "@mui/material";
import { useOutletContext } from "react-router-dom";
import React, { useState } from "react";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { LoadingButton } from "@mui/lab";
import { removeClientUser } from "../../../../api/clients";

export default function MembersTab() {

  const {
    client,
    clientMembers,
    clientAdmins,
    user,
    isAdmin,
    openSnackBar,
    setOrgUsers,
    orgUsersMap
  } = useOutletContext();

  const clientId = client.id;

  const [userToRemove, setUserToRemove] = useState(null);
  const [isRemovingUser, setRemovingUser] = useState(false);
  const [removeUserMenuAnchor, setRemoveUserMenuAnchor] = useState(null);
  const [inviteUserMenuAnchor, setInviteUserMenuAnchor] = useState(null);
  const [isInvitingUser, setIsInviting] = useState(false);
  const [inviteeEmail, setInviteeEmail] = useState('');
  const [inviteeIsAdmin, setInviteeIsAdmin] = useState(0);

  const removeUserMenuOpen = Boolean(removeUserMenuAnchor);
  const inviteUserMenuOpen = Boolean(inviteUserMenuAnchor);

  const openRemoveClientUserConfirmatiom = (e, userObject) => {
    setRemoveUserMenuAnchor(e.currentTarget);
    setUserToRemove(userObject);
  };

  const handleRemoveClientUser = async () => {
    setRemovingUser(true);

    const willBeRemovedFromOrg =
      userToRemove?.memberOfClients.length + user?.adminOfClients.length === 1;

    try {
      const result = await removeClientUser({
        clientId,
        userId: userToRemove.id
      });

      const success = result.success;
      const resultMessage = result.message;

      if (success) {
        if (willBeRemovedFromOrg) {
          setOrgUsers(orgUsers => orgUsers.filter(u => u.id !== user.id));
        } else {
          const theUser = orgUsersMap[userToRemove.id];
          theUser.memberOfClients = theUser.memberOfClients.filter(client => client.id !== clientId);
          theUser.adminOfClients = theUser.adminOfClients.filter(client => client.id !== clientId);
          setOrgUsers(Object.values(orgUsersMap));
        }

        setRemoveUserMenuAnchor(null);
        setRemovingUser(false);
        openSnackBar('Successully removed.', 'success');
      } else {
        openSnackBar(resultMessage, 'error');
        setRemovingUser(false);
      }
    } catch (error) {
      openSnackBar(error.message, 'error');
      setRemovingUser(false);
    }
  };

  const handleInviteClientUser = async () => {

  };

  return (
    <>
      <Box mt={5}>
        <Box>
          <Button
            hidden={!isAdmin}
            variant="outlined"
            sx={{ mb: 2 }}
            onClick={e => setInviteUserMenuAnchor(e.currentTarget)}
            startIcon={<PersonAddIcon />}>
            Invite someone to {client.name}
          </Button>
        </Box>
        <Box>
          <Divider textAlign="center">
            <Chip label="Members" />
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
                              onClick={e => openRemoveClientUserConfirmatiom(e, member)}>
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
          <Divider textAlign="center">
            <Chip label="Administrators" />
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
                            onClick={e => openRemoveClientUserConfirmatiom(e, member)}>
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
      </Box>
      <Menu
        anchorEl={removeUserMenuAnchor}
        open={removeUserMenuOpen}
        onClose={() => setRemoveUserMenuAnchor(null)}>
        <Box px={2} py={1}>
          <Button
            sx={{ mr: 0.5 }}
            disabled={isRemovingUser}
            size="small"
            onClick={() => setRemoveUserMenuAnchor(null)}>
            Cancel
          </Button>
          <LoadingButton
            disabled={isRemovingUser}
            color='error'
            variant='contained'
            size="small"
            loading={isRemovingUser}
            onClick={() => handleRemoveClientUser()}>
            Remove
          </LoadingButton>
        </Box>
      </Menu>

      <Menu
        anchorEl={inviteUserMenuAnchor}
        open={inviteUserMenuOpen}
        onClose={() => setInviteUserMenuAnchor(null)}>
        <Box sx={{ py: 2, px: 2, minWidth: '300px' }}>
          <Box>
            <TextField
              variant="standard"
              helperText="Email address"
              size="small"
              placeholder="user@gmail.com"
              fullWidth
              autoFocus
              disabled={isInvitingUser}
              value={inviteeEmail}
              onChange={e => setInviteeEmail(e.target.value)}
              type="email">
            </TextField>
          </Box>
          <Box mb={2}>
            <FormGroup>
              <FormControlLabel
                control={<Switch
                size="small"
                  disabled={isInvitingUser}
                  value={inviteeIsAdmin}
                  onChange={(_, val) => setInviteeIsAdmin(val)}
                />}
                label={<Typography variant='body2'>Admin?</Typography>}
              />
            </FormGroup>
          </Box>
          <Box px={2} py={1}>
            <Button
              sx={{ mr: 0.5 }}
              disabled={isInvitingUser}
              size="small"
              onClick={() => setInviteUserMenuAnchor(null)}>
              Cancel
            </Button>
            <LoadingButton
              disabled={isInvitingUser}
              variant='contained'
              size="small"
              loading={isInvitingUser}
              onClick={() => handleInviteClientUser()}>
              Send Invitation
            </LoadingButton>
          </Box>
        </Box>
      </Menu>
    </>
  );
};
