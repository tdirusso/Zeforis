import { Box, Paper, Grid } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import EventBusyIcon from '@mui/icons-material/EventBusy';

export default function TaskStats({ numComplete, numInProgress, numPastDue }) {
  return (
    <>
      <Grid item xs={12} md={4}>
        <Paper style={{ height: '100%' }}>
          <Box display="flex" alignItems="center">
            <Box className="in-progress-icon" mr={3}>
              <EditIcon />
            </Box>
            <Box>
              <Box component="h4" mb={0.5}>Tasks in Progress</Box>
              <Box component="h2" color="orange">{numInProgress}</Box>
            </Box>
          </Box>
        </Paper>
      </Grid>

      <Grid item xs={12} md={4}>
        <Paper style={{ height: '100%' }}>
          <Box display="flex" alignItems="center">
            <Box className="completed-icon" mr={3}>
              <CheckIcon />
            </Box>
            <Box>
              <Box component="h4" mb={0.5}>Tasks Completed</Box>
              <Box component="h2" color="#27ce88">{numComplete}</Box>
            </Box>
          </Box>
        </Paper>
      </Grid>

      <Grid item xs={12} md={4}>
        <Paper style={{ height: '100%' }}>
          <Box display="flex" alignItems="center">
            <Box className="past-due-icon" mr={3}>
              <EventBusyIcon />
            </Box>
            <Box>
              <Box component="h4" mb={0.5}>Tasks Past Due</Box>
              <Box component="h2" color="red">{numPastDue}</Box>
            </Box>
          </Box>
        </Paper>
      </Grid>
    </>
  );
};
