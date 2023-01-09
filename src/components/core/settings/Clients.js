import { Paper, Box, Divider } from "@mui/material";
import useSnackbar from "../../../hooks/useSnackbar";
import ClientMenu from "../../admin/ClientMenu";
import { setActiveClientId } from "../../../api/client";
import Snackbar from "../Snackbar";

export default function Clients() {


  const {
    isOpen,
    openSnackBar,
    type,
    message
  } = useSnackbar();

  const handleChangeClient = (clientObject) => {
    setActiveClientId(clientObject.id);
    openSnackBar(`Loading ${clientObject.name}...`, 'info');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <>
      <Paper>
        <Box component="h6">Clients</Box>
        <Divider sx={{ my: 4 }} />

        <Box>
          <ClientMenu
            changeHandler={handleChangeClient}
          />
        </Box>
      </Paper>

      <Snackbar
        isOpen={isOpen}
        type={type}
        message={message}
      />
    </>
  );
};
