import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useRef, useState } from 'react';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { Box, TextField, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { inviteClientUser } from '../../api/clients';
import { useOutletContext } from 'react-router-dom';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

export default function InviteClientUserModal({ open, setOpen }) {

  const {
    client,
    org,
    orgUsersMap,
    setOrgUsers,
    openSnackBar
  } = useOutletContext();

  const clientId = client.id;
  const clientName = client.name;
  const orgId = org.id;
  const orgName = org.name;
  const orgBrand = org.brandColor;

  const email = useRef();
  const firstName = useRef();
  const lastName = useRef();
  const [isLoading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleInviteClientUser = async () => {
    const emailVal = email.current.value;
    const firstNameVal = firstName.current.value;
    const lastNameVal = lastName.current.value;

    if (!emailVal) {
      openSnackBar('Please enter an email addres of the new member.', 'error');
      return;
    }

    if (!firstName || !lastName) {
      openSnackBar('Please enter the full name of the new member.', 'error');
      return;
    }

    setLoading(true);

    try {
      const { success, message, userId } = await inviteClientUser({
        email: emailVal,
        clientId,
        orgId,
        clientName,
        orgName,
        firstName: firstNameVal,
        lastName: lastNameVal,
        isAdmin,
        orgBrand
      });

      if (success) {
        openSnackBar('Invitation successfully sent.', 'success');

        const addedUser = {
          id: userId,
          firstName: firstNameVal,
          lastName: lastNameVal,
          email: emailVal
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

  const handleClose = () => {
    setOpen(false);
    setLoading(false);
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Invite someone to {clientName}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the name, email address and permission of the user you would like to invite.
          </DialogContentText>
          <Box sx={{ mt: 2, display: 'flex' }}>
            <TextField
              label="First name"
              sx={{ flexGrow: 1, mr: 1 }}
              autoFocus
              disabled={isLoading}
              inputRef={firstName}
              required>
            </TextField>
            <TextField
              label="Last name"
              sx={{ flexGrow: 1, ml: 1 }}
              disabled={isLoading}
              inputRef={lastName}
              required>
            </TextField>
          </Box>
          <Box sx={{ mt: 2, mb: 2 }}>
            <TextField
              label="Email"
              fullWidth
              disabled={isLoading}
              inputRef={email}
              type="email"
              required>
            </TextField>
          </Box>
          <Box mb={2}>
            <FormGroup>
              <FormControlLabel
                control={<Switch
                  disabled={isLoading}
                  onChange={(_, val) => setIsAdmin(val)}
                />}
                label={<Typography variant='body1'>Administrator access?</Typography>}
              />
            </FormGroup>
          </Box>
          <DialogActions sx={{ p: 0 }}>
            <Button
              disabled={isLoading}
              fullWidth
              variant='outlined'
              onClick={handleClose}>
              Cancel
            </Button>
            <LoadingButton
              variant='contained'
              onClick={handleInviteClientUser}
              required
              fullWidth
              loading={isLoading}>
              Send Invitation
            </LoadingButton>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </div>
  );
};