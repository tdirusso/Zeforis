import { Box, Collapse, FormControlLabel, Paper, TextField, Typography } from "@mui/material";
import { Divider, Button, Chip, Tooltip, Menu } from "@mui/material";
import { Link, useOutletContext } from "react-router-dom";
import React, { useState } from "react";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { LoadingButton } from "@mui/lab";
import { removeEngagementUser } from "../../../../api/engagements";
import { AppContext } from "src/types/AppContext";
import { User } from "@shared/types/User";
import LinkIcon from '@mui/icons-material/Link';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { TransitionGroup } from "react-transition-group";
import { v4 as uuid } from 'uuid';

type InviteRow = {
  email: string;
  role: string;
  id: string;
};

export default function Collaborators() {

  const {
    engagement,
    engagementMembers,
    engagementAdmins,
    user,
    openSnackBar,
    setOrgUsers,
    orgUsersMap,
    org,
    isOrgOwner,
    openModal,
    tasks,
    setTasks
  } = useOutletContext<AppContext>();

  const engagementId = engagement.id;

  const [userToRemove, setUserToRemove] = useState<User | null>(null);
  const [isRemovingUser, setRemovingUser] = useState(false);
  const [removeUserMenuAnchor, setRemoveUserMenuAnchor] = useState<Element | null>(null);
  const [inviteRows, setInviteRows] = useState<InviteRow[]>([{ email: '', role: '', id: uuid() }]);

  const handleAddInviteRow = () => {
    setInviteRows([...inviteRows, { email: '', role: '', id: uuid() }]);
  };

  const handleInputChange = (index: number, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    const newRows = [...inviteRows];
    newRows[index][name as keyof InviteRow] = value;
    setInviteRows(newRows);
  };


  const removeUserMenuOpen = Boolean(removeUserMenuAnchor);

  const openRemoveEngagementUserConfirmatiom = (e: React.MouseEvent, userObject: User) => {
    setRemoveUserMenuAnchor(e.currentTarget);
    setUserToRemove(userObject);
  };

  const handleRemoveEngagementUser = async () => {
    setRemovingUser(true);

    if (!userToRemove) {
      return;
    }

    const willBeRemovedFromOrg =
      (userToRemove.memberOfEngagements || []).length + (userToRemove.adminOfEngagements || []).length === 1;

    try {
      const result = await removeEngagementUser(engagementId, userToRemove.id);

      const success = result.success;
      const resultMessage = result.message;

      if (success) {
        if (willBeRemovedFromOrg) {
          setOrgUsers(orgUsers => orgUsers.filter(u => u.id !== userToRemove.id));
        } else {
          const theUser = orgUsersMap[userToRemove.id];
          theUser.memberOfEngagements = (theUser.memberOfEngagements || []).filter(engagement => engagement.id !== engagementId);
          theUser.adminOfEngagements = (theUser.adminOfEngagements || []).filter(engagement => engagement.id !== engagementId);
          setOrgUsers(Object.values(orgUsersMap));
        }

        const tasksClone = [...tasks];
        tasksClone.forEach(task => {
          if (task.assigned_to_id && task.assigned_to_id === userToRemove.id) {
            task.assigned_to_id = null;
          }
        });
        setTasks(tasksClone);

        setRemoveUserMenuAnchor(null);
        setRemovingUser(false);
        openSnackBar('Successully removed.', 'success');
      } else {
        openSnackBar(resultMessage, 'error');
        setRemovingUser(false);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        openSnackBar(error.message, 'error');
        setRemovingUser(false);
      }
    }
  };

  const handleRemoveInviteRow = (index: number) => {
    const newRows = [...inviteRows];
    newRows.splice(index, 1);
    setInviteRows(newRows);
  };

  return (
    <Box className="Members">
      <Typography variant="h1">Members</Typography>
      <Typography my={2}>Manage members in {engagement.name}</Typography>
      <Paper className="new-invites-container">
        <Box className="flex-sb">
          <Typography>Invite new members by email address.</Typography>
          <Button
            className="btn-default"
            variant="outlined"
            startIcon={<LinkIcon style={{ transform: 'rotate(-45deg)' }} />}>
            Invite link
          </Button>
        </Box>
        <Divider className="my2" />

        <Box className="new-invite-row" pl='3px'>
          <Typography>Email Address</Typography>
          <Typography>Role</Typography>
          <IconButton
            style={{ visibility: 'hidden' }}
            className="btn-default">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <Box mt={-1}>
          <TransitionGroup>
            {inviteRows.map((row, index) => (
              <Collapse key={row.id} style={{ transitionDuration: '200ms' }}>

                <Box className="new-invite-row" mt={1.5}>
                  <TextField
                    autoComplete="off"
                    placeholder="user@example.com"
                    size="small"
                    variant="outlined"
                    disabled={false}
                    fullWidth
                    name="email"
                    value={row.email}
                    onChange={(event) => handleInputChange(index, event)}
                  />
                  <TextField
                    size="small"
                    variant="outlined"
                    disabled={false}
                    fullWidth
                    name="role"
                    value={row.role}
                    onChange={(event) => handleInputChange(index, event)}
                  />
                  <IconButton
                    disabled={inviteRows.length === 1}
                    onClick={() => handleRemoveInviteRow(index)}
                    className="btn-default">
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Collapse>
            ))}
          </TransitionGroup>

          <Box mt={2}>
            <Button
              onClick={handleAddInviteRow}
              className="btn-default"
              variant="outlined"
              startIcon={<AddCircleOutlineIcon />}>
              Add more
            </Button>
          </Box>
        </Box>
      </Paper>
      <Box mt={3}>
        <Box className="flex-ac" mb='2rem' hidden={!isOrgOwner}>
          <Button
            variant="outlined"
            style={{ whiteSpace: 'break-spaces' }}
            onClick={() => openModal('invite-engagement-users')}>
            Add collaborators
          </Button>
          <Typography variant="body2" ml={3} hidden={engagementAdmins.length + engagementMembers.length === 1}>
            <Link to="../../organization/members">Manage permissions &rarr;</Link>
          </Typography>
        </Box>
        <Box>
          <Divider textAlign="left">
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

        <Box>
          <Divider textAlign="left">
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
    </Box>
  );
};
