/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { Outlet } from "react-router-dom";
import SideNav from "../../components/core/SideNav";
import './admin.css';
import Header from "../../components/core/Header";
import { createTheme, Paper } from "@mui/material";
import './styles/index.css';
import SelectClientModal from "../../components/admin/SelectClientModal";
import useSnackbar from "../../hooks/useSnackbar";
import Snackbar from "../../components/core/Snackbar";
import themeConfig from "../../theme";

export default function Admin({ theme, setTheme }) {
  const { user } = useAuth();
  const [client] = useState(JSON.parse(localStorage.getItem('client') || null));

  const {
    isOpen,
    openSnackBar,
    type,
    message
  } = useSnackbar();

  useEffect(() => {
    if (client) {
      themeConfig.palette.primary.main = client.brandColor;
      setTheme(createTheme(themeConfig));
      document.documentElement.style.setProperty('--colors-primary', client.brandColor);
    }
  }, []);

  const changeClient = (clientObject) => {
    localStorage.setItem('client', JSON.stringify(clientObject));
    openSnackBar('Loading client...', 'info');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <div>
      <SideNav theme={theme} />
      <main>
        <Header />
        <Paper sx={{ width: '100%' }} elevation={1} className="main-content">
          {
            client ? <Outlet context={{ client, changeClient }} /> : <SelectClientModal selectHandler={changeClient} />
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
