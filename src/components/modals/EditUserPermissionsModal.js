import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { useState } from 'react';
import { Box, Checkbox, CircularProgress, Divider, IconButton, ListItemIcon, Menu, MenuItem, Typography, Tooltip, useMediaQuery, DialogTitle } from '@mui/material';
import { updateAccess, updatePermission, batchUpdateAccess, batchUpdatePermission } from '../../api/users';
import Switch from '@mui/material/Switch';
import EditIcon from '@mui/icons-material/Edit';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import HelpIcon from '@mui/icons-material/Help';
import CloseIcon from '@mui/icons-material/Close';

export default function EditUserPermissionsModal(props) {
  const {
    isOpen,
    close,
    user,
    engagements,
    setOrgUsers,
    orgUsersMap,
    openSnackBar,
    org
  } = props;

  const isSmallScreen = useMediaQuery('(max-width: 800px)');

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
    close();
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
      <Dialog
        className='modal'
        fullScreen={isSmallScreen}
        open={isOpen}
        onClose={handleClose}
        PaperProps={{
          className: 'permissions-dialog'
        }}>
        <Box ml={1.5}>
          <IconButton
            onClick={handleClose}>
            <CloseIcon
            />
          </IconButton>
        </Box>
        <DialogTitle style={{ paddingTop: 0, paddingBottom: 0 }} component={Box}>
          Edit Permissions
          <Box className='flex-ac'>
            <Typography>
              {user?.firstName} {user?.lastName}  ({user?.email})
            </Typography>
            <CircularProgress
              size={20}
              style={{
                marginLeft: '0.5rem',
                display: isLoading ? 'inline-block' : 'none'
              }}
            />
          </Box>
          <Box
            mb={1}
            mt={1}
            display="flex"
            alignItems="center">
            <Box component="h5" flexBasis="55%" >
              Engagement
            </Box>
            <Box flexBasis="22%" textAlign='center'>
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
            <Box flexBasis="22" textAlign='center'>
              <Box component="h5">
                Admin.
                <IconButton style={{ marginLeft: '3px' }}
                  onClick={e => setBulkAdminMenu(e.currentTarget)}>
                  <EditIcon fontSize='small' />
                </IconButton>
              </Box>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent className='content'>
          {
            engagements.map(engagement => {
              const isMember = memberOfEngagementIds.includes(engagement.id);
              const isAdmin = adminOfEngagementIds.includes(engagement.id);

              let engagementName = engagement.name;
              if (engagementName.length > 30) {
                engagementName = engagementName.substring(0, 30) + '...';
              }

              return (
                <Box key={engagement.id}>
                  <Box
                    display="flex"
                    alignItems="center">
                    <Typography flexBasis="55%">
                      {engagementName}
                    </Typography>
                    <Box flexBasis='20%' textAlign='center'>
                      <Checkbox
                        checked={isMember || isAdmin}
                        onChange={(_, isChecked) => handleUpdateAccess(isChecked, engagement)}
                      />
                    </Box>
                    <Box flexBasis='20%' textAlign='center'>
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