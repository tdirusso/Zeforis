import { Box, FormControlLabel, FormGroup, InputAdornment, Switch, TextField, Typography } from "@mui/material";
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
import { inviteClientUser, removeClientUser } from "../../../../api/clients";
import HelpIcon from '@mui/icons-material/Help';
import { MailOutline } from "@mui/icons-material";

const inviteUserAdminTooltip = <>
  Administrators can edit tasks, folders and client settings (best for contributors).
  <br></br>
  <br></br>
  Non-admins will have view-only access (best for members that belong to the client).
</>;

export default function MembersTab() {

  const {
    client,
    clientMembers,
    clientAdmins,
    user,
    isAdmin,
    openSnackBar,
    setOrgUsers,
    orgUsersMap,
    org
  } = useOutletContext();

  const clientId = client.id;
  const orgId = org.id;
  const clientName = client.name;
  const orgName = org.name;
  const orgColor = org.brandColor;
  const orgLogo = org.logo;

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
    if (!inviteeEmail) {
      openSnackBar("Please enter the user's email address to invite.");
      return;
    }

    setIsInviting(true);

    try {
      const { success, message, userId, firstName = '', lastName = '' } = await inviteClientUser({
        email: inviteeEmail,
        clientId,
        orgId,
        clientName,
        orgName,
        isAdmin,
        orgColor,
        orgLogo
      });

      if (success) {
        const addedUser = {
          id: userId,
          email: inviteeEmail,
          firstName,
          lastName
        };

        if (!orgUsersMap[userId]) { // User is new to the org
          addedUser.memberOfClients = [{ id: clientId, name: clientName }];
          addedUser.adminOfClients = [];
          setOrgUsers(members => [...members, addedUser]);
        } else { // User already exists in the org
          const existingUser = orgUsersMap[userId];
          const userIsMember = existingUser.memberOfClients.find(({ id }) => id === clientId);
          const userIsAdmin = existingUser.adminOfClients.find(({ id }) => id === clientId);

          if (isAdmin) {
            if (userIsMember) {
              existingUser.memberOfClients.filter(({ id }) => id !== clientId);
            }

            if (!userIsAdmin) {
              existingUser.adminOfClients.push({ id: clientId, name: clientName });
            }
          } else {
            if (userIsAdmin) {
              existingUser.adminOfClients.filter(({ id }) => id !== clientId);
            }

            if (!userIsMember) {
              existingUser.memberOfClients.push({ id: clientId, name: clientName });
            }
          }

          setOrgUsers(Object.values(orgUsersMap));
        }

        setIsInviting(false);
        handleInviteUserMenuClose();
        openSnackBar('Invitation successfully sent.', 'success');
      } else {
        openSnackBar(message, 'error');
        setIsInviting(false);
      }
    } catch (error) {
      openSnackBar(error.message, 'error');
      setIsInviting(false);
    }
  };

  const handleInviteUserMenuClose = () => {
    setInviteUserMenuAnchor(null);
    setInviteeEmail('');
  };

  return (
    <>
      <Box mt={3}>
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
                        primary={primaryText}
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
        onClose={handleInviteUserMenuClose}>
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
              type="email"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MailOutline htmlColor="#cbcbcb" fontSize="small" />
                  </InputAdornment>
                )
              }}>
            </TextField>
          </Box>
          <Box mb={2} mt={1.5}>
            <FormGroup>
              <FormControlLabel
                control={<Switch
                  size="small"
                  disabled={isInvitingUser}
                  value={inviteeIsAdmin}
                  onChange={(_, val) => setInviteeIsAdmin(val)}
                />}
                label={<Typography variant='body2' display="flex" alignItems="center">
                  Administrator
                  <Tooltip title={inviteUserAdminTooltip} placement="top">
                    <HelpIcon
                      fontSize="small"
                      sx={{ ml: 0.5, cursor: 'default' }}
                      htmlColor="#c7c7c7"
                    />
                  </Tooltip>
                </Typography>}
              />
            </FormGroup>
          </Box>
          <Box py={1} display="flex">
            <LoadingButton
              disabled={isInvitingUser}
              variant='contained'
              size="small"
              fullWidth
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
