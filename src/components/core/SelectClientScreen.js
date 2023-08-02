import ClientMenu from '../core/ClientMenu';
import useSnackbar from "../../hooks/useSnackbar";
import Snackbar from "./Snackbar";
import { setActiveClientId } from '../../api/clients';
import { Box, Paper, Typography } from '@mui/material';

export default function SelectClientScreen({ client, clients }) {
  const {
    isOpen,
    openSnackBar,
    type,
    message
  } = useSnackbar();

  const handleSelection = (clientObject) => {
    setActiveClientId(clientObject.id);
    openSnackBar(`Loading ${clientObject.name}...`, 'info');
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  return (
    <>
      <Paper sx={{ p: 5, width: 600 }}>
        <Box component="h3" mb={1}>
          Select a Client
        </Box>
        <Typography>
          Please select which client you would like to work on from the menu below.
        </Typography>
        <br></br>
        <ClientMenu
          changeHandler={handleSelection}
          curClientId={client?.id}
          clients={clients}
        />
      </Paper>

      <Snackbar
        isOpen={isOpen}
        type={type}
        message={message}
      />
    </>
  );
};