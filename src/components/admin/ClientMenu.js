import { CircularProgress, FormControl } from "@mui/material";
import { useEffect, useState } from "react"
import { getAllClients } from "../../api/client";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

export default function ClientMenu({client}) {
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState(null);
  const [error, setError] = useState('');
  const [clientId, setClientId] = useState(client?._id || '');

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
  }, [])

  return (
    <div style={{width: '30%'}}>
      {
        loading ? <div><CircularProgress /></div> :
          (<FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Client</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={clientId}
              label="Client"
              onChange={() => { }}>
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
    </div >
  )
};
