import CreateEngagementDialog from "./CreateEngagementDialog";
import ChooseEngagementDialog from "./ChooseEngagementDialog";
import { AppContext } from "src/types/AppContext";
import { Engagement } from "@shared/types/Engagement";
import { Org } from "@shared/types/Org";
import { User } from "@shared/types/User";

export type DialogsProps = {
  dialogToOpen: string,
  closeDialog: () => void,
  openSnackBar: AppContext['openSnackBar'],
  engagements: Engagement[],
  org: Org,
  user: User,
  engagement: Engagement;
};


export default function Dialogs(props: DialogsProps) {
  const {
    dialogToOpen,
    closeDialog,
    openSnackBar,
    org,
    user,
    engagements,
    engagement
  } = props;

  return (
    <>
      <ChooseEngagementDialog
        isOpen={dialogToOpen === 'choose-engagement'}
        closeDialog={closeDialog}
        engagements={engagements}
        org={org}
        user={user}
        engagement={engagement}
      />

      <CreateEngagementDialog
        isOpen={dialogToOpen === 'create-engagement'}
        closeDialog={closeDialog}
        org={org}
        openSnackBar={openSnackBar}
        user={user}
      />
    </>
  );
};
