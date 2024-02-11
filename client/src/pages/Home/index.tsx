import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { Outlet } from "react-router-dom";
import SideNav from "../../components/core/SideNav";
import { Box, Grid, Theme } from "@mui/material";
import ChooseEngagementDialog from "../../components/dialogs/ChooseEngagementDialog";
import useSnackbar from "../../hooks/useSnackbar";
import Snackbar from "../../components/core/Snackbar";
import { deleteActiveEngagementId, getActiveEngagementId, getEngagementData, getUserEngagementsForOrg, setActiveEngagementId } from "../../api/engagements";
import CreateEngagementDialog from "../../components/dialogs/CreateEngagementDialog";
import { deleteActiveOrgId, getActiveOrgId, setActiveOrgId } from "../../api/orgs";
import Loader from "../../components/core/Loader";
import themeConfig from "../../theme";
import Header from "../../components/core/Header";
import Modals from "../../components/modals";
import useModal from "../../hooks/useModal";
import Drawers from "../../components/drawers";
import useDrawer from "../../hooks/useDrawer";
import useSideNav from "../../hooks/useSideNav";
import { hexToRgb, updateTheme } from "../../lib/utils";
import useDialog from "../../hooks/useDialog";
import Dialogs from "../../components/dialogs";
import ChooseOrgScreen from "../../components/core/ChooseOrgScreen";
import './styles.scss';
import NoEngagementsDialog from "../../components/dialogs/NoEngagementsDialog";
import useNotification from "../../hooks/useNotification";
import ActionCenter from "../../components/admin/ActionCenter";
import useContextMenu from "../../hooks/useContextMenu";
import ContextMenus from "../../components/core/contextMenus";
import { Org } from "@shared/types/Org";

