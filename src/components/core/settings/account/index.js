import { Grid, Paper, Tabs, Tab, Box } from "@mui/material";
import React, { useState } from "react";
import GeneralTab from "./GeneralTab";
import BillingTab from "./BillingTab";
import '../../styles/settings.scss';

export default function AccountTab({ isPostPaymentSuccess }) {
  const [tabVal, setTabVal] = useState(isPostPaymentSuccess ? 1 : 0);

  const getTabContent = () => {
    switch (tabVal) {
      case 0:
        return <GeneralTab />;
      case 1:
        return <BillingTab isPostPaymentSuccess={isPostPaymentSuccess} />;
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
