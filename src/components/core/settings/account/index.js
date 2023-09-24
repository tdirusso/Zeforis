import { Grid, Paper, Tabs, Tab, Box } from "@mui/material";
import React, { useState } from "react";
import GeneralTab from "./GeneralTab";
import BillingTab from "./BillingTab";
import '../../styles/settings.scss';
import { useOutletContext } from "react-router-dom";

export default function AccountTab() {
  const isPaymentSuccess = window.location.search.includes('isPaymentSuccess');
  const goToPlan = window.location.search.includes('plan');

  const [tabVal, setTabVal] = useState(isPaymentSuccess || goToPlan ? 1 : 0);

  const {
    isOrgOwner
  } = useOutletContext();

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
          <Tab label="Plan & Billing" hidden={!isOrgOwner} />
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
