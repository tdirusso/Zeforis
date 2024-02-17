import DeleteEngagementModal from "./DeleteEngagementModal";
import DeleteOrgModal from "./DeleteOrgModal";
import DeleteFolderModal from "./DeleteFolderModal";
import DeleteTasksModal from "./DeleteTasksModal";
import EditUserPermissionsModal from "./EditUserPermissionsModal";
import RemoveOrgUserModal from "./RemoveOrgUserModal";
import SearchModal from "./SearchModal";
import './styles.scss';
import EditSelectedTasksModal from "./EditSelectedTasksModal";
import InviteOrgUsers from "./InviteOrgUsers";
import SubscriptionPastDueModal from "./SubscriptionPastDueModal";
import CloseAccountModal from "./CloseAccountModal";
import UpgradeModal from "./UpgradeModal";
import MoveFolderModal from "./MoveFolderModal";
import { AppContext } from "src/types/AppContext";
import { Engagement } from "@shared/types/Engagement";
import { Org } from "@shared/types/Org";
import { User } from "@shared/types/User";
import { Folder } from "@shared/types/Folder";
import { Tag } from "@shared/types/Tag";
import { Task } from "@shared/types/Task";

type ModalsProps = {
  modalToOpen?: string,
  closeModal: () => void,
  openSnackBar: AppContext['openSnackBar'],
  openDialog?: AppContext['openDialog'],
  openModal?: AppContext['openModal'],
  engagements: Engagement[],
  org: Org,
  user: User,
  engagement: Engagement,
  modalProps?: {
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
  setOrgUsers: AppContext['setOrgUsers'];
  orgUsersMap: AppContext['orgUsersMap'];
  orgUsers: AppContext['orgUsers'];
  openDrawer: AppContext['openDrawer'];
};

export default function Modals(props: ModalsProps) {
  const {
    modalToOpen,
    closeModal,
    openSnackBar,
    modalProps,
    foldersMap,
    folders,
    engagement,
    setFolders,
    org,
    setTasks,
    tasksMap,
    engagementAdmins,
    engagementMembers,
    tags,
    engagements,
    tasks,
    setOrgUsers,
    orgUsersMap,
    orgUsers,
    user,
    openDrawer
  } = props;

  return (
    <>
      <SearchModal
        isOpen={modalToOpen === 'search'}
        closeModal={closeModal}
        folders={folders}
        tasks={tasks}
        openDrawer={openDrawer}
      />

      <DeleteEngagementModal
        isOpen={modalToOpen === 'delete-engagement'}
        closeModal={closeModal}
        engagement={engagement}
        openSnackBar={openSnackBar}
        org={org}
      />

      <DeleteOrgModal
        isOpen={modalToOpen === 'delete-org'}
        closeModal={closeModal}
        openSnackBar={openSnackBar}
        org={org}
      />

      <DeleteFolderModal
        isOpen={modalToOpen === 'delete-folder'}
        closeModal={closeModal}
        folderId={modalProps?.folderId}
        engagement={engagement}
        foldersMap={foldersMap}
        setFolders={setFolders}
        setTasks={setTasks}
        openSnackBar={openSnackBar}
      />

      <DeleteTasksModal
        isOpen={modalToOpen === 'delete-tasks'}
        closeModal={closeModal}
        taskIds={modalProps?.tasksIds}
        setSelectedTasks={modalProps?.setSelectedTasks}
        setTasks={setTasks}
        engagement={engagement}
        tasksMap={tasksMap}
        openSnackBar={openSnackBar}
      />

      <EditUserPermissionsModal
        isOpen={modalToOpen === 'edit-permissions'}
        closeModal={closeModal}
        user={modalProps?.user}
        engagements={engagements}
        setOrgUsers={setOrgUsers}
        orgUsersMap={orgUsersMap}
        openSnackBar={openSnackBar}
        org={org}
        tasks={tasks}
        setTasks={setTasks}
      />

      <RemoveOrgUserModal
        isOpen={modalToOpen === 'remove-user'}
        closeModal={closeModal}
        org={org}
        setOrgUsers={setOrgUsers}
        openSnackBar={openSnackBar}
        user={modalProps?.userToRemove}
        tasks={tasks}
        setTasks={setTasks}
      />

      <EditSelectedTasksModal
        isOpen={modalToOpen === 'edit-tasks'}
        closeModal={closeModal}
        taskIds={modalProps?.taskIds}
        setSelectedTasks={modalProps?.setSelectedTasks}
        engagementAdmins={engagementAdmins}
        engagementMembers={engagementMembers}
        folders={folders}
        setTasks={setTasks}
        engagement={engagement}
        tasksMap={tasksMap}
        openSnackBar={openSnackBar}
        tags={tags}
      />

      <InviteOrgUsers
        isOpen={modalToOpen === 'invite-engagement-users'}
        closeModal={closeModal}
        openSnackBar={openSnackBar}
        org={org}
        orgUsers={orgUsers}
        engagement={engagement}
        user={user}
        orgUsersMap={orgUsersMap}
        setOrgUsers={setOrgUsers}
      />

      <SubscriptionPastDueModal
        isOpen={modalToOpen === 'subscription-past-due'}
        closeModal={closeModal}
      />

      <CloseAccountModal
        isOpen={modalToOpen === 'close-account'}
        closeModal={closeModal}
        openSnackBar={openSnackBar}
      />

      <UpgradeModal
        isOpen={modalToOpen === 'upgrade'}
        closeModal={closeModal}
      />

      <MoveFolderModal
        isOpen={modalToOpen === 'move-folder'}
        closeModal={closeModal}
        moveFolderId={modalProps?.moveFolderId}
        foldersMap={foldersMap}
        folders={folders}
        openSnackBar={openSnackBar}
        engagementId={engagement?.id}
        setFolders={setFolders}
      />
    </>
  );
};
