import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { useState } from 'react';
import { Box, Checkbox, CircularProgress, Divider, IconButton, ListItemIcon, Menu, MenuItem, Typography, Tooltip } from '@mui/material';
import { useOutletContext } from 'react-router-dom';
import { updateAccess, updatePermission, batchUpdateAccess, batchUpdatePermission } from '../../api/users';
import Switch from '@mui/material/Switch';
import EditIcon from '@mui/icons-material/Edit';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import HelpIcon from '@mui/icons-material/Help';
export default function EditUserPermissionsModal(props) {
  const {
    open,
    setOpen,
    user
  } = props;

  const memberOfEngagementIds = user?.memberOfEngagements.map(({ id }) => id) || [];
  const adminOfEngagementIds = user?.adminOfEngagements.map(({ id }) => id) || [];

  const [bulkAccessMenu, setBulkAccessMenu] = useState(false);
  const [bulkAdminMenu, setBulkAdminMenu] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isEnablingAccess, setEnablingAccess] = useState(false);
  const [isDisablingAccess, setDisablingAccess] = useState(false);
  const [isEnablingAdmin, setEnablingAdmin] = useState(false);
  const [isDisablingAdmin, setDisablingAdmin] = useState(false);

  const bulkAccessMenuOpen = Boolean(bulkAccessMenu);
  const bulkAdminMenuOpen = Boolean(bulkAdminMenu);

  const {
    engagements,
    setOrgUsers,
    orgUsersMap,
    openSnackBar,
    org
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
        userId: user.id,
        orgId: org.id
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
        userId: user.id,
        orgId: org.id
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

  const handleBulkUpdateAccess = async hasAccess => {
    if (hasAccess) {
      setEnablingAccess(true);
    } else {
      setDisablingAccess(true);
    }

    try {
      const { success, message } = await batchUpdateAccess({
        hasAccess,
        userId: user.id,
        orgId: org.id
      });

      if (success) {
        if (hasAccess) {
          theUser.memberOfEngagements = engagements.filter(({ id }) => {
            return !adminOfEngagementIds.includes(id);
          });
        } else {
          theUser.adminOfEngagements = [];
          theUser.memberOfEngagements = [];
        }

        setOrgUsers(Object.values(orgUsersMap));
        setEnablingAccess(false);
        setDisablingAccess(false);
        setBulkAccessMenu(null);
        openSnackBar('Access updated.', 'success');
      } else {
        openSnackBar(message, 'error');
        setEnablingAccess(false);
        setDisablingAccess(false);
      }
    } catch (error) {
      openSnackBar(error.message, 'error');
      setEnablingAccess(false);
      setDisablingAccess(false);
    }
  };

  const handleBulkUpdatePermission = async isAdmin => {
    if (isAdmin) {
      setEnablingAdmin(true);
    } else {
      setDisablingAdmin(true);
    }

    try {
      const { success, message } = await batchUpdatePermission({
        isAdmin,
        userId: user.id,
        orgId: org.id
      });

      if (success) {
        if (isAdmin) {
          theUser.adminOfEngagements = [...theUser.adminOfEngagements, ...theUser.memberOfEngagements];
          theUser.memberOfEngagements = [];
        } else {
          theUser.memberOfEngagements = [...theUser.adminOfEngagements, ...theUser.memberOfEngagements];;
          theUser.adminOfEngagements = [];
        }

        setOrgUsers(Object.values(orgUsersMap));
        setEnablingAdmin(false);
        setDisablingAdmin(false);
        setBulkAdminMenu(null);
        openSnackBar('Permissions updated.', 'success');
      } else {
        openSnackBar(message, 'error');
        setEnablingAdmin(false);
        setDisablingAdmin(false);
      }
    } catch (error) {
      openSnackBar(error.message, 'error');
      setEnablingAdmin(false);
      setDisablingAdmin(false);
    }
  };

  return (
    <>
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
            mb={1}
            mt={3}
            display="flex"
            alignItems="center">
            <Box component="h5" flexBasis="33%" >
              Engagement
            </Box>
            <Box flexBasis="33%" textAlign='center'>
              <Box component="h5">
                <Tooltip
                  title={
                    <>Enabling access will default to read only access.
                      <br></br><br></br>
                      If all engagements are disabled and this window is closed, the user is removed from this list and will need to be re-invited to an engagement.
                    </>
                  }
                  placement="bottom">
                  <HelpIcon
                    fontSize="small"
                    style={{
                      position: 'relative',
                      top: '4px',
                      left: '-5px'
                    }}
                    htmlColor="#c7c7c7"
                  />
                </Tooltip>
                Access
                <IconButton
                  style={{ marginLeft: '3px' }}
                  onClick={e => setBulkAccessMenu(e.currentTarget)}>
                  <EditIcon fontSize='small' />
                </IconButton>
              </Box>
            </Box>
            <Box flexBasis="33%" textAlign='center'>
              <Box component="h5">
                Administrator
                <IconButton style={{ marginLeft: '3px' }}
                  onClick={e => setBulkAdminMenu(e.currentTarget)}>
                  <EditIcon fontSize='small' />
                </IconButton>
              </Box>
            </Box>
          </Box>
          {
            engagements.map(engagement => {
              const isMember = memberOfEngagementIds.includes(engagement.id);
              const isAdmin = adminOfEngagementIds.includes(engagement.id);

              let engagementName = engagement.name;
              if (engagementName.length > 30) {
                engagementName = engagementName.substring(0, 40) + '...';
              }

              return (
                <Box key={engagement.id}>
                  <Box
                    display="flex"
                    alignItems="center">
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
                  <Divider />
                </Box>
              );
            })
          }
        </DialogContent>
      </Dialog>

      <Menu
        anchorEl={bulkAccessMenu}
        open={bulkAccessMenuOpen}
        onClose={() => setBulkAccessMenu(null)}>
        <MenuItem onClick={() => handleBulkUpdateAccess(true)}>
          <ListItemIcon>
            <CheckBoxIcon color='primary' />
          </ListItemIcon>
          Enable all
          <CircularProgress
            hidden={!isEnablingAccess}
            style={{ marginLeft: '5px' }}
            size={17}
          />
        </MenuItem>
        <MenuItem onClick={() => handleBulkUpdateAccess(false)}>
          <ListItemIcon>
            <CheckBoxOutlineBlankIcon color='primary' />
          </ListItemIcon>
          Disable all
          <CircularProgress
            hidden={!isDisablingAccess}
            style={{ marginLeft: '5px' }}
            size={17}
          />
        </MenuItem>
      </Menu>

      <Menu
        anchorEl={bulkAdminMenu}
        open={bulkAdminMenuOpen}
        onClose={() => setBulkAdminMenu(null)}>
        <MenuItem onClick={() => handleBulkUpdatePermission(true)}>
          <ListItemIcon>
            <ToggleOnIcon color='primary' />
          </ListItemIcon>
          Enable all
          <CircularProgress
            hidden={!isEnablingAdmin}
            style={{ marginLeft: '5px' }}
            size={17}
          />
        </MenuItem>
        <MenuItem onClick={() => handleBulkUpdatePermission(false)}>
          <ListItemIcon>
            <ToggleOffIcon />
          </ListItemIcon>
          Disable all
          <CircularProgress
            hidden={!isDisablingAdmin}
            style={{ marginLeft: '5px' }}
            size={17}
          />
        </MenuItem>
      </Menu>
    </>
  );
};