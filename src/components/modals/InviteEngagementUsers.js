import Dialog from '@mui/material/Dialog';
import { useRef, useState } from 'react';
import Button from '@mui/material/Button';
import { LoadingButton } from '@mui/lab';
import { Alert, Autocomplete, Box, FormControl, Grow, Paper, TextField, Typography } from '@mui/material';
import BuildIcon from '@mui/icons-material/Build';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import validator from 'email-validator';
import { inviteEngagementUsers } from '../../api/engagements';
import { appLimits } from '../../lib/constants';
import { Link } from 'react-router-dom';

const inviteLimit = appLimits.simultaneousEmailInvites;

export default function InviteEngagementUsers(props) {

  const {
    close,
    isOpen,
    openSnackBar,
    org,
    orgUsers,
    engagement,
    user,
    orgUsersMap,
    setOrgUsers
  } = props;

  const userId = user.id;
  const engagementId = engagement.id;
  const engagementName = engagement.name;
  const orgId = org.id;
  const orgName = org.name;
  const orgLogo = org.logo;
  const orgColor = org.brandColor;

  const [inviteType, setInviteType] = useState(null);
  const [inviteeUsers, setInviteeUsers] = useState([]);
  const [animateOptions, setAnimateOptions] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const emailRef = useRef();

  const allowedToInvite = orgUsers.filter(orgUser => {
    return (
      orgUser.id !== userId
      &&
      ![...orgUser.memberOfEngagements, ...orgUser.adminOfEngagements].some(eng => eng.id === engagementId)
    );
  });

  const handleInviteTypeChange = type => {
    if (!inviteType) {
      setInviteType(type);
      setAnimateOptions(true);
      setTimeout(() => {
        emailRef.current.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    } else {
      setAnimateOptions(false);
      setTimeout(() => {
        setInviteType(type);
        setAnimateOptions(true);
        setTimeout(() => {
          emailRef.current.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      }, 150);
    }
  };

  const handleClose = () => {
    close();
    setTimeout(() => {
      setInviteeUsers([]);
      setInviteType(null);
      setLoading(false);
      setAnimateOptions(false);
    }, 500);
  };

  const handleEmailChange = (e, newVal) => {
    const isNewOrgUser =
      typeof newVal[newVal.length - 1] !== 'object'
      && typeof newVal[newVal.length - 1] !== 'undefined';

    setInviteeUsers(isNewOrgUser ? [...inviteeUsers, { email: e.target.value.toLowerCase() }] : newVal);
  };

  let invalidEmails = [];
  let newEmailCount = 0;

  inviteeUsers.forEach(userObject => {
    if (!validator.validate(userObject.email)) {
      invalidEmails.push(userObject.email);
    }

    if (!userObject.id) {
      newEmailCount++;
    }
  });

  const handleInviteUsers = async () => {
    if (!inviteeUsers.length) {
      openSnackBar("Please enter at least 1 user to add.");
      return;
    }

    if (inviteeUsers.some(({ email }) => email === user.email)) {
      openSnackBar(`You cannot invite yourself (${user.email}) to an engagement.`);
      return;
    }

    setLoading(true);

    try {
      const {
        success,
        message,
        invitedUsers
      } = await inviteEngagementUsers({
        usersToInvite: inviteeUsers,
        engagementId,
        orgId,
        engagementName,
        orgName,
        inviteType,
        orgColor,
        orgLogo
      });

      if (success) {
        const engagementData = { id: engagementId, name: engagementName };
        invitedUsers.forEach(invitedUser => {

          if (invitedUser.isNew || !orgUsersMap[invitedUser.id]) {
            //a completely new user was created for this email, and thus, is new to the org, or was not part of the org
            orgUsersMap[invitedUser.id] = {
              id: invitedUser.id,
              email: invitedUser.email,
              firstName: invitedUser.firstName || '',
              lastName: invitedUser.lastName || '',
              memberOfEngagements: inviteType === 'member' ? [engagementData] : [],
              adminOfEngagements: inviteType === 'admin' ? [engagementData] : []
            };
          } else {
            //user is already a part of this org
            const existingUser = orgUsersMap[invitedUser.id];
            const userIsMember = existingUser.memberOfEngagements.find(({ id }) => id === engagementId);
            const userIsAdmin = existingUser.adminOfEngagements.find(({ id }) => id === engagementId);


            if (inviteType === 'admin') {
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
          }
        });

        setOrgUsers(Object.values(orgUsersMap));
        setLoading(false);
        openSnackBar('Invitation successfully sent.', 'success');
        handleClose();
      } else {
        openSnackBar(message, 'error');
        setLoading(false);
      }
    } catch (error) {
      openSnackBar(error.message, 'error');
      setLoading(false);
    }
  };

  return (
    <Dialog
      PaperProps={{ className: `invite-paper ${inviteType ? 'sel' : ''}` }}
      open={isOpen}
      onClose={handleClose}
      className='modal invite-dialog'>
      <Box textAlign='center' component="h2" mb='2rem' fontWeight={300}>Add Collaborators</Box>
      <Box className='invite-types' mb='3rem'>
        <Paper className={`invite-type ${inviteType === 'member' ? 'selected' : ''}`}>
          <Box fontSize='3rem' mb='1rem'>
            <AccountCircleIcon fontSize='3rem' htmlColor='#b9b9b9' />
          </Box>
          <Box component='h3' mb='2rem'>Client</Box>
          <Button
            disabled={isLoading}
            onClick={() => handleInviteTypeChange('member')}
            size='large'
            variant='contained'
            fullWidth>
            Select
          </Button>
        </Paper>
        <Paper className={`invite-type ${inviteType === 'admin' ? 'selected' : ''}`}>
          <Box fontSize='3rem' mb='1rem'>
            <BuildIcon fontSize='3rem' htmlColor='#b9b9b9' />
          </Box>
          <Box component='h3' mb='2rem'>Administrator</Box>
          <Button
            disabled={isLoading}
            onClick={() => handleInviteTypeChange('admin')}
            size='large'
            variant='contained'
            fullWidth>
            Select
          </Button>
        </Paper>
      </Box>
      <Grow in={animateOptions} appear={false}>
        {
          inviteType === 'admin' && user.plan === 'free' ?
            <Box mb='1rem' style={{ display: inviteType ? 'block' : 'none' }}>
              <Alert severity="info" >
                <Box className='flex-centered' style={{ justifyContent: 'space-between' }}>
                  <Typography flexBasis='66%'>
                    You can't invite additional administrators if you are on the <strong>free</strong> plan.
                  </Typography>
                  <Box>
                    <Link to='settings/account?plan' onClick={handleClose}>
                      <Button variant='contained'>
                        Upgrade now
                      </Button>
                    </Link>
                  </Box>
                </Box>
              </Alert>
            </Box>
            :
            <Box display={inviteType ? 'block' : 'none'}>
              <FormControl fullWidth>
                <Autocomplete
                  freeSolo
                  filterOptions={(array, state) => {
                    const lcVal = state.inputValue.toLowerCase();

                    return array.filter(
                      orgUser =>
                        `${orgUser.firstName} ${orgUser.lastName}`.toLowerCase().includes(lcVal)
                        || orgUser.email.toLowerCase().includes(lcVal)
                    );
                  }}
                  filterSelectedOptions
                  disableCloseOnSelect
                  multiple
                  renderOption={(props, option) =>
                    <li {...props} key={option.id}>
                      {option.firstName} {option.lastName}
                      <Typography variant='caption' ml={1.5} color='#828282'>{option.email}</Typography>
                    </li>
                  }
                  options={allowedToInvite}
                  getOptionLabel={(option) => option.id ? `${option.firstName} ${option.lastName} ${option.email}` : option.email}
                  isOptionEqualToValue={(option, value) => option.email === value.email}
                  onChange={handleEmailChange}
                  value={inviteeUsers}
                  renderInput={(params) => (
                    <TextField
                      inputRef={emailRef}
                      helperText={
                        <>
                          Select existing users from {org.name} or add new email addresses.
                        </>
                      }
                      {...params}
                      label="Email Addresses"
                      InputProps={{
                        ...params.InputProps
                      }}
                    />
                  )}
                />
              </FormControl>
              <Box>
                <Typography my={1} px={1} variant='body2' color='error'>
                  {invalidEmails.length > 0 ? `Invalid emails:  ${invalidEmails.join(', ')}` : ''}
                </Typography>
                <Typography my={1} px={1} variant='body2' color='error'>
                  {newEmailCount > inviteLimit ? `A maximum of ${inviteLimit} new invitations can be sent at once.` : ''}
                </Typography>
              </Box>
              <Box mt='3rem'>
                <LoadingButton
                  onClick={handleInviteUsers}
                  loading={isLoading}
                  variant='contained'
                  fullWidth
                  size='large'>
                  Add
                </LoadingButton>
              </Box>
            </Box>
        }
      </Grow>
    </Dialog>
  );
};
