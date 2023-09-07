import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { useState } from 'react';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { LoadingButton } from '@mui/lab';
import { deleteOrg } from '../../api/orgs';
import { Alert, Autocomplete, Box, FormControl, Grow, Paper, TextField, Typography } from '@mui/material';
import BuildIcon from '@mui/icons-material/Build';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import validator from 'email-validator';

const inviteLimit = 3;

export default function InviteEngagementUser(props) {

  const {
    close,
    isOpen,
    openSnackBar,
    org,
    engagementAdmins,
    engagementMembers,
    orgUsers,
    engagement,
    user
  } = props;

  const userId = user.id;
  const engagementId = engagement.id;

  const [inviteType, setInviteType] = useState(null);
  const [inviteeEmails, setInviteeEmails] = useState([]);
  const [animateOptions, setAnimateOptions] = useState(false);
  const [isLoading, setLoading] = useState(false);

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
    } else {
      setAnimateOptions(false);
      setTimeout(() => {
        setInviteType(type);
        setAnimateOptions(true);
      }, 150);
    }
  };

  const handleClose = () => {
    close();
    setTimeout(() => {
      setInviteeEmails([]);
      setInviteType(null);
      setLoading(false);
    }, 500);
  };

  const handleEmailChange = (e, newVal) => {
    const isNewEmail =
      typeof newVal[newVal.length - 1] !== 'object'
      && typeof newVal[newVal.length - 1] !== 'undefined';

    setInviteeEmails(isNewEmail ? [...inviteeEmails, { email: e.target.value }] : newVal);
  };

  let invalidEmails = [];
  let newEmailCount = 0;

  inviteeEmails.forEach(userObject => {
    if (!validator.validate(userObject.email)) {
      invalidEmails.push(userObject.email);
    }

    if (!userObject.id) {
      newEmailCount++;
    }
  });

  return (
    <Dialog
      PaperProps={{ className: `invite-paper ${inviteType ? 'sel' : ''}` }}
      open={isOpen}
      onClose={handleClose}
      className='modal invite-dialog'>
      <Box textAlign='center' component="h2" mb='2rem' fontWeight={300}>Add Collaborators</Box>
      <Box className='invite-types' mb='3rem'>
        <Paper className={`invite-type ${inviteType === 'client' ? 'selected' : ''}`}>
          <Box fontSize='3rem' mb='1rem'>
            <AccountCircleIcon fontSize='3rem' htmlColor='#b9b9b9' />
          </Box>
          <Box component='h3' mb='2rem'>Client</Box>
          <Button
            onClick={() => handleInviteTypeChange('client')}
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
            <Box mb='3rem'>
              <Alert severity="info">
                <strong>Note: &nbsp;</strong>Before you start manually creating tasks,
                there is a tool to bulk import tasks on the
              </Alert>
            </Box>
            :
            <Box>
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
                  value={inviteeEmails}
                  renderInput={(params) => (
                    <TextField
                      helperText={
                        <>
                          Select existing users from {org.name} or add new email addresses.
                          <br></br>
                          Only new email addresses will be sent an invitation email link to join.
                          Existing users from {org.name} will recieve an in-app notification.
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
                <Button
                  variant='contained'
                  fullWidth
                  size='large'>
                  Add
                </Button>
              </Box>
            </Box>
        }
      </Grow>

    </Dialog>
  );
};
