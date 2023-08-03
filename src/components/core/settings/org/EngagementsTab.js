import { Box, Divider } from "@mui/material";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { useOutletContext } from "react-router-dom";

import React from "react";

export default function EngagementsTab() {

  const {
    org,
    engagements
  } = useOutletContext();


  return (
    <>
      <Box mt={4}>
        <Box component="h4" ml={1.75} mb={1}>
          {org.name} Engagements
        </Box>
        <List dense>
          {
            engagements.map((engagement, index) => {
              return (
                <React.Fragment key={engagement.id}>
                  <ListItem>
                    <ListItemText
                      primary={engagement.name}
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
