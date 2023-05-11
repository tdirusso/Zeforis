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
    </>
  );
};
