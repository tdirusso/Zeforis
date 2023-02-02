/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Button, Divider, Grid, Paper } from "@mui/material";
import './styles.css';
import React, { useState } from "react";
import { logout } from "../../../api/auth";
import Header from "../../../components/core/Header";
import PersonIcon from '@mui/icons-material/Person';
import SwitchAccountIcon from '@mui/icons-material/SwitchAccount';
import ApartmentIcon from '@mui/icons-material/Apartment';
//import PaidIcon from '@mui/icons-material/Paid';
import BasicInformation from "../../../components/core/settings/BasicInformation";
import Clients from "../../../components/core/settings/Clients";
import Organizations from "../../../components/core/settings/Organizations";
import LogoutIcon from '@mui/icons-material/Logout';

const settings = [
  { name: 'Clients', icon: <SwitchAccountIcon fontSize="small" /> },
  { name: 'Organizations', icon: <ApartmentIcon fontSize="small" /> },
  { name: 'Basic Information', icon: <PersonIcon fontSize="small" /> },
 // { name: 'Billing', icon: <PaidIcon fontSize="small" /> }
];

export default function Settings() {
  const [showSetting, setShowSetting] = useState('Clients');

  let componentToShow = <></>;

  switch (showSetting) {
    case 'Basic Information':
      componentToShow = <BasicInformation />;
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
      <Header />
      <Grid item xs={12} md={3}>
        <Paper sx={{ px: 0 }}>
          <Box className="settings-buttons">
            {
              settings.map(setting => {
                return (
                  <Button
                    fullWidth
                    size="small"
                    className={showSetting === setting.name ? 'active' : ''}
                    key={setting.name}
                    onClick={() => setShowSetting(setting.name)}
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
