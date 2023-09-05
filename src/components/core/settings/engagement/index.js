import { Grid, Paper, Tabs, Tab, Box } from "@mui/material";
import React, { useState } from "react";
import GeneralTab from "./GeneralTab";
import MembersTab from "./MembersTab";
import TagsTab from "./TagsTab";

export default function EngagementTab() {

  const [tabVal, setTabVal] = useState(0);

  const getTabContent = () => {
    switch (tabVal) {
      case 0:
        return <GeneralTab />;
      case 1:
        return <MembersTab />;
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
          <Tab label="Tags" />
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
