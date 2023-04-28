import AddTaskDrawer from "../admin/AddTaskDrawer";
import AddTaskModal from "../admin/AddTaskModal";

export default function Drawers(props) {
  const {
    drawerToOpen,
    closeDrawer
  } = props;

  return (
    <>
      <AddTaskDrawer
        {...props}
        isOpen={drawerToOpen === 'add-task'}
        close={closeDrawer}
      />
    </>
  );
};
