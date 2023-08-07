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

  const memberOfEngagementIds = user?.memberOfEngagements.map(({ id }) => id) || [];
  const adminOfEngagementIds = user?.adminOfEngagements.map(({ id }) => id) || [];

  const [isLoading, setLoading] = useState(false);

  const {
    engagements,
    setOrgUsers,
    orgUsersMap,
    openSnackBar
  } = useOutletContext();

  const theUser = orgUsersMap[user?.id];

  const handleUpdatePermission = async (isAdmin, engagementObject) => {
    setLoading(true);

    const engagementId = engagementObject.id;
    const engagementName = engagementObject.name;

    try {
      const { success, message } = await updatePermission({
        isAdmin,
        engagementId,
        userId: user.id
      });

      if (success) {
        if (isAdmin) {
          theUser.memberOfEngagements = theUser.memberOfEngagements.filter(c => c.id !== engagementId);
          theUser.adminOfEngagements.push({
            id: engagementId,
            name: engagementName
          });
        } else {
          theUser.adminOfEngagements = theUser.adminOfEngagements.filter(c => c.id !== engagementId);
          theUser.memberOfEngagements.push({
            id: engagementId,
            name: engagementName
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

  const handleUpdateAccess = async (hasAccess, engagementObject) => {
    setLoading(true);

    const engagementId = engagementObject.id;
    const engagementName = engagementObject.name;

    try {
      const { success, message } = await updateAccess({
        hasAccess,
        engagementId,
        userId: user.id
      });

      if (success) {
        if (hasAccess) {
          theUser.memberOfEngagements.push({
            id: engagementId,
            name: engagementName
          });
        } else {
          theUser.adminOfEngagements = theUser.adminOfEngagements.filter(c => c.id !== engagementId);
          theUser.memberOfEngagements = theUser.memberOfEngagements.filter(c => c.id !== engagementId);
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
      <Dialog open={open} onClose={handleClose} PaperProps={{ style: { minWidth: 900 } }}>
        <DialogContent>
          <DialogContentText style={{ marginBottom: '1rem' }} className='flex-ac'>
            Viewing permissions for&nbsp; <strong>{user?.firstName} {user?.lastName}</strong>
            <CircularProgress
              size={20}
              style={{
                marginLeft: '0.5rem',
                display: isLoading ? 'inline-block' : 'none'
              }}
            />
          </DialogContentText>
          <Typography variant='body2' mt={2}>
            Removing access entirely will automatically unassign all tasks to this user for the associated engagement.
          </Typography>
          <Box
            mt={3}
            display="flex"
            alignItems="center">
            <Box component="h5" flexBasis="33%" >
              Engagement
            </Box>
            <Box component="h5" flexBasis="33%" textAlign='center'>
              Access
            </Box>
            <Box component="h5" flexBasis="33%" textAlign='center'>
              Administrator
            </Box>
          </Box>
          <Divider style={{ margin: '0.5rem 0' }} />
          {
            engagements.map(engagement => {
              const isMember = memberOfEngagementIds.includes(engagement.id);
              const isAdmin = adminOfEngagementIds.includes(engagement.id);

              let engagementName = engagement.name;
              if (engagementName.length > 30) {
                engagementName = engagementName.substring(0, 40) + '...';
              }

              return (
                <Box
                  display="flex"
                  alignItems="center"
                  key={engagement.id}>
                  <Typography flexBasis="33%">
                    {engagementName}
                  </Typography>
                  <Box flexBasis='33%' textAlign='center'>
                    <Checkbox
                      checked={isMember || isAdmin}
                      onChange={(_, isChecked) => handleUpdateAccess(isChecked, engagement)}
                    />
                  </Box>
                  <Box flexBasis='33%' textAlign='center'>
                    <Switch
                      disabled={!isMember && !isAdmin}
                      onChange={(_, isChecked) => handleUpdatePermission(isChecked, engagement)}
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