import { useState } from "react";
import { addUser } from "../../api/user";
import LogoutButton from "../../components/core/LogoutButton";
import useAuth from "../../hooks/useAuth";
import { Outlet } from "react-router-dom";
import BackButton from "../../components/core/BackButton";
import SideNav from "../../components/core/SideNav";
import './admin.css';
import Header from "../../components/core/Header";
import { Paper } from "@mui/material";
import './styles/index.css';
import SelectClientModal from "../../components/admin/SelectClientModal";

export default function Admin() {
  const { user } = useAuth();

  const [client, setClient] = useState(JSON.parse(localStorage.getItem('client') || null));

  const changeClient = (clientObject) => {
    localStorage.setItem('client', JSON.stringify(clientObject));
    setClient(clientObject);
  };

  return (
    <div>
      <SideNav />
      <main>
        <Header />
        <Paper sx={{ width: '100%' }} elevation={1} className="main-content">
          {
            client ? <Outlet context={{ client }} /> : <SelectClientModal selectHandler={changeClient} />
          }
        </Paper>
      </main>
    </div>
  )
};
