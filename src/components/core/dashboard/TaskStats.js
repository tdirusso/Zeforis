import { Box, Paper, Grid } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import CountUp from 'react-countup';

export default function TaskStats({ analyticsData }) {

  const {
    numTasksInProgress = 0,
    numTasksCompleted = 0,
    numTasksPastDue = 0
  } = analyticsData;

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
              <Box component="h2" color="orange">
                <CountUp end={numTasksInProgress} />
              </Box>
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
              <Box component="h2" color="#27ce88">
                <CountUp end={numTasksCompleted} />
              </Box>
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
              <Box component="h2" color="red">
                <CountUp end={numTasksPastDue} />
              </Box>
            </Box>
          </Box>
        </Paper>
      </Grid>
    </>
  );
};
