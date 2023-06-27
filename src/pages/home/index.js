/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { Outlet, useLocation } from "react-router-dom";
import SideNav from "../../components/core/SideNav";
import { Box, Grid, createTheme } from "@mui/material";
import SelectClientScreen from "../../components/core/SelectClientScreen";
import useSnackbar from "../../hooks/useSnackbar";
import Snackbar from "../../components/core/Snackbar";
import { getActiveClientId, getClientData, getUserClientListForOrg, setActiveClientId } from "../../api/clients";
import CreateClientScreen from "../../components/admin/CreateClientScreen";
import { getActiveOrgId, setActiveOrgId } from "../../api/orgs";
import SelectOrgModal from "../../components/core/SelectOrgModal";
import Loader from "../../components/core/Loader";
import themeConfig from "../../theme";
import CreateOrgScreen from "../../components/admin/CreateOrgScreen";
import Header from "../../components/core/Header";
import Modals from "../../components/core/Modals";
import useModal from "../../hooks/useModal";
import Drawers from "../../components/core/Drawers";
import useDrawer from "../../hooks/useDrawer";
import useSideNav from "../../hooks/useSideNav";

export default function Home({ setTheme }) {
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);

  const orgIdPassed = queryParams.get('orgId');
  const clientIdPassed = queryParams.get('clientId');

  if (orgIdPassed && clientIdPassed) {
    setActiveOrgId(orgIdPassed);
    setActiveClientId(clientIdPassed);
    window.location = window.location.href.split('?')[0];
  }

  let activeOrgId = getActiveOrgId();
  let activeClientId = getActiveClientId();

  const { user, authError, setUser } = useAuth();
  const [isLoading, setLoading] = useState(true);
  const [client, setClient] = useState(null);
  const [org, setOrg] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [folders, setFolders] = useState([]);
  const [tags, setTags] = useState([]);
  const [widgets, setWidgets] = useState([]);
  const [orgUsers, setOrgUsers] = useState([]);
  const [triedOrgAndClient, setTriedOrgAndClient] = useState(false);

  const {
    isOpen,
    openSnackBar,
    type,
    message
  } = useSnackbar();

  const {
    modalToOpen,
    openModal,
    closeModal
  } = useModal();

  const {
    isSideNavOpen,
    toggleSideNav
  } = useSideNav();

  const {
    drawerToOpen,
    drawerProps,
    openDrawer,
    closeDrawer
  } = useDrawer();

  useEffect(() => {
    if (user) {
      if (activeOrgId) {
        const activeOrg = user.memberOfOrgs.find(org => {
          return org.id === activeOrgId;
        });

        if (activeOrg) {
          const brandRGB = hexToRgb(activeOrg.brandColor);
          document.documentElement.style.setProperty('--colors-primary', activeOrg.brandColor);
          document.documentElement.style.setProperty('--colors-primary-rgb', `${brandRGB.r}, ${brandRGB.g}, ${brandRGB.b}`);
          themeConfig.palette.primary.main = activeOrg.brandColor;
          document.title = `${activeOrg.name} Portal`;
          setTheme(createTheme(themeConfig));
          setOrg(activeOrg);
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

      setTriedOrgAndClient(true);
    } else if (authError) {
      openSnackBar(authError, 'error');
    }
  }, [user, authError]);

  useEffect(() => {
    if (triedOrgAndClient) {
      if (client && tasks.length === 0) {
        fetchClientData();
      } else if (!client) {
        setLoading(false);
      }
    }

    async function fetchClientData() {
      const result = await getClientData(client.id, org.id);
      setTasks(result.tasks);
      setFolders(result.folders);
      setTags(result.tags);
      setOrgUsers(result.orgUsers);
      setWidgets(result.widgets);
      setLoading(false);
    }
  }, [triedOrgAndClient]);

  const foldersMap = {};
  const tasksMap = {};
  const tagsMap = {};
  const orgUsersMap = {};

  orgUsers.forEach(user => orgUsersMap[user.id] = user);

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
  const sortedTags = Object.values(tagsMap).sort((a, b) => a.name.localeCompare(b.name));
  const sortedWidgets = widgets.sort((a, b) => a.name.localeCompare(b.name));

  let isAdmin = false;
  const clientMembers = [];
  const clientAdmins = [];

  orgUsers.forEach(orgUser => {
    if (orgUser.adminOfClients.some(clientObj => clientObj.id === client?.id)) {
      clientAdmins.push({ ...orgUser, role: 'Administrator' });
      if (orgUser.id === user.id) isAdmin = true;
    }

    if (orgUser.memberOfClients.some(clientObj => clientObj.id === client?.id)) {
      clientMembers.push({ ...orgUser, role: 'Member' });
    }
  });

  if (isLoading) {
    return <Loader />;
  }

  if (!org) {
    if (user.memberOfOrgs.length === 1) {
      setActiveOrgId(user.memberOfOrgs[0].id);
      setOrg(user.memberOfOrgs[0]);
    } else if (user.memberOfOrgs.length === 0) {
      return (
        <Box className="flex-centered" sx={{ height: '100%' }}>
          <CreateOrgScreen user={user} />
        </Box>
      );
    } else {
      return (
        <Box className="flex-centered" sx={{ height: '100%' }}>
          <SelectOrgModal
            open={true}
            setOpen={() => { }}
            hideCancel={true}
            orgs={user.memberOfOrgs}
            user={user}
          />
        </Box>
      );
    }
  }

  const clients = getUserClientListForOrg(user, activeOrgId);

  if (clients.length === 0) {
    return (
      <Box className="flex-centered" sx={{ height: '100%' }}>
        <CreateClientScreen org={org} />
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
    org,
    user,
    folders: sortedFolders,
    tasks: sortedTasks,
    tags: sortedTags,
    clientMembers,
    clientAdmins,
    orgUsers,
    orgUsersMap,
    tagsMap,
    foldersMap,
    tasksMap,
    isAdmin,
    widgets: sortedWidgets,
    setTags,
    setTasks,
    setFolders,
    setOrgUsers,
    setWidgets,
    setUser,
    openSnackBar,
    openModal,
    openDrawer
  };

  return (
    <Box>
      <SideNav
        org={org}
        client={client}
        isSideNavOpen={isSideNavOpen}
      />
      <Box
        component="main"
        ml={isSideNavOpen ? '280px' : '0px'}
        sx={{ transition: 'margin 200ms' }}
        px={5}>
        <Box
          maxWidth={isSideNavOpen ? '1200px' : '1450px'}
          m='auto'
          pt={2}
          pb={5}>
          <Grid container spacing={3}>
            <Header
              isAdmin={isAdmin}
              user={user}
              org={org}
              client={client}
              openModal={openModal}
              openDrawer={openDrawer}
              toggleSideNav={toggleSideNav}
              isSideNavOpen={isSideNavOpen}
            />

            <Modals
              {...context}
              modalToOpen={modalToOpen}
              closeModal={closeModal}
            />

            <Drawers
              {...context}
              {...drawerProps}
              drawerToOpen={drawerToOpen}
              closeDrawer={closeDrawer}
            />
            <Outlet context={context} />
          </Grid>
        </Box>
      </Box>

      <Snackbar
        isOpen={isOpen}
        type={type}
        message={message}
      />
    </Box >
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