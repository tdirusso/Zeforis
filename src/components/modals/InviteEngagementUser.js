import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { useState } from 'react';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { LoadingButton } from '@mui/lab';
import { deleteOrg } from '../../api/orgs';
import { Autocomplete, Box, FormControl, InputAdornment, Paper, TextField, Typography } from '@mui/material';
import BuildIcon from '@mui/icons-material/Build';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
export default function InviteEngagementUser(props) {

  const {
    close,
    isOpen,
    openSnackBar,
    org,
    engagementAdmins,
    engagementMembers,
    orgUsers
  } = props;

  const [inviteType, setInviteType] = useState(null);
  const [inviteeEmails, setInviteeEmails] = useState([]);
  const [isLoading, setLoading] = useState(false);


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

  return (
    <Dialog open={isOpen} onClose={handleClose} className='modal invite-dialog'>
      <Box textAlign='center' component="h2" mb='2rem' fontWeight={300}>Add a Collaborator</Box>
      <Box className='invite-types' mb='1rem'>
        <Paper className={`invite-type ${inviteType === 'client' ? 'selected' : ''}`}>
          <Box fontSize='3rem' mb='1rem'>
            <AccountCircleIcon fontSize='3rem' htmlColor='#b9b9b9' />
          </Box>
          <Box component='h3' mb='2rem'>Client</Box>
          <Button
            onClick={() => setInviteType('client')}
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
            onClick={() => setInviteType('admin')}
            size='large'
            variant='contained'
            fullWidth>
            Select
          </Button>
        </Paper>
      </Box>
      {
        !inviteType ? null :
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
                options={orgUsers}
                getOptionLabel={(option) => option.firstName ? `${option.firstName} ${option.lastName} ${option.email}` : option.email}
                isOptionEqualToValue={(option, value) => option.email === value.email}
                onChange={handleEmailChange}
                value={inviteeEmails}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Assigned To"
                    InputProps={{
                      ...params.InputProps
                    }}
                  />
                )}
              />
            </FormControl>
          </Box>
      }
    </Dialog>
  );
};
