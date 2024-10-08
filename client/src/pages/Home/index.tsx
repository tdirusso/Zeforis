import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import SideNav from "../../components/core/SideNav";
import { Box, Grid, Theme } from "@mui/material";
import ChooseEngagementDialog from "../../components/dialogs/ChooseEngagementDialog";
import useSnackbar from "../../hooks/useSnackbar";
import Snackbar from "../../components/core/Snackbar";
import { deleteActiveEngagementId, getActiveEngagementId, getEngagement, getEngagementsForOrg, setActiveEngagementId } from "../../api/engagements";
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
import { Org, OrgUsersMap } from "@shared/types/Org";
import { Engagement } from "@shared/types/Engagement";
import { Task, TasksMap } from "@shared/types/Task";
import { Folder, FoldersMap } from "@shared/types/Folder";
import { Tag, TagsMap } from "@shared/types/Tag";
import { User } from "@shared/types/User";
import { Widget } from "@shared/types/Widget";
import useUser from "src/hooks/useUser";
import { Invitation } from "@shared/types/Invitation";

export default function Home({ setTheme }: { setTheme: (theme: Theme) => void; }) {
  let activeOrgId = getActiveOrgId();
  let activeEngagementId = getActiveEngagementId();

  const [isDataFetched, setDataFetched] = useState(false);
  const [isReadyToRender, setReadyToRender] = useState(false);
  const [engagement, setEngagement] = useState<Engagement | null>(null);
  const [engagements, setEngagements] = useState<Engagement[]>([]);
  const [org, setOrg] = useState<Org | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [orgUsers, setOrgUsers] = useState<User[]>([]);
  const [tasksMap, setTasksMap] = useState({});
  const [tagsMap, setTagsMap] = useState({});
  const [foldersMap, setFoldersMap] = useState<FoldersMap>({});
  const [orgUsersMap, setOrgUsersMap] = useState<OrgUsersMap>({});
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOrgOwner, setIsOrgOwner] = useState(false);
  const [engagementMembers, setEngagementMembers] = useState<User[]>([]);
  const [engagementAdmins, setEngagementAdmins] = useState<User[]>([]);
  const [orgOwnerPlan, setOrgOwnerPlan] = useState('');
  const [triedOrgAndEngagement, setTriedOrgAndEngagement] = useState(false);

  const {
    isOpen,
    openSnackBar,
    type,
    message,
    snackbarProps
  } = useSnackbar();

  const { user, setUser } = useUser(openSnackBar);

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
    if (user && !isReadyToRender) {
      getActiveOrgAndEngagement(user);
    }

    async function getActiveOrgAndEngagement(user: User) {
      let activeOrg: Org | null = null;

      if (user.orgs?.length === 1) {
        activeOrg = user.orgs[0];
      } else if (activeOrgId) {
        activeOrg = user.orgs?.find(org => org.id === activeOrgId) || null;
      }

      if (activeOrg) {
        document.title = `${activeOrg.name} Portal`;

        const isOwnerOfActiveOrg = activeOrg.ownerId === user.id;
        const brandRGB = hexToRgb(activeOrg.brandColor);

        if (brandRGB) {
          document.documentElement.style.setProperty('--colors-primary', activeOrg.brandColor);
          document.documentElement.style.setProperty('--colors-primary-rgb', `${brandRGB.r}, ${brandRGB.g}, ${brandRGB.b}`);
          themeConfig.palette!.primary!.main = activeOrg.brandColor;
        }

        updateTheme(setTheme);
        setOrg(activeOrg);
        setIsOrgOwner(isOwnerOfActiveOrg);

        const orgEngagements = await getEngagementsForOrg(activeOrg.id);

        setEngagements(orgEngagements);

        let activeEngagement = null;

        if (orgEngagements.length === 1) {
          activeEngagement = orgEngagements[0];
        } else if (activeEngagementId) {
          activeEngagement = orgEngagements.find(engagement => engagement.id === activeEngagementId);
        }

        if (activeEngagement) {
          setEngagement(activeEngagement);
        }
      }

      setTriedOrgAndEngagement(true);
    }
  }, [user]);

  useEffect(() => {
    if (triedOrgAndEngagement) {
      if (engagement && tasks.length === 0 && org) {
        document.addEventListener('keyup', e => {
          if (e.key === 'Escape') {
            closeDrawer();
          }
        });

        getEngagementData(engagement.id);
      } else if (!engagement && org) {
        if (engagements.length === 1) {
          setActiveEngagementId(engagements[0].id);
          setEngagement(engagements[0]);
          getEngagementData(engagements[0].id);
        } else {
          setReadyToRender(true);
        }
      } else {
        setReadyToRender(true);
      }
    }

    async function getEngagementData(engagementId: number) {
      try {
        const engagementData = await getEngagement(engagementId);

        setTasks(engagementData.tasks || []);
        setFolders(engagementData.folders || []);
        setInvitations(engagementData.invitations || []);
        setTags(engagementData.tags || []);
        setOrgUsers(engagementData.metadata?.orgUsers || []);
        setOrgOwnerPlan(engagementData.metadata?.orgOwnerPlan || '');
        setWidgets(engagementData.widgets || []);
        setDataFetched(true);
      } catch (error: unknown) {
        if (error instanceof Error) {
          deleteActiveEngagementId();
          deleteActiveOrgId();
          openSnackBar(error.message);
          setTimeout(() => {
            return window.location.reload();
          }, 1000);
        }
      }
    }
  }, [triedOrgAndEngagement]);

  useEffect(() => {
    if (isDataFetched) {
      if (!isReadyToRender) {
        tasks.sort((a, b) => (a.task_name && b.task_name) ? a.task_name.localeCompare(b.task_name) : 0);
      }

      const foldersMapResult: FoldersMap = {};
      folders.forEach(folder => {
        if (folder.name !== '_hidden_') {
          foldersMapResult[folder.id] = { ...folder, tasks: [] };
        }
      });

      const tasksMapResult: TasksMap = {};

      tasks.forEach(task => {
        const theFolder = foldersMapResult[task.folder_id];
        if (theFolder && theFolder.tasks) {
          theFolder.tasks.push(task);
          tasksMapResult[task.task_id] = task;
        }
      });

      const tagsMapResult: TagsMap = {};

      tags.forEach(tag => {
        tagsMapResult[tag.id] = tag;
      });

      const orgUsersMapResult: OrgUsersMap = {};
      const engagementMembersResult: User[] = [];
      const engagementAdminsResult: User[] = [];

      let isAdminResult = false;

      orgUsers?.forEach(orgUser => {
        orgUsersMapResult[orgUser.id] = orgUser;

        if (orgUser.adminOfEngagements?.some(engagementObj => engagementObj.id === engagement?.id)) {
          engagementAdminsResult.push({ ...orgUser, role: 'Administrator' });
          if (orgUser.id === user!.id) isAdminResult = true;
        }

        if (orgUser.memberOfEngagements?.some(engagementObj => engagementObj.id === engagement?.id)) {
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

  if (!org && user) {
    if (user.orgs?.length === 1) {
      setActiveOrgId(user.orgs[0].id);
      setOrg(user.orgs[0]);
    } else if (user.orgs?.length === 0) {
      window.location.href = '/create-org';
      return null;
    } else {
      return (
        <ChooseOrgScreen
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
              org={org!}
              openSnackBar={openSnackBar}
              isOpen={true}
              user={user!}
            /> :
            <NoEngagementsDialog
              org={org!}
              isOpen={true}
              user={user!}
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
          org={org!}
          user={user!}
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
    folders: Object.values(foldersMap).sort((a, b) => (a.name && b.name) ? a.name.localeCompare(b.name) : 0),
    tasks,//tasks.sort((a, b) => a.task_name?.localeCompare(b.task_name)),
    tags: tags.sort((a, b) => (a.name && b.name) ? a.name.localeCompare(b.name) : 0),
    engagementMembers,
    engagementAdmins,
    invitations: invitations.sort((a, b) => (a.email && b.email) ? a.email.localeCompare(b.email) : 0),
    orgUsers: orgUsers.sort((a, b) => (a.firstName && b.firstName) ? a.firstName.localeCompare(b.firstName) : 0),
    orgUsersMap,
    tagsMap,
    foldersMap,
    tasksMap,
    isAdmin,
    widgets: widgets.sort((a, b) => (a.name && b.name) ? a.name.localeCompare(b.name) : 0),
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
    setInvitations,
    openSnackBar,
    openModal,
    openDrawer,
    openDialog,
    openContextMenu
  };

  return (
    <Box className='Home'>
      <SideNav
        org={org!}
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
              user={user!}
              org={org!}
              engagement={engagement}
              openModal={openModal}
              openDrawer={openDrawer}
              openDialog={openDialog}
              toggleSideNav={toggleSideNav}
              isSideNavOpen={isSideNavOpen}
              setTheme={setTheme}
            />

            <Modals
              setTasks={setTasks}
              modalProps={modalProps}
              modalToOpen={modalToOpen}
              closeModal={closeModal}
              user={user!}
              engagements={engagements}
              org={org!}
              openSnackBar={openSnackBar}
              foldersMap={foldersMap}
              setFolders={setFolders}
              engagement={engagement}
              folders={folders}
              tasksMap={tasksMap}
              engagementAdmins={engagementAdmins}
              engagementMembers={engagementMembers}
              tags={tags}
              tasks={tasks}
              setOrgUsers={setOrgUsers}
              orgUsersMap={orgUsersMap}
              orgUsers={orgUsers}
              openDrawer={openDrawer}
              setEngagement={setEngagement}
            />

            <Drawers
              drawerProps={drawerProps}
              drawerToOpen={drawerToOpen}
              closeDrawer={closeDrawer}
              setTasks={setTasks}
              user={user!}
              org={org!}
              openSnackBar={openSnackBar}
              foldersMap={foldersMap}
              setFolders={setFolders}
              engagement={engagement}
              folders={folders}
              tasksMap={tasksMap}
              engagementAdmins={engagementAdmins}
              engagementMembers={engagementMembers}
              tags={tags}
              tasks={tasks}
              setTags={setTags}
              openModal={openModal}
              isAdmin={isAdmin}
              tagsMap={tagsMap}
            />

            <Dialogs
              dialogToOpen={dialogToOpen}
              closeDialog={closeDialog}
              openSnackBar={openSnackBar}
              engagement={engagement}
              engagements={engagements}
              org={org!}
              user={user!}
            />

            <ContextMenus
              contextMenuProps={contextMenuProps}
              mouseCoords={mouseCoords}
              contextMenuToOpen={contextMenuToOpen}
              closeContextMenu={closeContextMenu}
            />

            {
              user && isAdmin ?
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
        snackbarProps={snackbarProps}
      />
    </Box>
  );
};