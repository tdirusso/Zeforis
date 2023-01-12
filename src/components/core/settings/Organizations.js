import { Box, Divider, Paper } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import React from "react";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import { useOutletContext } from "react-router-dom";
import AccountMenu from "../AccountMenu";
import { setActiveAccountId } from "../../../api/account";
import useSnackbar from "../../../hooks/useSnackbar";
import Snackbar from "../Snackbar";

export default function Organizations() {

  const {
    isOpen,
    openSnackBar,
    type,
    message
  } = useSnackbar();

  const {
    user,
    accountUsers
  } = useOutletContext();

  const handleAccountSelection = accountId => {
    const selectedAccountObject = user.memberOfAccounts.find(account => account.id === accountId);
    setActiveAccountId(selectedAccountObject.id);
    openSnackBar(`Loading ${selectedAccountObject.name}...`, 'info');
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  return (
    <>
      <Paper>
        <Box component="h6">Your Organizations</Box>
        <Divider sx={{ my: 4 }} />
        <Box maxWidth={360}>
          <AccountMenu changeHandler={handleAccountSelection} />
        </Box>

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
                      <IconButton edge="end">
                        {
                          !isYou ? <EditIcon fontSize="small" /> : null
                        }
                      </IconButton>
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

      <Snackbar
        isOpen={isOpen}
        type={type}
        message={message}
      />
    </>
  );
};
