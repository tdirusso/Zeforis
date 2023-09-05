import { Box, Typography, useMediaQuery } from "@mui/material";
import { Divider, Tooltip } from "@mui/material";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import { useOutletContext } from "react-router-dom";
import CloseIcon from '@mui/icons-material/Close';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import React from "react";

export default function UsersTab() {

  const {
    user,
    orgUsers,
    isAdmin,
    org,
    openModal
  } = useOutletContext();

  const isSmallScreen = useMediaQuery('(max-width: 525px)');

  const handleEditUser = (userObject) => {
    openModal('edit-permissions', { user: userObject });
  };

  const handleRemoveUser = (userObject) => {
    openModal('remove-user', { userToRemove: userObject });
  };

  return (
    <>
      <Box mt={4}>
        <Box component="h4" ml={1.75} mb={1}>
          All members of {org.name}
        </Box>
        <Typography ml={1.75} mb={2}>
          This list is a collection of all users from all engagements.
        </Typography>
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
                                  style={{ marginRight: '5px' }}
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
                      secondary={isSmallScreen ? '' : orgUser.email}
                    />
                  </ListItem>
                  {index !== orgUser.length - 1 ? <Divider /> : null}
                </React.Fragment>
              );
            })
          }
        </List>
      </Box>
    </>
  );
};
