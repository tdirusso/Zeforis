import FolderDrawer from "./FolderDrawer";
import CreateTaskDrawer from "./CreateTaskDrawer";
import GettingStartedDrawer from "./GettingStartedDrawer";
import TaskDrawer from "./TaskDrawer";
import { AppContext } from "src/types/AppContext";
import { Engagement } from "@shared/types/Engagement";
import { Org } from "@shared/types/Org";
import { User } from "@shared/types/User";
import { Folder } from "@shared/types/Folder";
import { Tag } from "@shared/types/Tag";
import { Task } from "@shared/types/Task";

type DrawersProps = {
  drawerToOpen: string,
  closeDrawer: () => void,
  openSnackBar: AppContext['openSnackBar'],
  openModal: AppContext['openModal'],
  org: Org,
  user: User,
  engagement: Engagement,
  drawerProps: {
    [key: string | number]: any;
  };
  folders: Folder[];
  setFolders: AppContext['setFolders'];
  foldersMap: AppContext['foldersMap'];
  setTasks: AppContext['setTasks'];
  tasksMap: AppContext['tasksMap'];
  engagementAdmins: User[];
  engagementMembers: User[];
  tags: Tag[];
  tasks: Task[];
  setTags: AppContext['setTags'];
  isAdmin: boolean;
  tagsMap: AppContext['tagsMap'];
};

export default function Drawers(props: DrawersProps) {
  const {
    drawerToOpen,
    closeDrawer,
    drawerProps,
    folders,
    engagementMembers,
    engagementAdmins,
    engagement,
    tags,
    setTags,
    setTasks,
    user,
    openSnackBar,
    setFolders,
    foldersMap,
    openModal,
    org,
    isAdmin,
    tagsMap,
    tasksMap
  } = props;

  return (
    <>
      <CreateTaskDrawer
        isOpen={drawerToOpen === 'create-task'}
        closeDrawer={closeDrawer}
        defaultFolder={drawerProps?.defaultFolder}
        folders={folders}
        engagementMembers={engagementMembers}
        engagementAdmins={engagementAdmins}
        engagement={engagement}
        tags={tags}
        setTags={setTags}
        setTasks={setTasks}
        user={user}
        openSnackBar={openSnackBar}
        setFolders={setFolders}
      />

      <FolderDrawer
        isOpen={drawerToOpen === 'folder'}
        closeDrawer={closeDrawer}
        engagement={engagement}
        openSnackBar={openSnackBar}
        setFolders={setFolders}
        foldersMap={foldersMap}
        openModal={openModal}
        folderProps={drawerProps?.folderProps}
      />

      <TaskDrawer
        isOpen={drawerToOpen === 'task'}
        closeDrawer={closeDrawer}
        isAdmin={isAdmin}
        folders={folders}
        engagementMembers={engagementMembers}
        engagementAdmins={engagementAdmins}
        engagement={engagement}
        tags={tags}
        setTags={setTags}
        openSnackBar={openSnackBar}
        foldersMap={foldersMap}
        setTasks={setTasks}
        user={user}
        tasksMap={tasksMap}
        tagsMap={tagsMap}
        taskProp={drawerProps?.taskProp}
      />

      <GettingStartedDrawer
        isOpen={drawerToOpen === 'getting-started'}
        closeDrawer={closeDrawer}
        org={org}
        engagement={engagement}
        isAdmin={isAdmin}
      />
    </>
  );
};
