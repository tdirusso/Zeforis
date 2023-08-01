import { Grid, Paper,  Tabs, Tab } from "@mui/material";
import { useOutletContext } from "react-router-dom";
import CreateClientModal from "../../../admin/CreateClientModal";
import EditClientModal from "../../../admin/EditClientModal";
import React, { useState } from "react";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import PeopleOutlineOutlinedIcon from '@mui/icons-material/PeopleOutlineOutlined';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import GeneralTab from "./GeneralTab";
import MembersTab from "./MembersTab";
import TagsTab from "./TagsTab";

export default function ClientsTab() {
  const {
    client,
    org,
  } = useOutletContext();

  const [createClientModalOpen, setCreateClientModalOpen] = useState(false);
  const [editClientModalOpen, setEditClientModalOpen] = useState(false);
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
          <Tab label="General" icon={<InfoOutlinedIcon />} iconPosition="start" />
          <Tab label="Members" icon={<PeopleOutlineOutlinedIcon />} iconPosition="start" />
          <Tab label="Tags" icon={<LocalOfferOutlinedIcon />} iconPosition="start" />
        </Tabs>

        {
          getTabContent()
        }
      </Paper>

      <CreateClientModal
        open={createClientModalOpen}
        setOpen={setCreateClientModalOpen}
        org={org}
      />

      <EditClientModal
        open={editClientModalOpen}
        setOpen={setEditClientModalOpen}
        clientToUpdate={client}
      />

    </Grid>
  );
};
