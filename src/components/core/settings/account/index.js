import { Grid, Paper, Tabs, Tab, Box } from "@mui/material";
import React, { useState } from "react";
import GeneralTab from "./GeneralTab";
import BillingTab from "./BillingTab";
import '../../styles/settings.scss';

export default function AccountTab() {
  const isPaymentSuccess = window.location.search.includes('isPaymentSuccess');
  const isUpgrading = window.location.search.includes('upgrade');

  const [tabVal, setTabVal] = useState(isPaymentSuccess || isUpgrading ? 1 : 0);

  const getTabContent = () => {
    switch (tabVal) {
      case 0:
        return <GeneralTab />;
      case 1:
        return <BillingTab isPaymentSuccess={isPaymentSuccess} />;
      default:
        break;
    }
  };

  return (
    <Grid item xs={12}>
      <Paper className="settings-container">
        <Tabs value={tabVal} onChange={(_, newVal) => setTabVal(newVal)} className="settings-tabs">
          <Tab label="General" />
          <Tab label="Plan & Billing" />
        </Tabs>
        <Box p='2rem'>
          {
            getTabContent()
          }
        </Box>
      </Paper>
    </Grid>
  );
};
