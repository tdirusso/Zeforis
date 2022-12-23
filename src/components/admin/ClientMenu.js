import { FormControl } from "@mui/material";
import { useState } from "react";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { Typography } from "@mui/material";

export default function ClientMenu({ client, clients, parentHandler }) {
  const [clientId, setClientId] = useState(client?.id || '');

  const label = clientId ? 'Current Client' : 'Client';

  const thisHandleChange = e => {
    setClientId(e.target.value);

    if (parentHandler) {
      const selectedClientObject = clients.find(client => client.id === e.target.value);
      parentHandler(selectedClientObject);
    }
  };

  return (
    <FormControl fullWidth>
      <InputLabel id="client-label">{label}</InputLabel>
      <Select
        labelId="client-label"
        value={clientId}
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
