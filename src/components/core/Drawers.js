import CreateFolderDrawer from "../admin/CreateFolderDrawer";
import CreateTaskDrawer from "../admin/CreateTaskDrawer";
import ChangeOrgOrClientDrawer from "./ChangeOrgOrClientDrawer";
import TaskDrawer from "./TaskDrawer";

export default function Drawers(props) {
  const {
    drawerToOpen,
    closeDrawer
  } = props;

  return (
    <>
      <CreateTaskDrawer
        {...props}
        isOpen={drawerToOpen === 'create-task'}
        close={closeDrawer}
      />

      <ChangeOrgOrClientDrawer
        {...props}
        isOpen={drawerToOpen === 'change-org-or-client'}
        close={closeDrawer}
      />

      <CreateFolderDrawer
        {...props}
        isOpen={drawerToOpen === 'create-folder'}
        close={closeDrawer}
      />

      <TaskDrawer
        {...props}
        isOpen={drawerToOpen === 'task'}
        close={closeDrawer}
      />
    </>
  );
};
