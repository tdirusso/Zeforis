/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { Outlet, useLocation } from "react-router-dom";
import SideNav from "../../components/core/SideNav";
import Header from "../../components/core/Header";
import { Box, createTheme } from "@mui/material";
import './styles/index.css';
import SelectClientModal from "../../components/core/SelectClientModal";
import useSnackbar from "../../hooks/useSnackbar";
import Snackbar from "../../components/core/Snackbar";
import themeConfig from "../../theme";
import { getActiveClientId, getClientData, getUserClientListForAccount, setActiveClientId } from "../../api/client";
import AddClientModal from "../../components/admin/AddClientModal";
import { getActiveAccountId, setActiveAccountId } from "../../api/account";
import SelectAccountModal from "../../components/core/SelectAccountModal";
import Loader from "../../components/core/Loader";

export default function Home({ theme, setTheme }) {
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);

  const accountIdPassed = queryParams.get('accountId');
  const clientIdPassed = queryParams.get('clientId');
  if (accountIdPassed && clientIdPassed) {
    setActiveAccountId(accountIdPassed);
    setActiveClientId(clientIdPassed);
    window.location = window.location.href.split('?')[0];
  }

  let activeAccountId = getActiveAccountId();
  let activeClientId = getActiveClientId();

  const { user, authError } = useAuth();
  const [isLoading, setLoading] = useState(true);
  const [client, setClient] = useState(null);
  const [account, setAccount] = useState(null);
  const [tasks, setTasks] = useState(null);
  const [folders, setFolders] = useState(null);
  const [clientUsers, setClientUsers] = useState(null);

  const {
    isOpen,
    openSnackBar,
    type,
    message
  } = useSnackbar();

  useEffect(() => {
    if (user) {
      console.log(user);
      if (activeAccountId) {
        const activeAccount = user.memberOfAccounts.find(account => {
          return account.id === activeAccountId;
        });

        if (activeAccount) {
          setAccount(activeAccount);
        }
      }

      if (activeClientId) {
        const activeClient = user.adminOfClients.concat(user.memberOfClients).find(client => {
          return client.id === activeClientId;
        });

        if (activeClient) {
          if (activeClient.brandColor) {
            document.documentElement.style.setProperty('--colors-primary', activeClient.brandColor);
            themeConfig.palette.primary.main = activeClient.brandColor;
            setTheme(createTheme(themeConfig));
          }

          setClient(activeClient);
        }
      }
    } else if (authError) {
      openSnackBar(authError, 'error');
    }
  }, [user, authError]);

  useEffect(() => {
    if (client && !tasks) {
      fetchClientData();
    }

    async function fetchClientData() {
      const result = await getClientData(client.id);

      if (!tasks) {
        setTasks([]);
        setFolders(result.folders);
        setClientUsers(result.clientUsers);
        setLoading(false);
      } else {
        openSnackBar(message, 'error');
      }
    }
  }, [client]);

  if (isLoading) {
    return <Loader />;
  }

  if (!account) {
    if (user.memberOfAccounts.length === 1) {
      setActiveAccountId(user.memberOfAccounts[0].id);
      setAccount(user.memberOfAccounts[0]);
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

  const clients = getUserClientListForAccount(user, activeAccountId);

  if (clients.length === 0) {
    return (
      <Box className="flex-centered" sx={{ height: '100%' }}>
        <AddClientModal
          open={true}
          setOpen={() => { }}
          hideCancel={true}
          accountId={activeAccountId}
        />
      </Box>
    );
  }

  if (!client) {
    if (clients.length === 1) {
      setActiveClientId(clients[0].id);
      setClient(clients[0]);
    } else {
      return (
        <Box className="flex-centered" sx={{ height: '100%' }}>
          <SelectClientModal client={client} clients={clients} />
        </Box>
      );
    }
  }

  return (
    <div>
      <SideNav theme={theme} client={client} />
      <main>
        <Header />
        {/* <Paper sx={{ width: '100%' }} elevation={1} className="main-content"> */}
        <Outlet
          context={{
            client,
            clients,
            account,
            user,
            folders,
            clientUsers
          }}
        />
        {/* </Paper> */}
      </main>

      <Snackbar
        isOpen={isOpen}
        type={type}
        message={message}
      />
    </div>
  );
};
