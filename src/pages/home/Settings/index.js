/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Button, Grid, Paper } from "@mui/material";
import React, { useState } from "react";
import ApartmentIcon from '@mui/icons-material/Apartment';
import EngagementTab from "../../../components/core/settings/engagement";
import OrgTab from "../../../components/core/settings/org";
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import AccountTab from "../../../components/core/settings/account/";

const buttonStyles = {
  padding: '10px 15px',
  borderRadius: '24px',
  transition: 'color 200ms linear'
};

const paperStyles = {
  padding: 0,
  borderRadius: '24px',
  transition: 'background 200ms linear'
};

export default function Settings() {
  const [tabVal, setTabVal] = useState(0);

  const getTabContent = () => {
    switch (tabVal) {
      case 0:
        return <EngagementTab />;
      case 1:
        return <OrgTab />;
      case 2:
        return <AccountTab />;
      default:
        break;
    }
  };

  return (
    <>
      <Grid item xs={12}>
        <Box display='flex' gap={1.5}>
          <Paper style={{
            ...paperStyles,
            background:
              tabVal === 0 ? 'var(--colors-primary)' : 'white'
          }}>
            <Button
              onClick={() => setTabVal(0)}
              style={{
                ...buttonStyles,
                color: tabVal === 0 ? 'white' : 'var(--colors-primary)'
              }}
              startIcon={<AccountBoxIcon />}>
              Engagement
            </Button>
          </Paper>
          <Box style={{
            width: '1px',
            margin: '0 0.5rem',
            background: 'var(--colors-primary)'
          }}></Box>

          <Paper style={{
            ...paperStyles,
            background:
              tabVal === 1 ? 'var(--colors-primary)' : 'white'
          }}>
            <Button
              onClick={() => setTabVal(1)}
              style={{
                ...buttonStyles,
                color: tabVal === 1 ? 'white' : 'var(--colors-primary)'
              }}
              startIcon={<ApartmentIcon />}>
              Organization
            </Button>
          </Paper>
          <Paper style={{
            ...paperStyles,
            background:
              tabVal === 2 ? 'var(--colors-primary)' : 'white'
          }}>
            <Button
              onClick={() => setTabVal(2)}
              style={{
                ...buttonStyles,
                color: tabVal === 2 ? 'white' : 'var(--colors-primary)'
              }}
              startIcon={<ManageAccountsIcon />}>
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
