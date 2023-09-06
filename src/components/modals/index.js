import DeleteEngagementModal from "./DeleteEngagementModal";
import DeleteOrgModal from "./DeleteOrgModal";
import DeleteFolderModal from "./DeleteFolderModal";
import DeleteTasksModal from "./DeleteTasksModal";
import EditUserPermissionsModal from "./EditUserPermissionsModal";
import RemoveOrgUserModal from "./RemoveOrgUserModal";
import SearchModal from "./SearchModal";
import './styles.scss';
import EditSelectedTasksModal from "./EditSelectedTasksModal";
import InviteEngagementUser from "./InviteEngagementUser";

export default function Modals(props) {
  const {
    modalToOpen,
    closeModal
  } = props;

  return (
    <>
      <SearchModal
        isOpen={modalToOpen === 'search'}
        close={closeModal}
        {...props}
      />

      <DeleteEngagementModal
        isOpen={modalToOpen === 'delete-engagement'}
        close={closeModal}
        {...props}
      />

      <DeleteOrgModal
        isOpen={modalToOpen === 'delete-org'}
        close={closeModal}
        {...props}
      />

      <DeleteFolderModal
        isOpen={modalToOpen === 'delete-folder'}
        close={closeModal}
        {...props}
      />

      <DeleteTasksModal
        isOpen={modalToOpen === 'delete-tasks'}
        close={closeModal}
        {...props}
      />

      <EditUserPermissionsModal
        isOpen={modalToOpen === 'edit-permissions'}
        close={closeModal}
        {...props}
      />

      <RemoveOrgUserModal
        isOpen={modalToOpen === 'remove-user'}
        close={closeModal}
        {...props}
      />

      <EditSelectedTasksModal
        isOpen={modalToOpen === 'edit-tasks'}
        close={closeModal}
        {...props}
      />

      <InviteEngagementUser
        isOpen={modalToOpen === 'invite-engagement-user'}
        close={closeModal}
        {...props}
      />
    </>
  );
};