export default function Home({ setTheme }: { setTheme: (theme: Theme) => void; }) {
  let activeOrgId = getActiveOrgId();
  let activeEngagementId = getActiveEngagementId();

  const { user, authError, setUser } = useAuth();
  const [isDataFetched, setDataFetched] = useState(false);
  const [isReadyToRender, setReadyToRender] = useState(false);
  const [engagement, setEngagement] = useState(null);
  const [engagements, setEngagements] = useState([]);
  const [org, setOrg] = useState<Org | null>(null);
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
  const [orgOwnerPlan, setOrgOwnerPlan] = useState(null);
  const [triedOrgAndEngagement, setTriedOrgAndEngagement] = useState(false);

  const {
    isOpen,
    openSnackBar,
    type,
    message,
    snackBarProps
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

  const {
    contextMenuToOpen,
    contextMenuProps,
    mouseCoords,
    openContextMenu,
    closeContextMenu
  } = useContextMenu();

  useNotification({ user, openModal, isOrgOwner });

  useEffect(() => {
    if (user) {
      let activeOrg: Org | null = null;

      if (user.memberOfOrgs?.length === 1) {
        activeOrg = user.memberOfOrgs[0];
      } else if (activeOrgId) {
        activeOrg = user.memberOfOrgs?.find(org => org.id === activeOrgId) || null;
      }

      if (activeOrg) {
        const isOwnerOfActiveOrg = activeOrg.ownerId === user.id;

        const brandRGB = hexToRgb(activeOrg.brandColor);
        document.documentElement.style.setProperty('--colors-primary', activeOrg.brandColor);
        document.documentElement.style.setProperty('--colors-primary-rgb', `${brandRGB.r}, ${brandRGB.g}, ${brandRGB.b}`);
        themeConfig.palette.primary.main = activeOrg.brandColor;
        document.title = `${activeOrg.name} Portal`;

        const userEngagementsForOrg = getUserEngagementsForOrg(user, activeOrg.id);

        updateTheme(setTheme);
        setOrg(activeOrg);
        setIsOrgOwner(isOwnerOfActiveOrg);
        setEngagements(userEngagementsForOrg);

        let activeEngagement = null;

        if (userEngagementsForOrg.length === 1) {
          activeEngagement = userEngagementsForOrg[0];
        } else if (activeEngagementId) {
          activeEngagement = userEngagementsForOrg.find(engagement => engagement.id === activeEngagementId);
        }

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

        fetchEngagementData(engagement.id, org.id);
      } else if (!engagement && org) {
        if (engagements.length === 1) {
          setActiveEngagementId(engagements[0].id);
          setEngagement(engagements[0]);
          fetchEngagementData(engagements[0].id, org.id);
        } else {
          setReadyToRender(true);
        }
      } else {
        setReadyToRender(true);
      }
    }

    async function fetchEngagementData(engagementId, orgId) {
      const result = await getEngagementData(engagementId, orgId);

      if (!result.engagement) {
        deleteActiveEngagementId();
        deleteActiveOrgId();
        openSnackBar(result.message);
        setTimeout(() => {
          return window.location.reload();
        }, 1000);
      }

      setTasks(result.engagement.tasks);
      setFolders(result.engagement.folders);
      setTags(result.engagement.tags);
      setOrgUsers(result.engagement.metadata.orgUsers);
      setOrgOwnerPlan(result.engagement.metadata.orgOwnerPlan);
      setWidgets(result.engagement.widgets);
      setDataFetched(true);
    }
  }, [triedOrgAndEngagement]);

  useEffect(() => {
    if (isDataFetched) {
      if (!isReadyToRender) {
        tasks.sort((a, b) => a.task_name?.localeCompare(b.task_name));
      }

      const foldersMapResult = {};
      folders.forEach(folder => {
        if (folder.name !== '_hidden_') {
          foldersMapResult[String(folder.id)] = { ...folder, tasks: [] };
        }
      });

      const tasksMapResult = {};

      tasks.forEach(task => {
        foldersMapResult[task.folder_id]?.tasks.push(task);
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

      orgUsers?.forEach(orgUser => {
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
    return (
      <>
        <Loader />
        <Snackbar
          isOpen={isOpen}
          type={type}
          message={message}
        />
      </>
    );
  }

  if (!org) {
    if (user.memberOfOrgs.length === 1) {
      setActiveOrgId(user.memberOfOrgs[0].id);
      setOrg(user.memberOfOrgs[0]);
    } else if (user.memberOfOrgs.length === 0) {
      window.location.href = '/create-org';
      return null;
    } else {
      return (
        <ChooseOrgScreen
          open={true}
          setOpen={() => { }}
          orgs={user.memberOfOrgs}
          user={user}
        />
      );
    }
  }

  if (engagements.length === 0) {
    return (
      <Box className="flex-centered" style={{ height: '100vh' }}>
        {
          isOrgOwner ?
            <CreateEngagementDialog
              org={org}
              openSnackBar={openSnackBar}
              isOpen={true}
              user={user}
            /> :
            <NoEngagementsDialog
              org={org}
              isOpen={true}
              user={user}
            />
        }
        <Snackbar
          isOpen={isOpen}
          type={type}
          message={message}
        />
      </Box>
    );
  }

  if (!engagement) {
    return (
      <Box className="flex-centered" style={{ height: '100vh' }}>
        <ChooseEngagementDialog
          engagements={engagements}
          org={org}
          user={user}
          isOpen={true}
        />
      </Box>
    );
  }

  const context = {
    engagement,
    engagements,
    org,
    user,
    folders: Object.values(foldersMap).sort((a, b) => a.name?.localeCompare(b.name)),
    tasks: tasks.sort((a, b) => a.task_name?.localeCompare(b.task_name)),
    tags: tags.sort((a, b) => a.name?.localeCompare(b.name)),
    engagementMembers,
    engagementAdmins,
    orgUsers: orgUsers.sort((a, b) => a.firstName?.localeCompare(b.firstName)),
    orgUsersMap,
    tagsMap,
    foldersMap,
    tasksMap,
    isAdmin,
    widgets: widgets.sort((a, b) => a.name?.localeCompare(b.name)),
    setTheme,
    isOrgOwner,
    orgOwnerPlan,
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
    openDialog,
    openContextMenu
  };

  return (
    <Box>
      <SideNav
        org={org}
        engagement={engagement}
        isSideNavOpen={isSideNavOpen}
        isAdmin={isAdmin}
        toggleSideNav={toggleSideNav}
      />
      <main
        style={{
          marginLeft: isSideNavOpen ? '280px' : '0px'
        }}>
        <Box
          className="content"
          style={{
            maxWidth: '1500px'
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
              setTheme={setTheme}
              isOrgOwner={isOrgOwner}
            />

            <Modals
              {...context}
              {...modalProps}
              modalToOpen={modalToOpen}
              closeModal={closeModal}
            />

            <Drawers
              {...context}
              drawerProps={drawerProps}
              drawerToOpen={drawerToOpen}
              closeDrawer={closeDrawer}
            />

            <Dialogs
              {...context}
              {...dialogProps}
              dialogToOpen={dialogToOpen}
              closeDialog={closeDialog}
            />

            <ContextMenus
              {...context}
              contextMenuProps={contextMenuProps}
              mouseCoords={mouseCoords}
              contextMenuToOpen={contextMenuToOpen}
              closeContextMenu={closeContextMenu}
            />

            {
              isAdmin ?
                <ActionCenter
                  openDialog={openDialog}
                  openDrawer={openDrawer}
                  isOrgOwner={isOrgOwner}
                  openModal={openModal}
                  user={user}
                /> :
                null
            }

            <Outlet context={context} />
          </Grid>
        </Box>
      </main>

      <Snackbar
        isOpen={isOpen}
        type={type}
        message={message}
        snackBarProps={snackBarProps}
      />
    </Box>
  );
};