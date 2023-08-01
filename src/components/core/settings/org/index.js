import { Grid, Paper, Tabs, Tab } from "@mui/material";
import React, { useState } from "react";
import GeneralTab from "./GeneralTab";
import UsersTab from "./UsersTab";
import ClientsTab from "./ClientsTab";
import BrandingTab from "./BrandingTab";
import SwitchAccountIcon from '@mui/icons-material/SwitchAccount';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import BrushIcon from '@mui/icons-material/Brush';
import InfoIcon from '@mui/icons-material/Info';

export default function OrgTab() {
  const [tabVal, setTabVal] = useState(0);

  const getTabContent = () => {
    switch (tabVal) {
      case 0:
        return <GeneralTab />;
      case 1:
        return <UsersTab />;
      case 2:
        return <ClientsTab />;
      case 3:
        return <BrandingTab />;
      default:
        break;
    }
  };

  return (
    <Grid item xs={12}>
      <Paper>
        <Tabs value={tabVal} onChange={(_, newVal) => setTabVal(newVal)}>
          <Tab label="General" icon={<InfoIcon fontSize="small" />} iconPosition="start" />
          <Tab label="Users" icon={<PeopleAltIcon fontSize="small" />} iconPosition="start" />
          <Tab label="Clients" icon={<SwitchAccountIcon fontSize="small" />} iconPosition="start" />
          <Tab label="Branding" icon={<BrushIcon fontSize="small" />} iconPosition="start" />
        </Tabs>

        {
          getTabContent()
        }
      </Paper>
    </Grid>
  );
};
