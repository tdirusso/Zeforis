import CreateEngagementDialog from "./CreateEngagementDialog";
import ChooseEngagementDialog from "./ChooseEngagementDialog";

export default function Dialogs(props) {
  const {
    dialogToOpen,
    closeDialog
  } = props;

  return (
    <>
      <ChooseEngagementDialog
        {...props}
        isOpen={dialogToOpen === 'choose-engagement'}
        close={closeDialog}
      />

      <CreateEngagementDialog
        {...props}
        isOpen={dialogToOpen === 'create-engagement'}
        close={closeDialog}
      />
    </>
  );
};
