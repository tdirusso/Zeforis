import { Box, Divider } from "@mui/material";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { useOutletContext } from "react-router-dom";

import React from "react";

export default function ClientsTab() {

  const {
    org,
    clients
  } = useOutletContext();


  return (
    <>
      <Box mt={4}>
        <Box component="h4" ml={1.75} mb={1}>
          {org.name} Clients
        </Box>
        <List dense>
          {
            clients.map((client, index) => {
              return (
                <React.Fragment key={client.id}>
                  <ListItem>
                    <ListItemText
                      primary={client.name}
                    />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              );
            })
          }
        </List>
      </Box>
    </>
  );
};
