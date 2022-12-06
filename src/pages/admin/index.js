/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { Outlet } from "react-router-dom";
import SideNav from "../../components/core/SideNav";
import './admin.css';
import Header from "../../components/core/Header";
import { Box, CircularProgress, createTheme, Paper } from "@mui/material";
import './styles/index.css';
import SelectClientModal from "../../components/admin/SelectClientModal";
import useSnackbar from "../../hooks/useSnackbar";
import Snackbar from "../../components/core/Snackbar";
import themeConfig from "../../theme";
import { getActiveClient, getAllClients } from "../../api/client";
import AddClientModal from "../../components/admin/AddClientModal";

export default function Admin({ theme, setTheme }) {
  const { user } = useAuth();
  const [client] = useState(getActiveClient());
  const [clients, setClients] = useState([]);
  const [isLoading, setLoading] = useState(true);

  const {
    isOpen,
    openSnackBar,
    type,
    message
  } = useSnackbar();

  useEffect(() => {
    async function getClients() {
      try {
        const { clients, message } = await getAllClients();

        if (clients) {
          setClients(clients);
          setLoading(false);
        } else {
          openSnackBar(message, 'error');
        }
      } catch (error) {
        openSnackBar(error.message, 'error');
      }
    }

    if (user) {
      getClients();
    }
  }, [user]);

  useEffect(() => {
    if (client) {
      themeConfig.palette.primary.main = client.brandColor;
      setTheme(createTheme(themeConfig));
      document.documentElement.style.setProperty('--colors-primary', client.brandColor);
    }
  }, []);

  if (isLoading) {
    return (
      <Box className="flex-centered" sx={{ height: '100%' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (clients.length === 0) {
    return (
      <Box className="flex-centered" sx={{ height: '100%' }}>
        <AddClientModal
          open={true}
          setOpen={() => { }}
          hideCancel={true}
        />
      </Box>
    )
  }

  if (client) {
    const clientExists = clients.some(({ _id }) => client._id === _id);

    if (!clientExists) {
      <Box className="flex-centered" sx={{ height: '100%' }}>
        <SelectClientModal />
      </Box>
    }
  }

  return (
    <div>
      <SideNav theme={theme} />
      <main>
        <Header />
        <Paper sx={{ width: '100%' }} elevation={1} className="main-content">
          {
            client ? <Outlet context={{ client }} /> : <SelectClientModal />
          }
        </Paper>
      </main>

      <Snackbar
        isOpen={isOpen}
        type={type}
        message={message}
      />
    </div>
  )
};
