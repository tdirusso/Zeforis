import { Grid, Paper, Tabs, Tab, Box } from "@mui/material";
import React, { useState } from "react";
import GeneralTab from "./GeneralTab";
import UsersTab from "./UsersTab";
import { useOutletContext } from "react-router-dom";

export default function OrgTab() {

  const {
    isOrgOwner
  } = useOutletContext();

  const showMembersTab = window.location.search.includes('members');

  const [tabVal, setTabVal] = useState(showMembersTab ? 1 : 0);

  const getTabContent = () => {
    switch (tabVal) {
      case 0:
        return <GeneralTab />;
      case 1:
        return <UsersTab />;
      default:
        break;
    }
  };

  return (
    <Grid item xs={12}>
      <Paper className="settings-container">
        <Tabs value={tabVal} onChange={(_, newVal) => setTabVal(newVal)} className="settings-tabs">
          <Tab label="General" />
          <Tab hidden={!isOrgOwner} label="Manage Members" />
        </Tabs>
        <Box p={2}>
          {
            getTabContent()
          }
        </Box>
      </Paper>
    </Grid>
  );
};
