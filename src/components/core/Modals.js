import DeleteEngagementModal from "../admin/DeleteEngagementModal";
import DeleteOrgModal from "../admin/DeleteOrgModal";
import SearchModal from "./SearchModal";

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
    </>
  );
};
