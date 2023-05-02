import CreateTaskDrawer from "../admin/CreateTaskDrawer";
import AddTaskModal from "../admin/AddTaskModal";
import ChangeOrgOrClientDrawer from "./ChangeOrgOrClientDrawer";

export default function Drawers(props) {
  const {
    drawerToOpen,
    closeDrawer
  } = props;

  return (
    <>
      <CreateTaskDrawer
        {...props}
        isOpen={drawerToOpen === 'add-task'}
        close={closeDrawer}
      />

      <ChangeOrgOrClientDrawer
        {...props}
        isOpen={drawerToOpen === 'change-org-or-client'}
        close={closeDrawer}
      />
    </>
  );
};
