import CreateEngagementDialog from "./CreateEngagementDialog";
import ChooseEngagementDialog from "./ChooseEngagementDialog";
import { AppContext } from "src/types/AppContext";
import { Engagement } from "@shared/types/Engagement";
import { Org } from "@shared/types/Org";
import { User } from "@shared/types/User";

export type DialogProps = {
  dialogToOpen?: string,
  dialogProps?: any,
  closeDialog: () => void,
  isOpen?: boolean;
  openDialog?: AppContext['openDialog'],
  openModal?: AppContext['openModal'],
  openSnackBar: AppContext['openSnackBar'],
  engagements: Engagement[],
  org: Org,
  user: User,
  engagement?: Engagement;
};


export default function Dialogs(props: DialogProps) {
  const {
    dialogToOpen,
    closeDialog
  } = props;

  return (
    <>
      <ChooseEngagementDialog
        {...props}
        isOpen={dialogToOpen === 'choose-engagement'}
        closeDialog={closeDialog}
      />

      <CreateEngagementDialog
        {...props}
        isOpen={dialogToOpen === 'create-engagement'}
        closeDialog={closeDialog}
      />
    </>
  );
};
