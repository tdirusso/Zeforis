import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useSnackbar from "../../hooks/useSnackbar";
import Snackbar from "./Snackbar";
import { setActiveOrgId } from '../../api/org';
import OrgMenu from './OrgMenu';

export default function SelectOrgModal({ orgs, user }) {
  const {
    isOpen,
    openSnackBar,
    type,
    message
  } = useSnackbar();

  const handleOrgSelection = ({ id }) => {
    const selectedOrgObject = orgs.find(org => org.id === id);
    setActiveOrgId(selectedOrgObject.id);
    openSnackBar(`Loading ${selectedOrgObject.name}...`, 'info');
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
          <OrgMenu
            changeHandler={handleOrgSelection}
            orgs={orgs}
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
