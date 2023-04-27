import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { useState } from 'react';
import { Box, Checkbox, CircularProgress, Divider, Typography, } from '@mui/material';
import { useOutletContext } from 'react-router-dom';
import { updateAccess, updatePermission } from '../../api/user';
import Switch from '@mui/material/Switch';

export default function EditUserPermissionsModal(props) {
  const {
    open,
    setOpen,
    user
  } = props;

  const memberOfClientIds = user?.memberOfClients.map(({ id }) => id) || [];
  const adminOfClientIds = user?.adminOfClients.map(({ id }) => id) || [];

  const [isLoading, setLoading] = useState(false);

  const {
    clients,
    setAccountUsers,
    accountUsersMap,
    openSnackBar
  } = useOutletContext();

  const theUser = accountUsersMap[user?.id];

  const handleUpdatePermission = async (isAdmin, clientObject) => {
    setLoading(true);

    const clientId = clientObject.id;
    const clientName = clientObject.name;

    try {
      const { success, message } = await updatePermission({
        isAdmin,
        clientId,
        userId: user.id
      });

      if (success) {
        if (isAdmin) {
          theUser.memberOfClients = theUser.memberOfClients.filter(c => c.id !== clientId);
          theUser.adminOfClients.push({
            id: clientId,
            name: clientName
          });
        } else {
          theUser.adminOfClients = theUser.adminOfClients.filter(c => c.id !== clientId);
          theUser.memberOfClients.push({
            id: clientId,
            name: clientName
          });
        }

        setAccountUsers(Object.values(accountUsersMap));
        setLoading(false);
        openSnackBar('Permission successfully updated.', 'success');
      } else {
        openSnackBar(message, 'error');
        setLoading(false);
      }
    } catch (error) {
      openSnackBar(error.message, 'error');
      setLoading(false);
    }
  };

  const handleUpdateAccess = async (hasAccess, clientObject) => {
    setLoading(true);

    const clientId = clientObject.id;
    const clientName = clientObject.name;

    try {
      const { success, message } = await updateAccess({
        hasAccess,
        clientId,
        userId: user.id
      });

      if (success) {
        if (hasAccess) {
          theUser.memberOfClients.push({
            id: clientId,
            name: clientName
          });
        } else {
          theUser.adminOfClients = theUser.adminOfClients.filter(c => c.id !== clientId);
          theUser.memberOfClients = theUser.memberOfClients.filter(c => c.id !== clientId);
        }

        setAccountUsers(Object.values(accountUsersMap));
        setLoading(false);
        openSnackBar('Successfully updated.', 'success');
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
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent sx={{ minWidth: 550 }}>
          <DialogContentText display="flex" alignItems="center" sx={{ mb: 1 }}>
            Viewing permissions for {user?.firstName} {user?.lastName}
            <CircularProgress
              size={20}
              sx={{
                ml: 1,
                display: isLoading ? 'inline-block' : 'none'
              }}
            />
          </DialogContentText>
          <Typography variant='caption' mt={2}>
            Removing access entirely will automatically unassign all tasks to this user for the selected client.
          </Typography>
          <Box
            mt={3}
            display="flex"
            alignItems="center">
            <Box component="h5" flexBasis="33%" >
              Client
            </Box>
            <Box component="h5" flexBasis="33%" textAlign='center'>
              Can Access
            </Box>
            <Box component="h5" flexBasis="33%" textAlign='center'>
              Is Administrator
            </Box>
          </Box>
          <Divider sx={{ my: 1 }} />
          {
            clients.map(client => {
              const isMember = memberOfClientIds.includes(client.id);
              const isAdmin = adminOfClientIds.includes(client.id);

              return (
                <Box
                  display="flex"
                  alignItems="center"
                  key={client.id}>
                  <Typography flexBasis="33%">
                    {client.name}
                  </Typography>
                  <Box flexBasis='33%' textAlign='center'>
                    <Checkbox
                      checked={isMember || isAdmin}
                      onChange={(_, isChecked) => handleUpdateAccess(isChecked, client)}
                    />
                  </Box>
                  <Box flexBasis='33%' textAlign='center'>
                    <Switch
                      disabled={!isMember && !isAdmin}
                      onChange={(_, isChecked) => handleUpdatePermission(isChecked, client)}
                      checked={isAdmin}
                    />
                  </Box>
                </Box>
              );
            })
          }
        </DialogContent>
      </Dialog>
    </div>
  );
};