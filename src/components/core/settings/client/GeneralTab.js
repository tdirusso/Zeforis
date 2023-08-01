import { Box, Button, TextField, InputAdornment, Divider } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import React, { useState } from "react";
import { LoadingButton } from "@mui/lab";
import SwapHorizOutlinedIcon from '@mui/icons-material/SwapHorizOutlined';
import { useOutletContext } from "react-router";
import { updateClient } from "../../../../api/clients";

export default function GeneralTab() {
  const {
    client,
    openDrawer,
    openModal,
    openSnackBar,
    setClient
  } = useOutletContext();

  const [clientName, setClientName] = useState(client.name);
  const [loading, setLoading] = useState(false);

  const handleUpdateClient = async () => {
    if (!clientName) {
      openSnackBar('Please enter a name for the client.');
      return;
    }

    setLoading(true);

    try {
      const { success, message } = await updateClient({
        name: clientName,
        clientId: client.id
      });

      if (success) {
        openSnackBar('Client updated.', 'success');
        console.log({ ...client, name: clientName, });
        setClient({ ...client, name: clientName });
        setLoading(false);
      } else {
        openSnackBar(message, 'error');
        setLoading(false);
      }
    } catch (error) {
      openSnackBar(error.message, 'error');
      setLoading(false);
    }
  };

  return (
    <>
      <Box mt={4}>
        <TextField
          sx={{ minWidth: '400px' }}
          value={clientName}
          disabled={loading}
          onChange={e => setClientName(e.target.value)}
          variant="standard"
          helperText={`Current client name`}
          InputProps={{
            endAdornment: <InputAdornment position="end">
              <LoadingButton
                loading={loading}
                onClick={handleUpdateClient}>
                Save
              </LoadingButton>
            </InputAdornment>
          }}>
        </TextField>
      </Box>

      <Box mt={3.5}>
        <Button
          sx={{ mr: 2 }}
          variant="outlined"
          onClick={() => openDrawer('change-org-or-client')}
          startIcon={<SwapHorizOutlinedIcon />}>
          Change client
        </Button>
      </Box>
      <Divider sx={{ my: 4 }} />
      <Box>
        <Button
          startIcon={<DeleteIcon />}
          color="error"
          onClick={() => openModal('delete-client')}
          variant="outlined">
          Delete client
        </Button>
      </Box>
    </>
  );
};
