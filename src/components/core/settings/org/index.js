import { Grid, Paper, Tabs, Tab } from "@mui/material";
import React, { useState } from "react";
import GeneralTab from "./GeneralTab";
import UsersTab from "./UsersTab";
import EngagementsTab from "./EngagementsTab";
import SwitchAccountIcon from '@mui/icons-material/SwitchAccount';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import InfoIcon from '@mui/icons-material/Info';
import { useOutletContext } from "react-router-dom";

export default function OrgTab() {

  const {
    isOrgOwner
  } = useOutletContext();

  const [tabVal, setTabVal] = useState(0);

  const getTabContent = () => {
    switch (tabVal) {
      case 0:
        return <GeneralTab />;
      case 1:
        return <UsersTab />;
      case 2:
        return <EngagementsTab />;
      default:
        break;
    }
  };

  return (
    <Grid item xs={12}>
      <Paper>
        <Tabs value={tabVal} onChange={(_, newVal) => setTabVal(newVal)}>
          <Tab label="General" icon={<InfoIcon fontSize="small" />} iconPosition="start" />
          <Tab hidden={!isOrgOwner} label="Users" icon={<PeopleAltIcon fontSize="small" />} iconPosition="start" />
          <Tab hidden={!isOrgOwner} label="Engagements" icon={<SwitchAccountIcon fontSize="small" />} iconPosition="start" />
        </Tabs>

        {
          getTabContent()
        }
      </Paper>
    </Grid>
  );
};
