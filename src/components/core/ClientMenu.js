import { FormControl } from "@mui/material";
import { useEffect, useState } from "react";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { Typography } from "@mui/material";

export default function ClientMenu(props) {

  const {
    changeHandler,
    curClientId,
    clients,
    shouldDisable = false
  } = props;

  const [clientId, setClientId] = useState(curClientId || '');

  const label = clientId ? 'Client' : 'Select Client';

  const handleSelection = e => {
    setClientId(e.target.value);

    if (changeHandler) {
      const selectedClientObject = clients.find(client => client.id === e.target.value);
      changeHandler(selectedClientObject);
    }
  };

  useEffect(() => {
    //need this check & update since the array of clients can be updated when user is changing orgs
    //note - the "clients" variable changes, followed by curClientId
    //curClientId is also updated back to its original value when the change drawer is closed
    if (curClientId) {
      setClientId(curClientId);
    } else {
      setClientId('');
    }
  }, [curClientId]);

  return (
    <FormControl fullWidth>
      <InputLabel>{label}</InputLabel>
      <Select
        value={clientId}
        label={label}
        disabled={shouldDisable}
        inputProps={{
          sx: {
            display: 'flex',
            alignItems: 'center'
          }
        }}
        onChange={handleSelection}>
        {
          clients.map(client => {
            return (
              <MenuItem sx={{
                display: 'flex',
                alignItems: 'center',
              }}
                key={client.id}
                value={client.id}>
                {client.name}
                <Typography variant="body2" color="#b9b9b9" sx={{ ml: 1.5 }}>
                  {
                    client.access === 'admin' ? 'Admin' : 'Member'
                  }
                </Typography>
              </MenuItem>
            );
          })
        }
      </Select>
    </FormControl>
  );
};
