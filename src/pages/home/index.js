/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { Outlet, useLocation } from "react-router-dom";
import SideNav from "../../components/core/SideNav";
import { Box, Grid, createTheme } from "@mui/material";
import SelectEngagementScreen from "../../components/core/SelectEngagementScreen";
import useSnackbar from "../../hooks/useSnackbar";
import Snackbar from "../../components/core/Snackbar";
import { getActiveEngagementId, getEngagementData, getUserEngagementListForOrg, setActiveEngagementId } from "../../api/engagements";
import CreateEngagementScreen from "../../components/admin/CreateEngagementScreen";
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
import { hexToRgb } from "../../lib/utils";
import useDialog from "../../hooks/useDialog";
import Dialogs from "../../components/core/Dialogs";

export default function Home({ setTheme }) {
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);

  const orgIdPassed = queryParams.get('orgId');
  const engagementIdPassed = queryParams.get('engagementId');

  if (orgIdPassed && engagementIdPassed) {
    setActiveOrgId(orgIdPassed);
    setActiveEngagementId(engagementIdPassed);
    window.location = window.location.href.split('?')[0];
  }

  let activeOrgId = getActiveOrgId();
  let activeEngagementId = getActiveEngagementId();

  const { user, authError, setUser } = useAuth();
  const [isLoading, setLoading] = useState(true);
  const [engagement, setEngagement] = useState(null);
  const [org, setOrg] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [folders, setFolders] = useState([]);
  const [tags, setTags] = useState([]);
  const [widgets, setWidgets] = useState([]);
  const [orgUsers, setOrgUsers] = useState([]);
  const [triedOrgAndEngagement, setTriedOrgAndEngagement] = useState(false);

  const {
    isOpen,
    openSnackBar,
    type,
    message
  } = useSnackbar();

  const {
    modalToOpen,
    modalProps,
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

  const {
    dialogToOpen,
    dialogProps,
    openDialog,
    closeDialog
  } = useDialog();

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

      if (activeEngagementId) {
        const activeEngagement = user.adminOfEngagements.concat(user.memberOfEngagements).find(engagement => {
          return engagement.id === activeEngagementId;
        });

        if (activeEngagement) {
          setEngagement(activeEngagement);
        }
      }

      setTriedOrgAndEngagement(true);
    } else if (authError) {
      openSnackBar(authError, 'error');
    }
  }, [user, authError]);

  useEffect(() => {
    if (triedOrgAndEngagement) {
      if (engagement && tasks.length === 0) {
        document.addEventListener('keyup', e => {
          if (e.key === 'Escape') {
            closeDrawer();
          }
        });

        fetchEngagementData();
      } else if (!engagement) {
        setLoading(false);
      }
    }

    async function fetchEngagementData() {
      const result = await getEngagementData(engagement.id, org.id);
      setTasks(result.tasks);
      setFolders(result.folders);
      setTags(result.tags);
      setOrgUsers(result.orgUsers);
      setWidgets(result.widgets);
      setLoading(false);
    }
  }, [triedOrgAndEngagement]);

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
  const engagementMembers = [];
  const engagementAdmins = [];

  orgUsers.forEach(orgUser => {
    if (orgUser.adminOfEngagements.some(engagementObj => engagementObj.id === engagement?.id)) {
      engagementAdmins.push({ ...orgUser, role: 'Administrator' });
      if (orgUser.id === user.id) isAdmin = true;
    }

    if (orgUser.memberOfEngagements.some(engagementObj => engagementObj.id === engagement?.id)) {
      engagementMembers.push({ ...orgUser, role: 'Member' });
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

  const engagements = getUserEngagementListForOrg(user, activeOrgId);

  if (engagements.length === 0) {
    return (
      <Box className="flex-centered" sx={{ height: '100%' }}>
        <CreateEngagementScreen org={org} />
      </Box>
    );
  }

  if (!engagement) {
    if (engagements.length === 1) {
      setActiveEngagementId(engagements[0].id);
      setEngagement(engagements[0]);
    } else {
      return (
        <Box className="flex-centered" sx={{ height: '100%' }}>
          <SelectEngagementScreen
            engagement={engagement}
            engagements={engagements}
          />
        </Box>
      );
    }
  }

  const context = {
    engagement,
    engagements,
    org,
    user,
    folders: sortedFolders,
    tasks: sortedTasks,
    tags: sortedTags,
    engagementMembers,
    engagementAdmins,
    orgUsers,
    orgUsersMap,
    tagsMap,
    foldersMap,
    tasksMap,
    isAdmin,
    widgets: sortedWidgets,
    setTheme,
    setTags,
    setEngagement,
    setOrg,
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
        engagement={engagement}
        isSideNavOpen={isSideNavOpen}
        isAdmin={isAdmin}
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
              engagement={engagement}
              openModal={openModal}
              openDrawer={openDrawer}
              openDialog={openDialog}
              toggleSideNav={toggleSideNav}
              isSideNavOpen={isSideNavOpen}
            />

            <Modals
              {...context}
              {...modalProps}
              modalToOpen={modalToOpen}
              closeModal={closeModal}
            />

            <Drawers
              {...context}
              {...drawerProps}
              drawerToOpen={drawerToOpen}
              closeDrawer={closeDrawer}
            />

            <Dialogs
              {...context}
              {...dialogProps}
              dialogToOpen={dialogToOpen}
              closeDialog={closeDialog}
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