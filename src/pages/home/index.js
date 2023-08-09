/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { Outlet, useLocation } from "react-router-dom";
import SideNav from "../../components/core/SideNav";
import { Box, Grid, createTheme } from "@mui/material";
import ChooseEngagementDialog from "../../components/dialogs/ChooseEngagementDialog";
import useSnackbar from "../../hooks/useSnackbar";
import Snackbar from "../../components/core/Snackbar";
import { getActiveEngagementId, getEngagementData, getUserEngagementListForOrg, setActiveEngagementId } from "../../api/engagements";
import CreateEngagementDialog from "../../components/dialogs/CreateEngagementDialog";
import { getActiveOrgId, setActiveOrgId } from "../../api/orgs";
import Loader from "../../components/core/Loader";
import themeConfig from "../../theme";
import Header from "../../components/core/Header";
import Modals from "../../components/core/Modals";
import useModal from "../../hooks/useModal";
import Drawers from "../../components/drawers";
import useDrawer from "../../hooks/useDrawer";
import useSideNav from "../../hooks/useSideNav";
import { hexToRgb } from "../../lib/utils";
import useDialog from "../../hooks/useDialog";
import Dialogs from "../../components/dialogs";
import ChooseOrgScreen from "../../components/core/ChooseOrgScreen";
import './styles.scss';

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
  const [isDataFetched, setDataFetched] = useState(false);
  const [isReadyToRender, setReadyToRender] = useState(false);
  const [engagement, setEngagement] = useState(null);
  const [org, setOrg] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [folders, setFolders] = useState([]);
  const [tags, setTags] = useState([]);
  const [widgets, setWidgets] = useState([]);
  const [orgUsers, setOrgUsers] = useState([]);
  const [tasksMap, setTasksMap] = useState({});
  const [tagsMap, setTagsMap] = useState({});
  const [foldersMap, setFoldersMap] = useState({});
  const [orgUsersMap, setOrgUsersMap] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOrgOwner, setIsOrgOwner] = useState(false);
  const [engagementMembers, setEngagementMembers] = useState([]);
  const [engagementAdmins, setEngagementAdmins] = useState([]);
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
        const activeOrg = user.memberOfOrgs.find(org => org.id === activeOrgId);

        if (activeOrg) {
          const isOwnerOfActiveOrg = activeOrg.ownerId === user.id;

          const brandRGB = hexToRgb(activeOrg.brandColor);
          document.documentElement.style.setProperty('--colors-primary', activeOrg.brandColor);
          document.documentElement.style.setProperty('--colors-primary-rgb', `${brandRGB.r}, ${brandRGB.g}, ${brandRGB.b}`);
          themeConfig.palette.primary.main = activeOrg.brandColor;
          document.title = `${activeOrg.name} Portal`;

          setTheme(createTheme(themeConfig));
          setOrg(activeOrg);
          setIsOrgOwner(isOwnerOfActiveOrg);
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
        setDataFetched(true);
      }
    }

    async function fetchEngagementData() {
      const result = await getEngagementData(engagement.id, org.id);
      setTasks(result.tasks);
      setFolders(result.folders);
      setTags(result.tags);
      setOrgUsers(result.orgUsers);
      setWidgets(result.widgets);
      setDataFetched(true);
    }
  }, [triedOrgAndEngagement]);

  useEffect(() => {
    if (isDataFetched) {
      const foldersMapResult = {};
      folders.forEach(folder => {
        foldersMapResult[String(folder.id)] = { ...folder, tasks: [] };
      });

      const tasksMapResult = {};

      tasks.forEach(task => {
        foldersMapResult[task.folder_id].tasks.push(task);
        tasksMapResult[task.task_id] = task;
      });

      const tagsMapResult = {};

      tags.forEach(tag => {
        tagsMapResult[tag.id] = tag;
      });

      const orgUsersMapResult = {};
      const engagementMembersResult = [];
      const engagementAdminsResult = [];
      let isAdminResult = false;

      orgUsers.forEach(orgUser => {
        orgUsersMapResult[orgUser.id] = orgUser;

        if (orgUser.adminOfEngagements.some(engagementObj => engagementObj.id === engagement?.id)) {
          engagementAdminsResult.push({ ...orgUser, role: 'Administrator' });
          if (orgUser.id === user.id) isAdminResult = true;
        }

        if (orgUser.memberOfEngagements.some(engagementObj => engagementObj.id === engagement?.id)) {
          engagementMembersResult.push({ ...orgUser, role: 'Member' });
        }
      });

      setFoldersMap(foldersMapResult);
      setTasksMap(tasksMapResult);
      setTagsMap(tagsMapResult);
      setOrgUsersMap(orgUsersMapResult);
      setEngagementMembers(engagementMembersResult);
      setEngagementAdmins(engagementAdminsResult);
      setIsAdmin(isAdminResult);
      setReadyToRender(true);
    }
  }, [tasks, folders, tags, orgUsers, isDataFetched]);

  if (!isReadyToRender) {
    return <Loader />;
  }

  if (!org) {
    if (user.memberOfOrgs.length === 1) {
      setActiveOrgId(user.memberOfOrgs[0].id);
      setOrg(user.memberOfOrgs[0]);
    } else if (user.memberOfOrgs.length === 0) {
      window.location.href = '/create-org';
      return;
    } else {
      return (
        <Box className="flex-centered" style={{ height: '100%' }}>
          <ChooseOrgScreen
            open={true}
            setOpen={() => { }}
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
      <Box className="flex-centered" style={{ height: '100%' }}>
        <CreateEngagementDialog
          org={org}
          openSnackBar={openSnackBar}
          isOpen={true}
        />
      </Box>
    );
  }

  if (!engagement) {
    if (engagements.length === 1) {
      setActiveEngagementId(engagements[0].id);
      setEngagement(engagements[0]);
    } else {
      return (
        <Box className="flex-centered" style={{ height: '100%' }}>
          <ChooseEngagementDialog
            engagements={engagements}
            org={org}
            user={user}
            isOpen={true}
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
    folders: Object.values(foldersMap),
    tasks,
    tags,
    engagementMembers,
    engagementAdmins,
    orgUsers,
    orgUsersMap,
    tagsMap,
    foldersMap,
    tasksMap,
    isAdmin,
    widgets,
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
    openDrawer,
    openDialog
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
        style={{
          marginLeft: isSideNavOpen ? '280px' : '0px'
        }}>
        <Box
          className="content"
          style={{
            maxWidth: isSideNavOpen ? '1200px' : '1450px'
          }}>
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
    </Box>
  );
};