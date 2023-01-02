import { Box, LinearProgress, Paper, Typography, Button, Grid } from "@mui/material";
import { Link } from "react-router-dom";

export default function UpcomingTasks({ tasks }) {

  const upcomingTasks = tasks;

  return (
    <Grid item xs={12} md={6}>
      <Paper sx={{height: '100%'}}>
        <Box
          component="h5"
          sx={{ mb: 3 }}>Upcoming Tasks</Box>
        {
          upcomingTasks.map(task => {
            return (
              <Box
                display="flex"
                alignItems="center"
                gap={3}
                mb={2}
                key={task.task_id}
                justifyContent="center">
                <Typography
                  flexBasis='25%'
                  component={Link}
                  variant="body2"
                  to={`/home/task/${task.task_id}?exitPath=/home/dashboard`}>
                  {task.task_name}
                </Typography>
                <Box flex={1}>
                  <Box display="flex" alignItems="center">
                    <LinearProgress
                      variant="determinate"
                      value={task.progress}
                      sx={{
                        height: 10,
                        width: '100%',
                        mr: 1.5,
                        borderRadius: 25
                      }}
                    />
                    <span>{task.progress}%</span>
                  </Box>
                </Box>
                <Button
                  variant="outlined"
                  component="a"
                  href={task.link_url}
                  target="_blank"
                  disabled={task.link_url === '' || task.link_url === null}
                  size="small">
                  Open Link
                </Button>
              </Box>
            );
          })
        }
      </Paper>
    </Grid>
  );
};
