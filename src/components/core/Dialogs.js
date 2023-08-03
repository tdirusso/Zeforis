import ChangeEngagementDialog from "./ChangeEngagementDialog";

export default function Dialogs(props) {
  const {
    dialogToOpen,
    closeDialog
  } = props;

  return (
    <>
      <ChangeEngagementDialog
        {...props}
        isOpen={dialogToOpen === 'change-engagement'}
        close={closeDialog}
      />

    </>
  );
};
