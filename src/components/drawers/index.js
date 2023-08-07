import CreateFolderDrawer from "./CreateFolderDrawer";
import CreateTaskDrawer from "./CreateTaskDrawer";
import GettingStartedDrawer from "./GettingStartedDrawer";
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

      <GettingStartedDrawer
        isOpen={drawerToOpen === 'getting-started'}
        close={closeDrawer}
      />
    </>
  );
};
