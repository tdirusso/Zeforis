import { Box, Button, Chip, Divider, Paper, Skeleton, TextField, Tooltip, Typography } from "@mui/material";
import React, { useRef, useState } from "react";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import { useOutletContext } from "react-router-dom";
import OrgMenu from "../OrgMenu";
import { setActiveOrgId, updateOrg } from "../../../api/orgs";
import CloseIcon from '@mui/icons-material/Close';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import EditUserPermissionsModal from "../../admin/EditUserPermissionsModal";
import RemoveUserModal from "../../admin/RemoveUserModal";
import { LoadingButton } from "@mui/lab";
import { TwitterPicker } from 'react-color';

export default function Organizations() {
  const {
    user,
    orgUsers,
    org,
    isAdmin,
    openSnackBar
  } = useOutletContext();

  const [userToModify, setUserToModify] = useState(null);
  const [editUserPermissionsModalOpen, setEditUserPermissionsModalOpen] = useState(false);
  const [removeUserModalOpen, setRemoveUserModalOpen] = useState(false);

  const [isLoading, setLoading] = useState(false);
  const [brandColor, setBrandColor] = useState(org.brandColor);
  const [logoSrc, setLogoSrc] = useState(org.logo);
  const [logoFile, setLogoFile] = useState(null);
  const [isLogoChanged, setLogoChanged] = useState(false);
  const [isLogoLoading, setLogoLoading] = useState(org.logo !== '');
  const orgName = useRef();

  const handleOrgSelection = ({ id }) => {
    const selectedOrgObject = user.memberOfOrgs.find(org => org.id === id);
    setActiveOrgId(selectedOrgObject.id);
    openSnackBar(`Loading ${selectedOrgObject.name}...`, 'info');
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  const handleEditUser = (userObject) => {
    setUserToModify(userObject);
    setEditUserPermissionsModalOpen(true);
  };

  const handleRemoveUser = (userObject) => {
    setUserToModify(userObject);
    setRemoveUserModalOpen(true);
  };

  const handleOrgUpdate = async () => {
    const nameVal = orgName.current.value;

    if (!nameVal) {
      openSnackBar('Your organization name cannot be blank.', 'error');
      return;
    }

    setLoading(true);

    try {
      const fd = new FormData();
      fd.append('logoFile', logoFile);
      fd.append('name', nameVal);
      fd.append('brandColor', brandColor);
      fd.append('isLogoChanged', isLogoChanged);
      fd.append('orgId', org.id);

      const { success, message } = await updateOrg(fd);

      if (success) {
        openSnackBar('Organization updated successfully.', 'success');
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        openSnackBar(message, 'error');
        setLoading(false);
      }
    } catch (error) {
      openSnackBar(error.message, 'error');
      setLoading(false);
    }
  };

  const handleLogoChange = e => {
    const imageFile = e.target.files[0];

    if (!imageFile) {
      return;
    };

    setLogoSrc(URL.createObjectURL(imageFile));
    setLogoFile(imageFile);
    setLogoChanged(true);
  };

  const handleLogoClear = () => {
    setLogoSrc('');
    setLogoFile(null);
    setLogoChanged(true);
  };

  return (
    <>
      <Paper>
        <Box component="h6">Your Organizations</Box>
        <Divider sx={{ my: 4 }} />
        <Box maxWidth={360}>
          <OrgMenu
            changeHandler={handleOrgSelection}
            curOrgId={org.id}
          />
        </Box>

        <Divider textAlign="left" sx={{ pt: 4 }}>
          <Chip
            label={`All ${org.name} Users`}
          />
        </Divider>

        <List dense>
          {
            orgUsers.map((orgUser, index) => {
              const isYou = orgUser.id === user.id;

              let primaryText = <span>{orgUser.firstName} {orgUser.lastName}</span>;

              if (isYou) {
                primaryText = <span>
                  {orgUser.firstName} {orgUser.lastName}
                  <span style={{ color: '#bababa' }}>{` (you)`}</span>
                </span>;
              }

              return (
                <React.Fragment key={orgUser.id}>
                  <ListItem
                    secondaryAction={
                      <Box>
                        {
                          !isYou && isAdmin ?
                            <Box>
                              <Tooltip title="Edit Permissions">
                                <IconButton
                                  edge="end"
                                  sx={{ mr: 0.5 }}
                                  onClick={() => handleEditUser(orgUser)}>
                                  <LockOpenIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Remove User">
                                <IconButton
                                  edge="end"
                                  onClick={() => handleRemoveUser(orgUser)}>
                                  <CloseIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                            :
                            null
                        }
                      </Box>
                    }>
                    <ListItemText
                      primary={primaryText}
                      secondary={orgUser.email}
                    />
                  </ListItem>
                  {index !== orgUser.length - 1 ? <Divider /> : null}
                </React.Fragment>
              );
            })
          }
        </List>
      </Paper>

      <Paper sx={{ my: 4 }} hidden={!isAdmin}>
        <Box component="h6">{org.name} Settings</Box>
        <Divider sx={{ my: 4 }} />

        <Box>
          <TextField
            sx={{ minWidth: '50%' }}
            label="Organization Name"
            disabled={isLoading}
            defaultValue={org.name}
            inputRef={orgName}>
          </TextField>
        </Box>

        <Box my={2} display='flex' alignItems='center'>
          <Box>
            <Typography variant="caption" pb={0.5} component="div">Your branding</Typography>
            <TwitterPicker
              triangle="hide"
              color={brandColor}
              onChange={color => setBrandColor(color.hex)}
            />
          </Box>
          <Box
            sx={{
              background: brandColor,
              borderRadius: '6px',
              height: '75px',
              width: '75px',
              transition: 'background 500ms',
              ml: 4
            }}>
          </Box>
        </Box>

        <Box sx={{ mt: 5, mb: 5, display: 'flex', alignItems: 'center' }}>
          <Button
            variant='outlined'
            component='label'
            sx={{ mr: 1 }}
            disabled={isLoading}>
            Upload Logo
            <input
              hidden
              accept="image/png,image/jpeg"
              type="file"
              onChange={handleLogoChange}
              disabled={isLoading}
            />
          </Button>
          <Button
            sx={{
              display: logoSrc && !isLogoLoading ? 'block' : 'none',
              mr: 2
            }}
            disabled={isLoading}
            onClick={handleLogoClear}>
            Clear
          </Button>

          <Skeleton
            variant='circular'
            width={70}
            height={70}
            animation='wave'
            sx={{ display: logoSrc && isLogoLoading ? 'block' : 'none' }}>
          </Skeleton>
          <img
            src={logoSrc}
            alt=""
            width={100}
            onLoad={() => setLogoLoading(false)}
          />
        </Box>

        <Box my={2}>
          <LoadingButton
            onClick={handleOrgUpdate}
            loading={isLoading}
            variant="contained">
            Save Changes
          </LoadingButton>
        </Box>
      </Paper>

      <EditUserPermissionsModal
        user={userToModify}
        open={editUserPermissionsModalOpen}
        setOpen={setEditUserPermissionsModalOpen}
      />

      <RemoveUserModal
        open={removeUserModalOpen}
        setOpen={setRemoveUserModalOpen}
        user={userToModify}
      />
    </>
  );
};
