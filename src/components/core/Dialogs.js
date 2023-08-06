import CreateEngagementDialog from "../admin/CreateEngagementDialog";
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

      <CreateEngagementDialog
        {...props}
        isOpen={dialogToOpen === 'create-engagement'}
        close={closeDialog}
      />
    </>
  );
};
