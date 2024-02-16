import { Box, Chip, Typography, useMediaQuery } from "@mui/material";
import { Divider, Tooltip } from "@mui/material";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import { useOutletContext } from "react-router-dom";
import CloseIcon from '@mui/icons-material/Close';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import React from "react";
import { AppContext } from "src/types/AppContext";
import { User } from "@shared/types/User";

export default function Members() {

  const {
    user,
    orgUsers,
    isAdmin,
    org,
    openModal
  } = useOutletContext<AppContext>();

  const isSmallScreen = useMediaQuery('(max-width: 525px)');

  const adminOrgUsers: User[] = [];
  const memberOrgUsers: User[] = [];

  orgUsers.forEach(orgUser => {
    (orgUser.adminOfEngagements || []).length > 0 ?
      adminOrgUsers.push(orgUser) :
      memberOrgUsers.push(orgUser);
  });

  const handleEditUser = (userObject: User) => {
    openModal('edit-permissions', { user: userObject });
  };

  const handleRemoveUser = (userObject: User) => {
    openModal('remove-user', { userToRemove: userObject });
  };

  return (
    <>
      <Box>
        <Box component="h4" ml={1.75} mb={1}>
          All members of {org.name}
        </Box>
        <Typography ml={1.75} mb={2}>
          This list is a collection of all users from all engagements.
        </Typography>
        <Divider textAlign="left">
          <Chip label="Administrators" />
        </Divider>
        <List dense>
          {
            adminOrgUsers.map((orgUser, index) => {
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
                  {index !== adminOrgUsers.length - 1 ? <Divider /> : null}
                </React.Fragment>
              );
            })
          }
        </List>
        <Divider textAlign="left">
          <Chip label="Members" />
        </Divider>
        <List dense>
          {
            memberOrgUsers.map((orgUser, index) => {
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
                  {index !== memberOrgUsers.length - 1 ? <Divider /> : null}
                </React.Fragment>
              );
            })
          }
        </List>
      </Box>
    </>
  );
};
