import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useSnackbar from "../../hooks/useSnackbar";
import Snackbar from "./Snackbar";
import { setActiveAccountId } from '../../api/account';
import AccountMenu from './AccountMenu';

export default function SelectAccountModal({ accounts }) {
  const {
    isOpen,
    openSnackBar,
    type,
    message
  } = useSnackbar();

  const handleSelection = accountId => {
    const selectedAccountObject = accounts.find(account => account.id === accountId);
    setActiveAccountId(selectedAccountObject.id);
    openSnackBar(`Loading ${selectedAccountObject.name}...`, 'info');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <div>
      <Dialog open={true}>
        <DialogTitle>Select an Organization</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please select an organization from the drop-down list below.
          </DialogContentText>
          <br></br>
          <AccountMenu
            parentHandler={handleSelection}
            accounts={accounts}
          />
        </DialogContent>
      </Dialog>

      <Snackbar
        isOpen={isOpen}
        type={type}
        message={message}
      />
    </div>
  );
};
