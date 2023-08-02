import { Grid, Paper, Tabs, Tab } from "@mui/material";
import React, { useState } from "react";
import GeneralTab from "./GeneralTab";
import InfoIcon from '@mui/icons-material/Info';
import PaidIcon from '@mui/icons-material/Paid';
import BillingTab from "./BillingTab";

export default function AccountTab() {
  const [tabVal, setTabVal] = useState(0);

  const getTabContent = () => {
    switch (tabVal) {
      case 0:
        return <GeneralTab />;
      case 1:
        return <BillingTab />;
      default:
        break;
    }
  };

  return (
    <Grid item xs={12}>
      <Paper>
        <Tabs value={tabVal} onChange={(_, newVal) => setTabVal(newVal)}>
          <Tab label="General" icon={<InfoIcon fontSize="small" />} iconPosition="start" />
          <Tab label="Plan & Billing" icon={<PaidIcon fontSize="small" />} iconPosition="start" />
        </Tabs>
        {
          getTabContent()
        }
      </Paper>
    </Grid>
  );
};
