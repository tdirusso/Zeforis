import { Box, Button, Grid, Paper } from "@mui/material";
import React from "react";
import ApartmentIcon from '@mui/icons-material/Apartment';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { Outlet, useNavigate, useOutletContext } from "react-router-dom";

export default function Settings() {
  const navigate = useNavigate();

  const path = window.location.pathname;

  return (
    <>
      <Grid item xs={12}>
        <Box display='flex' gap='1rem' flexWrap='wrap'>
          <Paper className={`custom-tab ${path.includes('/engagement') ? 'active' : ''}`}>
            <Button
              className="tab-btn"
              onClick={() => navigate('engagement')}
              startIcon={<AccountBoxIcon />}>
              Engagement
            </Button>
          </Paper>

          <Paper className={`custom-tab ${path.includes('/organization') ? 'active' : ''}`}>
            <Button
              onClick={() => navigate('organization')}
              className="tab-btn"
              startIcon={<ApartmentIcon />}>
              Organization
            </Button>
          </Paper>
          <Paper className={`custom-tab ${path.includes('/account') ? 'active' : ''}`}>
            <Button
              className="tab-btn"
              onClick={() => navigate('account')}
              startIcon={<ManageAccountsIcon />}>
              My Account
            </Button>
          </Paper>
        </Box>
      </Grid>
      <Outlet context={useOutletContext()} />
    </>
  );
};
