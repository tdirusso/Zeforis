/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { Outlet } from "react-router-dom";
import SideNav from "../../components/core/SideNav";
import './admin.css';
import Header from "../../components/core/Header";
import { Box, CircularProgress, createTheme, Paper } from "@mui/material";
import './styles/index.css';
import SelectClientModal from "../../components/core/SelectClientModal";
import useSnackbar from "../../hooks/useSnackbar";
import Snackbar from "../../components/core/Snackbar";
import themeConfig from "../../theme";
import { getActiveClient, getUserClientListForAccount } from "../../api/client";
import AddClientModal from "../../components/admin/AddClientModal";
import { getActiveAccount, setActiveAccount } from "../../api/account";
import SelectAccountModal from "../../components/core/SelectAccountModal";

export default function Admin({ theme, setTheme }) {
  const { user } = useAuth();
  const [client] = useState(getActiveClient());
  const [account] = useState(getActiveAccount());
  const [isLoading, setLoading] = useState(true);

  const {
    isOpen,
    openSnackBar,
    type,
    message
  } = useSnackbar();

  useEffect(() => {
    if (user) {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (client && client.brandColor) {
      themeConfig.palette.primary.main = client.brandColor;
      setTheme(createTheme(themeConfig));
      document.documentElement.style.setProperty('--colors-primary', client.brandColor);
    }
  }, []);

  if (isLoading) {
    return (
      <Box className="flex-centered" sx={{ height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!account) {
    if (user.memberOfAccounts.length === 1) {
      setActiveAccount(user.memberOfAccounts[0]);
    } else {
      return (
        <Box className="flex-centered" sx={{ height: '100%' }}>
          <SelectAccountModal
            open={true}
            setOpen={() => { }}
            hideCancel={true}
            accounts={user.memberOfAccounts}
          />
        </Box>
      );
    }
  }

  const clients = getUserClientListForAccount(user, account._id);

  if (clients.length === 0) {
    return (
      <Box className="flex-centered" sx={{ height: '100%' }}>
        <AddClientModal
          open={true}
          setOpen={() => { }}
          hideCancel={true}
          accountId={account._id}
        />
      </Box>
    );
  }

  let clientExists = false;
  if (client) {
    clientExists = clients.some(({ _id }) => client._id === _id);
  }

  if (!clientExists) {
    return (
      <Box className="flex-centered" sx={{ height: '100%' }}>
        <SelectClientModal />
      </Box>
    );
  }

  return (
    <div>
      <SideNav theme={theme} client={client} />
      <main>
        <Header />
        <Paper sx={{ width: '100%' }} elevation={1} className="main-content">
          <Outlet context={{ client, clients, account }} />
        </Paper>
      </main>

      <Snackbar
        isOpen={isOpen}
        type={type}
        message={message}
      />
    </div>
  );
};
