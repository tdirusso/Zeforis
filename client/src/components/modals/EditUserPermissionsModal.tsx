import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { useState } from 'react';
import { Box, Checkbox, CircularProgress, Divider, IconButton, ListItemIcon, Menu, MenuItem, Typography, Tooltip, useMediaQuery, DialogTitle, DialogContentText, Button } from '@mui/material';
import { batchUpdatePermission } from '../../api/users';
import { updateAccess } from '../../api/orgs';
import { updateUserPermissions } from '../../api/engagements';
import Switch from '@mui/material/Switch';
import EditIcon from '@mui/icons-material/Edit';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import HelpIcon from '@mui/icons-material/Help';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';
import { User } from '@shared/types/User';
import { Engagement } from '@shared/types/Engagement';
import { AppContext } from 'src/types/AppContext';
import { Org } from '@shared/types/Org';
import { Task } from '@shared/types/Task';

type EditUserPermissionsModalProps = {
  isOpen: boolean,
  closeModal: () => void,
  user: User,
  engagements: Engagement[],
  setOrgUsers: AppContext['setOrgUsers'],
  orgUsersMap: AppContext['orgUsersMap'],
  openSnackBar: AppContext['openSnackBar'],
  org: Org,
  tasks: Task[],
  setTasks: AppContext['setTasks'];
};

