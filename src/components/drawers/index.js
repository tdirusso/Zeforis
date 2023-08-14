import FolderDrawer from "./FolderDrawer";
import CreateTaskDrawer from "./CreateTaskDrawer";
import AdminGettingStartedDrawer from "./AdminGettingStartedDrawer";
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

      <FolderDrawer
        {...props}
        isOpen={drawerToOpen === 'folder'}
        close={closeDrawer}
      />

      <TaskDrawer
        {...props}
        isOpen={drawerToOpen === 'task'}
        close={closeDrawer}
      />

      <AdminGettingStartedDrawer
        {...props}
        isOpen={drawerToOpen === 'getting-started-admin'}
        close={closeDrawer}
      />
    </>
  );
};
