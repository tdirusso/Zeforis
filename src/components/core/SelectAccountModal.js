import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useSnackbar from "../../hooks/useSnackbar";
import Snackbar from "./Snackbar";
import { setActiveAccountId } from '../../api/account';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { FormControl } from '@mui/material';
import { useState } from 'react';

export default function SelectAccountModal({ accounts }) {

  const [accountId, setAccountId] = useState('');

  const {
    isOpen,
    openSnackBar,
    type,
    message
  } = useSnackbar();

  const handleSelection = (e) => {
    setAccountId(e.target.value);

    const selectedAccountObject = accounts.find(account => account._id === e.target.value);
    setActiveAccountId(selectedAccountObject._id);
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
            Please select an organization you would like to view the drop-down list below.
          </DialogContentText>
          <br></br>
          <FormControl fullWidth>
            <InputLabel id="org-label">Organization</InputLabel>
            <Select
              labelId="org-label"
              label="Organization"
              value={accountId}
              onChange={handleSelection}>
              {
                accounts.map(account => {
                  return (
                    <MenuItem
                      key={account._id}
                      value={account._id}>
                      {account.name}
                    </MenuItem>
                  );
                })
              }
            </Select>
          </FormControl>
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
