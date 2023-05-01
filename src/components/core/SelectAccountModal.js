import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useSnackbar from "../../hooks/useSnackbar";
import Snackbar from "./Snackbar";
import { setActiveAccountId } from '../../api/account';
import AccountMenu from './AccountMenu';

export default function SelectAccountModal({ accounts, user }) {
  const {
    isOpen,
    openSnackBar,
    type,
    message
  } = useSnackbar();

  const handleOrgSelection = ({ id }) => {
    const selectedAccountObject = accounts.find(account => account.id === id);
    setActiveAccountId(selectedAccountObject.id);
    openSnackBar(`Loading ${selectedAccountObject.name}...`, 'info');
    setTimeout(() => {
      window.location.reload();
    }, 500);
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
            changeHandler={handleOrgSelection}
            accounts={accounts}
            user={user}
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
