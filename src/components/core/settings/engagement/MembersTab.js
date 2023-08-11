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
import { inviteEngagementUser, removeEngagementUser } from "../../../../api/engagements";
import HelpIcon from '@mui/icons-material/Help';
import { MailOutline } from "@mui/icons-material";

const inviteUserAdminTooltip = <>
  Administrators can edit tasks, folders and engagement settings (best for contributors).
  <br></br>
  <br></br>
  Non-admins will have view-only access (best for members that belong to the engagement).
</>;

export default function MembersTab() {

  const {
    engagement,
    engagementMembers,
    engagementAdmins,
    user,
    isAdmin,
    openSnackBar,
    setOrgUsers,
    orgUsersMap,
    org,
    isOrgOwner
  } = useOutletContext();

  const engagementId = engagement.id;
  const orgId = org.id;
  const engagementName = engagement.name;
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

  const openRemoveEngagementUserConfirmatiom = (e, userObject) => {
    setRemoveUserMenuAnchor(e.currentTarget);
    setUserToRemove(userObject);
  };

  const handleRemoveEngagementUser = async () => {
    setRemovingUser(true);

    const willBeRemovedFromOrg =
      userToRemove.memberOfEngagements.length + userToRemove.adminOfEngagements.length === 1;

    try {
      const result = await removeEngagementUser({
        engagementId,
        userId: userToRemove.id,
        orgId: org.id
      });

      const success = result.success;
      const resultMessage = result.message;

      if (success) {
        if (willBeRemovedFromOrg) {
          setOrgUsers(orgUsers => orgUsers.filter(u => u.id !== user.id));
        } else {
          const theUser = orgUsersMap[userToRemove.id];
          theUser.memberOfEngagements = theUser.memberOfEngagements.filter(engagement => engagement.id !== engagementId);
          theUser.adminOfEngagements = theUser.adminOfEngagements.filter(engagement => engagement.id !== engagementId);
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

  const handleInviteEngagementUser = async e => {
    e.preventDefault();

    if (!inviteeEmail) {
      openSnackBar("Please enter the user's email address to invite.");
      return;
    }

    const lcInviteeEmail = inviteeEmail.toLowerCase();

    const engagementUserExists = [...engagementAdmins, ...engagementMembers].some(
      eUser => eUser.email.toLowerCase() === lcInviteeEmail
    );

    if (engagementUserExists) {
      openSnackBar('User is already part of this engagement.');
      return;
    }

    setIsInviting(true);

    try {
      const { success, message, userId, firstName = '', lastName = '' } = await inviteEngagementUser({
        email: lcInviteeEmail,
        engagementId,
        orgId,
        engagementName,
        orgName,
        isAdmin: inviteeIsAdmin,
        orgColor,
        orgLogo
      });

      if (success) {
        const addedUser = {
          id: userId,
          email: lcInviteeEmail,
          firstName,
          lastName
        };

        if (!orgUsersMap[userId]) { // User is new to the org
          const engagementData = { id: engagementId, name: engagementName };
          addedUser.memberOfEngagements = inviteeIsAdmin ? [] : [engagementData];
          addedUser.adminOfEngagements = inviteeIsAdmin ? [engagementData] : [];
          setOrgUsers(members => [...members, addedUser]);
        } else { // User already exists in the org
          const existingUser = orgUsersMap[userId];
          const userIsMember = existingUser.memberOfEngagements.find(({ id }) => id === engagementId);
          const userIsAdmin = existingUser.adminOfEngagements.find(({ id }) => id === engagementId);

          if (inviteeIsAdmin) {
            if (userIsMember) {
              existingUser.memberOfEngagements.filter(({ id }) => id !== engagementId);
            }

            if (!userIsAdmin) {
              existingUser.adminOfEngagements.push({ id: engagementId, name: engagementName });
            }
          } else {
            if (userIsAdmin) {
              existingUser.adminOfEngagements.filter(({ id }) => id !== engagementId);
            }

            if (!userIsMember) {
              existingUser.memberOfEngagements.push({ id: engagementId, name: engagementName });
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
      <Box mt={3} component="h4">Members of {engagement.name}</Box>
      <Box mt={3}>
        <Box>
          <Button
            hidden={!isOrgOwner}
            variant="outlined"
            style={{ marginBottom: '1rem' }}
            onClick={e => setInviteUserMenuAnchor(e.currentTarget)}
            startIcon={<PersonAddIcon />}>
            Invite someone to {engagement.name}
          </Button>
        </Box>
        <Box>
          <Divider textAlign="center">
            <Chip label="Members" />
          </Divider>
          <List dense>
            {
              engagementMembers.length === 0 ?
                <ListItem>
                  <ListItemText>
                    No engagement members.
                  </ListItemText>
                </ListItem> : ''
            }
            {
              engagementMembers.map((member, index) => {
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
                        isOrgOwner ?
                          <Tooltip title="Remove Member">
                            <IconButton
                              edge="end"
                              onClick={e => openRemoveEngagementUserConfirmatiom(e, member)}>
                              <CloseIcon fontSize="small" />
                            </IconButton>
                          </Tooltip> : null
                      }>
                      <ListItemText
                        primary={primaryText}
                        secondary={member.email}
                      />
                    </ListItem>
                    {index !== engagementMembers.length - 1 ? <Divider /> : null}
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
              engagementAdmins.length === 0 ?
                <ListItem>
                  <ListItemText>
                    No engagement administators.
                  </ListItemText>
                </ListItem> : ''
            }
            {
              engagementAdmins.map((member, index) => {
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
                      secondaryAction={!isYou && isOrgOwner ?
                        <Tooltip title="Remove Administrator">
                          <IconButton
                            edge="end"
                            onClick={e => openRemoveEngagementUserConfirmatiom(e, member)}>
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
                    {index !== engagementAdmins.length - 1 ? <Divider /> : null}
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
          <LoadingButton
            disabled={isRemovingUser}
            color='error'
            variant='contained'
            size="small"
            loading={isRemovingUser}
            onClick={() => handleRemoveEngagementUser()}>
            Remove
          </LoadingButton>
        </Box>
      </Menu>

      <Menu
        anchorEl={inviteUserMenuAnchor}
        open={inviteUserMenuOpen}
        onClose={handleInviteUserMenuClose}>
        <Box
          style={{ padding: '1rem', minWidth: 300 }}
          component="form"
          onSubmit={handleInviteEngagementUser}>
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
                      style={{ marginLeft: '5px', cursor: 'default' }}
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
              type="submit"
              loading={isInvitingUser}>
              Send Invitation
            </LoadingButton>
          </Box>
        </Box>
      </Menu>
    </>
  );
};
