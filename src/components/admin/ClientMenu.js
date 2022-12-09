import { CircularProgress, FormControl } from "@mui/material";
import { useEffect, useState } from "react";
import { getAllClients } from "../../api/client";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

export default function ClientMenu({ client, clients, parentHandler }) {
  const [clientId, setClientId] = useState(client?._id || '');

  const label = clientId ? 'Current Client' : 'Client';

  const thisHandleChange = e => {
    setClientId(e.target.value);

    if (parentHandler) {
      const selectedClientObject = clients.find(client => client._id === e.target.value);
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
        onChange={thisHandleChange}>
        {
          clients.map(client => {
            return (
              <MenuItem
                key={client._id}
                value={client._id}>
                {client.name}
              </MenuItem>
            );
          })
        }
      </Select>
    </FormControl>
  );
};
