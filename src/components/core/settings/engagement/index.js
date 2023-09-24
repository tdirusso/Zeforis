import { Grid, Paper, Tabs, Tab, Box } from "@mui/material";
import React, { useState } from "react";
import GeneralTab from "./GeneralTab";
import UsersTab from "./UsersTab";
import TagsTab from "./TagsTab";
import { useOutletContext } from "react-router-dom";

export default function EngagementTab() {

  const [tabVal, setTabVal] = useState(0);

  const {
    isAdmin
  } = useOutletContext();

  const getTabContent = () => {
    switch (tabVal) {
      case 0:
        return <GeneralTab />;
      case 1:
        return <UsersTab />;
      case 2:
        return <TagsTab />;
      default:
        break;
    }
  };

  return (
    <Grid item xs={12}>
      <Paper className="settings-container">
        <Tabs
          className="settings-tabs"
          value={tabVal}
          allowScrollButtonsMobile
          onChange={(_, newVal) => setTabVal(newVal)}
          variant="scrollable"
          scrollButtons="auto">
          <Tab label="General" />
          <Tab label="Collaborators" />
          <Tab label="Tags" hidden={!isAdmin} />
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
