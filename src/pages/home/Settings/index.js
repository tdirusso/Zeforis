/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Button, Grid, Paper } from "@mui/material";
import React, { useState } from "react";
import SwitchAccountIcon from '@mui/icons-material/SwitchAccount';
import ApartmentIcon from '@mui/icons-material/Apartment';
import Account from "../../../components/core/settings/Account";
import Organizations from "../../../components/core/settings/Organizations";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ClientTab from "../../../components/core/settings/client";

const buttonStyles = {
  p: '10px 15px',
  borderRadius: '24px',
  transition: 'color 200ms linear'
};

const paperStyles = {
  p: 0,
  borderRadius: '24px',
  transition: 'background 200ms linear'
};

export default function Settings() {
  const [tabVal, setTabVal] = useState(0);

  const getTabContent = () => {
    switch (tabVal) {
      case 0:
        return <ClientTab />;
      case 1:
        return <Organizations />;
      case 2:
        return <Account />;
      default:
        break;
    }
  };

  return (
    <>
      <Grid item xs={12}>
        <Box display='flex' gap={1.5}>
          <Paper sx={{
            ...paperStyles,
            background:
              tabVal === 0 ? 'var(--colors-primary)' : 'white'
          }}>
            <Button
              onClick={() => setTabVal(0)}
              sx={{
                ...buttonStyles,
                color: tabVal === 0 ? 'white' : 'var(--colors-primary)'
              }}
              startIcon={<SwitchAccountIcon />}>
              Client
            </Button>
          </Paper>
          <Paper sx={{
            ...paperStyles,
            background:
              tabVal === 1 ? 'var(--colors-primary)' : 'white'
          }}>
            <Button
              onClick={() => setTabVal(1)}
              sx={{
                ...buttonStyles,
                color: tabVal === 1 ? 'white' : 'var(--colors-primary)'
              }}
              startIcon={<ApartmentIcon />}>
              Organization
            </Button>
          </Paper>
          <Paper sx={{
            ...paperStyles,
            background:
              tabVal === 2 ? 'var(--colors-primary)' : 'white'
          }}>
            <Button
              onClick={() => setTabVal(2)}
              sx={{
                ...buttonStyles,
                color: tabVal === 2 ? 'white' : 'var(--colors-primary)'
              }}
              startIcon={<AccountCircleIcon />}>
              Account
            </Button>
          </Paper>
        </Box>
      </Grid>
      {
        getTabContent()
      }
    </>
  );
};
