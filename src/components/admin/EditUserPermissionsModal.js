import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { useState } from 'react';
import { Box, Checkbox, CircularProgress, Divider, Typography, } from '@mui/material';
import { useOutletContext } from 'react-router-dom';
import { updateAccess, updatePermission } from '../../api/users';
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
    setOrgUsers,
    orgUsersMap,
    openSnackBar
  } = useOutletContext();

  const theUser = orgUsersMap[user?.id];

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

        setOrgUsers(Object.values(orgUsersMap));
        setLoading(false);
        openSnackBar('Permission updated.', 'success');
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

        setOrgUsers(Object.values(orgUsersMap));
        setLoading(false);
        openSnackBar('Access updated.', 'success');
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
      <Dialog open={open} onClose={handleClose} PaperProps={{ sx: { minWidth: 900 } }}>
        <DialogContent>
          <DialogContentText display="flex" alignItems="center" sx={{ mb: 1 }}>
            Viewing permissions for&nbsp; <strong>{user?.firstName} {user?.lastName}</strong>
            <CircularProgress
              size={20}
              sx={{
                ml: 1,
                display: isLoading ? 'inline-block' : 'none'
              }}
            />
          </DialogContentText>
          <Typography variant='body2' mt={2}>
            Removing access entirely will automatically unassign all tasks to this user for the associated client.
          </Typography>
          <Box
            mt={3}
            display="flex"
            alignItems="center">
            <Box component="h5" flexBasis="33%" >
              Client
            </Box>
            <Box component="h5" flexBasis="33%" textAlign='center'>
              Access
            </Box>
            <Box component="h5" flexBasis="33%" textAlign='center'>
              Administrator
            </Box>
          </Box>
          <Divider sx={{ my: 1 }} />
          {
            clients.map(client => {
              const isMember = memberOfClientIds.includes(client.id);
              const isAdmin = adminOfClientIds.includes(client.id);

              let clientName = client.name;
              if (clientName.length > 30) {
                clientName = clientName.substring(0, 40) + '...';
              }

              return (
                <Box
                  display="flex"
                  alignItems="center"
                  key={client.id}>
                  <Typography flexBasis="33%">
                    {clientName}
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