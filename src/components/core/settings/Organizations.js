import { Box, Chip, Divider, Paper, Tooltip } from "@mui/material";
import React, { useState } from "react";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import { useOutletContext } from "react-router-dom";
import AccountMenu from "../AccountMenu";
import { setActiveAccountId } from "../../../api/account";
import useSnackbar from "../../../hooks/useSnackbar";
import Snackbar from "../Snackbar";
import CloseIcon from '@mui/icons-material/Close';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import EditUserPermissionsModal from "../../admin/EditUserPermissionsModal";
import RemoveUserModal from "../../admin/RemoveUserModal";

export default function Organizations() {
  const [userToModify, setUserToModify] = useState(null);
  const [editUserPermissionsModalOpen, setEditUserPermissionsModalOpen] = useState(false);
  const [removeUserModalOpen, setRemoveUserModalOpen] = useState(false);

  const {
    isOpen,
    openSnackBar,
    type,
    message
  } = useSnackbar();

  const {
    user,
    accountUsers,
    account,
    isAdmin
  } = useOutletContext();

  const handleAccountSelection = accountId => {
    const selectedAccountObject = user.memberOfAccounts.find(account => account.id === accountId);
    setActiveAccountId(selectedAccountObject.id);
    openSnackBar(`Loading ${selectedAccountObject.name}...`, 'info');
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

  return (
    <>
      <Paper>
        <Box component="h6">Your Organizations</Box>
        <Divider sx={{ my: 4 }} />
        <Box maxWidth={360}>
          <AccountMenu
            changeHandler={handleAccountSelection}
          />
        </Box>

        <Divider textAlign="left" sx={{pt: 4}}>
          <Chip
            label={`All ${account.name} Users`}
          />
        </Divider>

        <List dense>
          {
            accountUsers.map((accountUser, index) => {
              const isYou = accountUser.id === user.id;

              let primaryText = <span>{accountUser.firstName} {accountUser.lastName}</span>;

              if (isYou) {
                primaryText = <span>
                  {accountUser.firstName} {accountUser.lastName}
                  <span style={{ color: '#bababa' }}>{` (you)`}</span>
                </span>;
              }

              return (
                <React.Fragment key={accountUser.id}>
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
                                  onClick={() => handleEditUser(accountUser)}>
                                  <LockOpenIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Remove User">
                                <IconButton
                                  edge="end"
                                  onClick={() => handleRemoveUser(accountUser)}>
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
                      secondary={accountUser.email}
                    />
                  </ListItem>
                  {index !== accountUsers.length - 1 ? <Divider /> : null}
                </React.Fragment>
              );
            })
          }
        </List>
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

      <Snackbar
        isOpen={isOpen}
        type={type}
        message={message}
      />
    </>
  );
};
