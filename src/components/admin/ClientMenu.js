import { CircularProgress, FormControl } from "@mui/material";
import { useEffect, useState } from "react"
import { getAllClients } from "../../api/client";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

export default function ClientMenu({ client, parentHandler }) {
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState(null);
  const [error, setError] = useState('');
  const [clientId, setClientId] = useState(client?._id || '');

  const label = clientId ? 'Current Client' : 'Client';

  useEffect(() => {
    async function getClients() {
      try {
        const { clients, message } = await getAllClients();

        if (clients) {
          setClients(clients);
        } else {
          setError(message);
        }
        setLoading(false);
      } catch (er) {
        console.log(er)
      }
    }

    getClients();
  }, []);

  const thisHandleChange = e => {
    setClientId(e.target.value);

    if (parentHandler) {
      const selectedClientObject = clients.find(client => client._id === e.target.value);
      parentHandler(selectedClientObject);
    }
  };

  return (
    <>
      {
        loading ? <div><CircularProgress /></div> :
          (<FormControl fullWidth>
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
          </FormControl>)
      }
    </>
  )
};
