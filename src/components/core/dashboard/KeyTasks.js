import { Box, LinearProgress, Paper, Typography, Button, Grid, Tooltip, IconButton } from "@mui/material";
import { useNavigate, useOutletContext } from "react-router-dom";
import StarIcon from '@mui/icons-material/Star';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

export default function KeyTasks({ tasks }) {
  const tasksLength = tasks.length;

  const navigate = useNavigate();

  return (
    <Grid item xs={12} md={7}>
      <Paper sx={{ height: '100%' }}>
        <Box
          display="flex"
          alignItems="center"
          mb={1}
          justifyContent="space-between">
          <Box
            component="h5"
            display="flex"
            alignItems="center">
            <StarIcon
              fontSize="small"
              htmlColor="gold"
              sx={{ mr: 0.3 }}
            />
            Key Tasks
          </Box>
          <Button
            onClick={() => navigate('/home/tasks?preFilterKeyTasks=true')}
            sx={{ display: tasksLength > 0 ? 'block' : 'none' }}>
            View All
          </Button>
        </Box>
        {
          tasksLength > 0 ?
            <KeyTasksList tasks={tasks} /> :
            <NoKeyTasksMessage />
        }
      </Paper>
    </Grid>
  );
};

function NoKeyTasksMessage() {
  return (
    <Box mt={2}>
      <Typography variant="body2">
        There are currently no key tasks.
      </Typography>
    </Box>
  );
}

const KeyTasksList = ({ tasks }) => tasks.map(task => <KeyTaskRow task={task} key={task.task_id} />);

function KeyTaskRow({ task }) {
  const {
    openDrawer
  } = useOutletContext();

  let taskName = task.task_name;

  if (taskName.length > 30) {
    taskName = taskName.substring(0, 30) + '...';
  }

  return (
    <Box
      display="flex"
      alignItems="center"
      gap={1.5}
      mb={0.25}
      px={1}
      py={1}
      minHeight={50}
      borderRadius='8px'
      key={task.task_id}
      className="task-row"
      onClick={() => openDrawer('task', { taskProp: task })}
      justifyContent="center">
      <Typography
        flexBasis='25%'
        variant="body2">
        {taskName}
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
          <Typography variant="body2">{task.progress}%</Typography>
        </Box>
      </Box>
      <Box flexBasis={'10%'} textAlign="right">
        {
          task.link_url ?
            <Tooltip title="Open Link">
              <IconButton
                disabled={!task.link_url}
                onClick={e => {
                  e.stopPropagation();
                  window.open(task.link_url, '_blank');
                }}>
                <OpenInNewIcon
                  fontSize="small"
                />
              </IconButton>
            </Tooltip> : null
        }
      </Box>
    </Box>
  );
}