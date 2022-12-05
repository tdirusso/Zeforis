import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import ClientMenu from './ClientMenu';
import { useState } from 'react';

export default function SelectClientModal({ selectHandler }) {

  const [open, setOpen] = useState(true);

  const handleChange = (clientObject) => {
    selectHandler(clientObject);
    setOpen(false);
  };

  return (
    <div>
      <Dialog open={open}>
        <DialogTitle>Select a Client</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please select the client you want to work on from the drop-down list below.
          </DialogContentText>
          <br></br>
          <ClientMenu parentHandler={handleChange} />
        </DialogContent>
      </Dialog>
    </div>
  );
};