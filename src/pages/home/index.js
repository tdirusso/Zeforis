/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { Outlet, useLocation } from "react-router-dom";
import SideNav from "../../components/core/SideNav";
import { Box, Grid, createTheme } from "@mui/material";
import SelectClientScreen from "../../components/core/SelectClientScreen";
import useSnackbar from "../../hooks/useSnackbar";
import Snackbar from "../../components/core/Snackbar";
import { getActiveClientId, getClientData, getUserClientListForAccount, setActiveClientId } from "../../api/client";
import AddClientScreen from "../../components/admin/AddClientScreen";
import { getActiveAccountId, setActiveAccountId } from "../../api/account";
import SelectAccountModal from "../../components/core/SelectAccountModal";
import Loader from "../../components/core/Loader";
import themeConfig from "../../theme";
import AddAccountScreen from "../../components/admin/AddAccountScreen";

export default function Home({ setTheme }) {
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

  const { user, authError, setUser } = useAuth();
  const [isLoading, setLoading] = useState(true);
  const [client, setClient] = useState(null);
  const [account, setAccount] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [folders, setFolders] = useState([]);
  const [tags, setTags] = useState([]);
  const [accountUsers, setAccountUsers] = useState([]);
  const [triedAccAndClient, setTriedAccAndClient] = useState(false);

  const {
    isOpen,
    openSnackBar,
    type,
    message
  } = useSnackbar();

  useEffect(() => {
    if (user) {
      if (activeAccountId) {
        const activeAccount = user.memberOfAccounts.find(account => {
          return account.id === activeAccountId;
        });

        if (activeAccount) {
          const brandRGB = hexToRgb(activeAccount.brandColor);
          document.documentElement.style.setProperty('--colors-primary', activeAccount.brandColor);
          document.documentElement.style.setProperty('--colors-primary-rgb', `${brandRGB.r}, ${brandRGB.g}, ${brandRGB.b}`);
          themeConfig.palette.primary.main = activeAccount.brandColor;
          document.title = `${activeAccount.name} Portal`;
          setTheme(createTheme(themeConfig));
          setAccount(activeAccount);
        }
      }

      if (activeClientId) {
        const activeClient = user.adminOfClients.concat(user.memberOfClients).find(client => {
          return client.id === activeClientId;
        });

        if (activeClient) {
          setClient(activeClient);
        }
      }

      setTriedAccAndClient(true);
    } else if (authError) {
      openSnackBar(authError, 'error');
    }
  }, [user, authError]);

  useEffect(() => {
    if (triedAccAndClient) {
      if (client && tasks.length === 0) {
        fetchClientData();
      } else if (!client) {
        setLoading(false);
      }
    }

    async function fetchClientData() {
      const result = await getClientData(client.id, account.id);
      setTasks(result.tasks);
      setFolders(result.folders);
      setTags(result.tags);
      setAccountUsers(result.accountUsers);
      setLoading(false);
    }
  }, [triedAccAndClient]);

  const foldersMap = {};
  const tasksMap = {};
  const tagsMap = {};
  const accountUsersMap = {};

  accountUsers.forEach(user => accountUsersMap[user.id] = user);

  const sortedTasks = [...tasks].sort((a, b) => a.task_name.localeCompare(b.task_name));

  folders.forEach(folder => {
    foldersMap[String(folder.id)] = { ...folder, tasks: [] };
  });

  sortedTasks.forEach(task => {
    foldersMap[task.folder_id].tasks.push(task);
    tasksMap[task.task_id] = task;
  });

  tags.forEach(tag => {
    tagsMap[tag.id] = tag;
  });

  const sortedFolders = Object.values(foldersMap).sort((a, b) => a.name.localeCompare(b.name));

  let isAdmin = false;
  const clientMembers = [];
  const clientAdmins = [];

  accountUsers.forEach(accountUser => {
    if (accountUser.adminOfClients.some(clientObj => clientObj.id === client?.id)) {
      clientAdmins.push({ ...accountUser, role: 'Administrator' });
      if (accountUser.id === user.id) isAdmin = true;
    }

    if (accountUser.memberOfClients.some(clientObj => clientObj.id === client?.id)) {
      clientMembers.push({ ...accountUser, role: 'Member' });
    }
  });

  if (isLoading) {
    return <Loader />;
  }

  if (!account) {
    if (user.memberOfAccounts.length === 1) {
      setActiveAccountId(user.memberOfAccounts[0].id);
      setAccount(user.memberOfAccounts[0]);
    } else if (user.memberOfAccounts.length === 0) {
      return (
        <Box className="flex-centered" sx={{ height: '100%' }}>
          <AddAccountScreen user={user} />
        </Box>
      );
    } else {
      return (
        <Box className="flex-centered" sx={{ height: '100%' }}>
          <SelectAccountModal
            open={true}
            setOpen={() => { }}
            hideCancel={true}
            accounts={user.memberOfAccounts}
            user={user}
          />
        </Box>
      );
    }
  }

  const clients = getUserClientListForAccount(user, activeAccountId);

  if (clients.length === 0) {
    return (
      <Box className="flex-centered" sx={{ height: '100%' }}>
        <AddClientScreen account={account} />
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
          <SelectClientScreen
            client={client}
            clients={clients}
          />
        </Box>
      );
    }
  }

  const context = {
    client,
    clients,
    account,
    user,
    folders: sortedFolders,
    tasks: sortedTasks,
    tags,
    clientMembers,
    clientAdmins,
    accountUsers,
    accountUsersMap,
    tagsMap,
    foldersMap,
    tasksMap,
    isAdmin,
    setTags,
    setTasks,
    setFolders,
    setAccountUsers,
    setUser
  };

  return (
    <Box>
      <SideNav
        account={account}
        client={client}
      />
      <Box component="main" ml={'280px'} px={5}>
        <Box maxWidth={'1200px'} m='auto' pt={2} pb={5}>
          <Grid container spacing={3}>
            <Outlet context={context} />
          </Grid>
        </Box>
      </Box>

      <Snackbar
        isOpen={isOpen}
        type={type}
        message={message}
      />
    </Box>
  );
};

function hexToRgb(hex) {
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function (m, r, g, b) {
    return r + r + g + g + b + b;
  });

  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}