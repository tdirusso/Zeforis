import { Grid, Paper, Tabs, Tab } from "@mui/material";
import React, { useState } from "react";
import GeneralTab from "./GeneralTab";
import MembersTab from "./MembersTab";
import TagsTab from "./TagsTab";
import InfoIcon from '@mui/icons-material/Info';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

export default function ClientTab() {
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
        <Paper>
          <Tabs value={tabVal} onChange={(_, newVal) => setTabVal(newVal)}>
            <Tab label="General" icon={<InfoIcon fontSize="small" />} iconPosition="start" />
            <Tab label="Members" icon={<PeopleAltIcon fontSize="small" />} iconPosition="start" />
            <Tab label="Tags" icon={<LocalOfferIcon fontSize="small" />} iconPosition="start" />
          </Tabs>

          {
            getTabContent()
          }
        </Paper>
    </Grid>
  );
};
