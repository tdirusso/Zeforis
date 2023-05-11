/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Button, Divider, Grid, Paper } from "@mui/material";
import './styles.css';
import React, { useState } from "react";
import { logout } from "../../../api/auth";
import PersonIcon from '@mui/icons-material/Person';
import SwitchAccountIcon from '@mui/icons-material/SwitchAccount';
import ApartmentIcon from '@mui/icons-material/Apartment';
//import PaidIcon from '@mui/icons-material/Paid';
import Account from "../../../components/core/settings/Account";
import Clients from "../../../components/core/settings/Clients";
import Organizations from "../../../components/core/settings/Organizations";
import LogoutIcon from '@mui/icons-material/Logout';
import { useLocation } from "react-router-dom";

const settings = [
  { name: 'Clients', icon: <SwitchAccountIcon fontSize="small" /> },
  { name: 'Organizations', icon: <ApartmentIcon fontSize="small" /> },
  { name: 'Account', icon: <PersonIcon fontSize="small" /> },
  // { name: 'Billing', icon: <PaidIcon fontSize="small" /> }
];

export default function Settings() {
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);

  const defaultTab = queryParams.get('tab');

  const [tab, setTab] = useState(defaultTab || 'Clients');

  let componentToShow = <></>;

  switch (tab) {
    case 'Account':
      componentToShow = <Account />;
      break;
    case 'Clients':
      componentToShow = <Clients />;
      break;
    case 'Organizations':
      componentToShow = <Organizations />;
      break;
    default:
      break;
  }

  return (
    <>
      <Grid item xs={12} md={3}>
        <Paper sx={{ px: 0 }}>
          <Box className="settings-buttons">
            {
              settings.map(setting => {
                return (
                  <Button
                    fullWidth
                    size="small"
                    className={tab === setting.name ? 'active' : ''}
                    key={setting.name}
                    onClick={() => setTab(setting.name)}
                    sx={{
                      px: 3,
                      py: 1.5
                    }}
                    startIcon={setting.icon} >
                    {setting.name}
                  </Button>
                );
              })
            }
            <Divider />
            <Button
              size="small"
              fullWidth
              onClick={logout}
              startIcon={<LogoutIcon fontSize="small" />}
              sx={{ px: 3, py: 1.5 }}>Log Out</Button>
          </Box>
        </Paper>
      </Grid>

      <Grid item xs={12} md={9}>
        {componentToShow}
      </Grid>
    </>
  );
};