export default function EditUserPermissionsModal(props: EditUserPermissionsModalProps) {
  const {
    isOpen,
    closeModal,
    user,
    engagements,
    setOrgUsers,
    orgUsersMap,
    openSnackBar,
    org,
    tasks,
    setTasks
  } = props;

  const navigate = useNavigate();

  const isSmallScreen = useMediaQuery('(max-width: 800px)');

  const memberOfEngagementIds = user?.memberOfEngagements?.map(({ id }) => id) || [];
  const adminOfEngagementIds = user?.adminOfEngagements?.map(({ id }) => id) || [];

  const [bulkAccessMenu, setBulkAccessMenu] = useState<Element | null>(null);
  const [bulkAdminMenu, setBulkAdminMenu] = useState<Element | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [isEnablingAccess, setEnablingAccess] = useState(false);
  const [isDisablingAccess, setDisablingAccess] = useState(false);
  const [isEnablingAdmin, setEnablingAdmin] = useState(false);
  const [isDisablingAdmin, setDisablingAdmin] = useState(false);
  const [confirmDisableAllAccessOpen, setConfirmDisableAllAccessOpen] = useState(false);

  const bulkAccessMenuOpen = Boolean(bulkAccessMenu);
  const bulkAdminMenuOpen = Boolean(bulkAdminMenu);

  const theUser = orgUsersMap[user?.id];

  const handleUpdatePermissions = async (isAdmin: boolean, engagementObject: Engagement) => {
    setLoading(true);

    const engagementId = engagementObject.id;
    const engagementName = engagementObject.name;

    try {
      const { success, message, uiProps } = await updateUserPermissions(engagementId, user.id, {
        isAdmin
      });

      if (success) {
        if (isAdmin) {
          theUser.memberOfEngagements = theUser.memberOfEngagements?.filter(c => c.id !== engagementId);
          theUser.adminOfEngagements?.push({
            id: engagementId,
            name: engagementName
          });
        } else {
          theUser.adminOfEngagements = theUser.adminOfEngagements?.filter(c => c.id !== engagementId);
          theUser.memberOfEngagements?.push({
            id: engagementId,
            name: engagementName
          });
        }

        setOrgUsers(Object.values(orgUsersMap));
        setLoading(false);
        openSnackBar('Permission updated.', 'success');
      } else {
        if (uiProps && uiProps.alertType === 'upgrade') {
          openSnackBar(message, 'error', {
            actionName: 'Upgrade now',
            actionHandler: () => {
              handleClose();
              navigate('settings/account/billing');
            }
          });
        } else {
          openSnackBar(message, 'error');
        }
        setLoading(false);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        openSnackBar(error.message, 'error');
        setLoading(false);
      }
    }
  };

  const handleUpdateAccess = async (hasAccess: boolean, engagementObject: Engagement) => {
    setLoading(true);

    const engagementId = engagementObject.id;
    const engagementName = engagementObject.name;

    try {
      const { success, message } = await updateAccess(org.id, user.id, {
        engagements: [{ id: engagementId, hasAccess }]
      });

      if (success) {
        if (hasAccess) {
          theUser.memberOfEngagements?.push({
            id: engagementId,
            name: engagementName
          });
        } else {
          theUser.adminOfEngagements = theUser.adminOfEngagements?.filter(c => c.id !== engagementId);
          theUser.memberOfEngagements = theUser.memberOfEngagements?.filter(c => c.id !== engagementId);
        }

        setOrgUsers(Object.values(orgUsersMap));
        setLoading(false);
        openSnackBar('Access updated.', 'success');
      } else {
        openSnackBar(message, 'error');
        setLoading(false);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        openSnackBar(error.message, 'error');
        setLoading(false);
      }
    }
  };

  const handleClose = () => {
    setBulkAccessMenu(null);
    setBulkAdminMenu(null);
    closeModal();

    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  const handleBulkUpdateAccess = async (hasAccess: boolean, isConfirmed: boolean = false) => {
    if (hasAccess) {
      setEnablingAccess(true);
    } else {
      if (!isConfirmed) {
        setConfirmDisableAllAccessOpen(true);
        return;
      }
      setDisablingAccess(true);
    }

    try {
      const { success, message } = await updateAccess(org.id, user.id, {
        engagements: engagements.map(({ id }) => ({ id, hasAccess }))
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
        setOrgUsers(orgUsers => hasAccess ? Object.values(orgUsersMap) : orgUsers.filter(u => u.id !== theUser.id));

        if (!hasAccess) {
          setConfirmDisableAllAccessOpen(false);

          const tasksClone = [...tasks];
          tasksClone.forEach(task => {
            if (task.assigned_to_id && task.assigned_to_id === theUser.id) {
              task.assigned_to_id = null;
            }
          });
          setTasks(tasksClone);
          handleClose();
        }

        openSnackBar('Access updated.', 'success');
      } else {
        openSnackBar(message, 'error');
        setEnablingAccess(false);
        setDisablingAccess(false);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        openSnackBar(error.message, 'error');
        setEnablingAccess(false);
        setDisablingAccess(false);
      }
    }
  };

  const handleBulkUpdatePermission = async (isAdmin: boolean) => {
    if (isAdmin) {
      setEnablingAdmin(true);
    } else {
      setDisablingAdmin(true);
    }

    try {
      const { success, message, uiProps } = await batchUpdatePermission({
        isAdmin,
        userId: user.id,
        orgId: org.id
      });

      if (success) {
        if (isAdmin) {
          theUser.adminOfEngagements = [...(theUser.adminOfEngagements || []), ...(theUser.memberOfEngagements || [])];
          theUser.memberOfEngagements = [];
        } else {
          theUser.memberOfEngagements = [...(theUser.adminOfEngagements || []), ...(theUser.memberOfEngagements || [])];
          theUser.adminOfEngagements = [];
        }

        setOrgUsers(Object.values(orgUsersMap));
        setEnablingAdmin(false);
        setDisablingAdmin(false);
        setBulkAdminMenu(null);
        openSnackBar('Permissions updated.', 'success');
      } else {
        if (uiProps && uiProps.alertType === 'upgrade') {
          openSnackBar(message, 'error', {
            actionName: 'Upgrade now',
            actionHandler: () => {
              handleClose();
              navigate('settings/account/billing');
            }
          });
        } else {
          openSnackBar(message, 'error');
        }
        setEnablingAdmin(false);
        setDisablingAdmin(false);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        openSnackBar(error.message, 'error');
        setEnablingAdmin(false);
        setDisablingAdmin(false);
      }
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
                        onChange={(_, isChecked) => handleUpdatePermissions(isChecked, engagement)}
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
          Add all
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
          Remove all
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
          Add all
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
          Remove all
          <CircularProgress
            hidden={!isDisablingAdmin}
            style={{ marginLeft: '5px' }}
            size={17}
          />
        </MenuItem>
      </Menu>

      <Dialog
        open={confirmDisableAllAccessOpen}
        onClose={() => setConfirmDisableAllAccessOpen(false)}>
        <DialogTitle>
          Confirmation Needed
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Removing access to all engagements will remove this user from the organization.
            <br></br>
            You can always re-invite this user, if needed.
            <br></br>
            <br></br>
            <Button
              disabled={isDisablingAccess}
              style={{ marginRight: '15px' }}
              variant='outlined'
              onClick={() => setConfirmDisableAllAccessOpen(false)}>
              Cancel
            </Button>
            <LoadingButton
              loading={isDisablingAccess}
              variant='contained'
              onClick={() => handleBulkUpdateAccess(false, true)}>
              Remove access
            </LoadingButton>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
};