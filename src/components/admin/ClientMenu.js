import { FormControl } from "@mui/material";
import { useState } from "react";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { Typography } from "@mui/material";
import { useOutletContext } from "react-router-dom";

export default function ClientMenu({ changeHandler }) {
  const { clients, client } = useOutletContext();
  const [clientId, setClientId] = useState(client?.id || '');

  const label = clientId ? 'Current Client' : 'Client';

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
