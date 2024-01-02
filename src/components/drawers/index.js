import FolderDrawer from "./FolderDrawer";
import CreateTaskDrawer from "./CreateTaskDrawer";
import GettingStartedDrawer from "./GettingStartedDrawer";
import TaskDrawer from "./TaskDrawer";

export default function Drawers(props) {
  const {
    drawerToOpen,
    closeDrawer,
    drawerProps
  } = props;

  return (
    <>
      <CreateTaskDrawer
        {...props}
        isOpen={drawerToOpen === 'create-task'}
        close={closeDrawer}
        drawerProps={drawerProps}
      />

      <FolderDrawer
        {...props}
        isOpen={drawerToOpen === 'folder'}
        close={closeDrawer}
        drawerProps={drawerProps}
      />

      <TaskDrawer
        {...props}
        isOpen={drawerToOpen === 'task'}
        close={closeDrawer}
        drawerProps={drawerProps}
      />

      <GettingStartedDrawer
        {...props}
        isOpen={drawerToOpen === 'getting-started'}
        close={closeDrawer}
      />
    </>
  );
};
