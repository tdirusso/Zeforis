import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import ClientMenu from '../admin/ClientMenu';
import useSnackbar from "../../hooks/useSnackbar";
import Snackbar from "./Snackbar";
import { setActiveClientId } from '../../api/client';

export default function SelectClientModal() {
  const {
    isOpen,
    openSnackBar,
    type,
    message
  } = useSnackbar();

  const handleSelection = (clientObject) => {
    setActiveClientId(clientObject.id);
    openSnackBar(`Loading ${clientObject.name}...`, 'info');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <div>
      <Dialog open={true}>
        <DialogTitle>Select a Client</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please select the client you want to work on from the drop-down list below.
          </DialogContentText>
          <br></br>
          <ClientMenu
            changeHandler={handleSelection}
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