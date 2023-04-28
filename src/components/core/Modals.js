import AddTaskModal from "../admin/AddTaskModal";

export default function Modals(props) {
  const {
    modalToOpen,
    closeModal
  } = props;

  return (
    <>
      <AddTaskModal
        {...props}
        isOpen={modalToOpen === 'add-task'}
        close={closeModal}
      />
    </>
  );
};
