import { FormControl } from "@mui/material";
import { useState } from "react";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { Typography } from "@mui/material";

export default function ClientMenu({ changeHandler, client, clients }) {
  const [clientId, setClientId] = useState(client?.id || '');

  const label = clientId ? 'Currently Viewing' : 'Select Client';

  const thisHandleChange = e => {
    setClientId(e.target.value);

    if (changeHandler) {
      const selectedClientObject = clients.find(client => client.id === e.target.value);
      changeHandler(selectedClientObject);
    }
  };

  return (
    <FormControl fullWidth>
      <InputLabel>{label}</InputLabel>
      <Select
        value={clientId}
        defaultOpen
        label={label}
        inputProps={{
          sx: {
            display: 'flex',
            alignItems: 'center'
          }
        }}
        onChange={thisHandleChange}>
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
                    client.access === 'admin' ? '(Admin)' : '(Member)'
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
