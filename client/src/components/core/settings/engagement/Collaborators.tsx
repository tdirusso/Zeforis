import { Box, Collapse, MenuItem, Paper, Select, SelectChangeEvent, TextField, Typography, useTheme } from "@mui/material";
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
import { validate } from "email-validator";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { getErrorObject } from "src/lib/utils";
import { createInvitations } from "src/api/invitations";
import DoneIcon from '@mui/icons-material/Done';

type InviteRow = {
  email: string;
  role: 'member' | 'admin';
  errors: {
    email?: string,
    role?: string;
  };
  id: string;
};

type InviteError = {
  message?: string,
  errors?: [];
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
    setTasks,
    setInvitations
  } = useOutletContext<AppContext>();

  const theme = useTheme();

  const engagementId = engagement.id;

  const [userToRemove, setUserToRemove] = useState<User | null>(null);
  const [isRemovingUser, setRemovingUser] = useState(false);
  const [removeUserMenuAnchor, setRemoveUserMenuAnchor] = useState<Element | null>(null);
  const [inviteRows, setInviteRows] = useState<InviteRow[]>([{ email: '', role: 'member', id: uuid(), errors: {} }]);
  const [isInvitingUsers, setInvitingUsers] = useState(false);
  const [inviteError, setInviteError] = useState<InviteError>({});
  const [invitesSent, setInvitesSent] = useState(false);

  const handleAddInviteRow = () => {
    setInviteRows([...inviteRows, { email: '', role: 'member', id: uuid(), errors: {} }]);
  };

  const handleInputChange = (index: number, event: SelectChangeEvent | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target as { name: keyof InviteRow, value: string; }; // Asserting types
    const newRows = [...inviteRows];

    if (name === 'role') {
      if (value === 'admin' || value === 'member') {
        newRows[index][name as keyof InviteRow] = value;
      }
    } else {
      newRows[index][name] = value;
    }

    newRows[index].errors[name as keyof InviteRow['errors']] = '';
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

  const handleInviteUsers = async () => {
    const newRows = [...inviteRows];
    const emailSet = new Set();

    newRows.forEach(inviteRow => {
      const { email } = inviteRow;

      if (!email) {
        inviteRow.errors.email = 'Please enter an email address';
      }

      const lowerEmail = email.toLowerCase();

      if (!validate(lowerEmail)) {
        inviteRow.errors.email = 'Invalid email address format';
      } else if (emailSet.has(lowerEmail)) {
        inviteRow.errors.email = 'Duplicate email address';
      } else if (lowerEmail === user.email) {
        inviteRow.errors.email = 'Cannot invite yourself';
      } else {
        emailSet.add(lowerEmail);
      }
    });

    if (hasInviteErrors()) {
      setInviteRows(newRows);
      return;
    }

    setInvitingUsers(true);
    setInviteError({});

    try {
      const invitations = await createInvitations(engagementId, {
        users: inviteRows
      });


      setInvitations(prevInvitations => [...prevInvitations, ...invitations]);
      setInvitesSent(true);
      // setTimeout(() => {
      //   setInvitesSent(true);
      // }, 2000);
    } catch (error) {
      setInviteError(getErrorObject(error));
      setInvitingUsers(false);
    }
  };



  const hasInviteErrors = () => {
    return inviteRows.some(inviteRow => Object.values(inviteRow.errors).some(value => value));
  };

  const handleResetInviteRows = () => {
    setInviteRows([{ email: '', role: 'member', id: uuid(), errors: {} }]);
    setInvitingUsers(false);
    setInvitesSent(false);
  };

  return (
    <Box className="Members">
      <Typography variant="h1">Members</Typography>
      <Typography my={2}>Manage members in {engagement.name}</Typography>
      <Paper className="new-invites-container">
        <Box className="flex-sb">
          <Typography>Invite new members by email address.</Typography>
          <Button
            onClick={() => openModal('invite-link')}
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
                    error={Boolean(row.errors.email)}
                    helperText={row.errors.email ? row.errors.email : ''}
                    autoComplete="off"
                    placeholder="user@example.com"
                    size="small"
                    variant="outlined"
                    disabled={isInvitingUsers}
                    fullWidth
                    name="email"
                    value={row.email}
                    onChange={(event) => handleInputChange(index, event)}
                  />

                  <Select
                    disabled={isInvitingUsers}
                    name="role"
                    size="small"
                    value={row.role}
                    onChange={(event) => handleInputChange(index, event)}>
                    <MenuItem value="member">Member</MenuItem>
                    <MenuItem value="admin">Administrator</MenuItem>
                  </Select>
                  <IconButton
                    style={{
                      alignSelf: 'start',
                      height: '42px'
                    }}
                    disabled={inviteRows.length === 1 || isInvitingUsers}
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
              disabled={isInvitingUsers}
              size="small"
              onClick={handleAddInviteRow}
              className="btn-default"
              variant="outlined"
              startIcon={<AddCircleOutlineIcon />}>
              Add more
            </Button>
          </Box>

          <Divider className="my3" />
          <Box className="flex-sb">

            <Box>
              <Box hidden={!inviteError.message}>
                <Box className="flex-ac" gap='14px'>
                  <ErrorOutlineIcon fontSize="small" color="error" />
                  <Box>
                    <Typography color="error">
                      {inviteError.message}
                    </Typography>
                    {
                      inviteError.errors?.map((error, index) => {
                        return (
                          <Typography color="error">
                            {index + 1}.  {error}
                          </Typography>
                        );
                      })
                    }
                  </Box>
                </Box>
              </Box>

              <Box hidden={!invitesSent} className='flex-ac' gap='14px'>
                <Box>
                  <DoneIcon fontSize="small" color="success" />
                </Box>
                <Box>
                  <Typography color={theme.palette.success.main}>
                    Invitations sent successfully.
                  </Typography>
                  <Typography color={theme.palette.success.main}>
                    Status can be viewed in "Pending Invitations" below.
                  </Typography>
                </Box>
              </Box>
            </Box>


            <Box ml='auto'>
              {
                invitesSent ?
                  <Button
                    onClick={handleResetInviteRows}
                    variant="contained">
                    Send more
                  </Button> :
                  <LoadingButton
                    sx={{
                      '& .MuiButton-endIcon': {
                        margin: 0
                      }
                    }}
                    loadingPosition="end"
                    endIcon={<></>}
                    loading={isInvitingUsers}
                    onClick={handleInviteUsers}
                    variant="contained">
                    {isInvitingUsers ? <Box mr='25px'>Sending invitations</Box> : 'Invite'}
                  </LoadingButton>
              }
            </Box>
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
