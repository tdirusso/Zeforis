import { Box, Paper, Typography, Button, Grid, Chip, Tooltip, IconButton } from "@mui/material";
import { useNavigate, useOutletContext } from "react-router-dom";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function UpcomingTasks({ tasks }) {
  const tasksLength = tasks.length;

  const navigate = useNavigate();

  return (
    <Grid item xs={12} md={5}>
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
            <AccessAlarmIcon
              fontSize="small"
              color="primary"
              sx={{ mr: 0.6 }}
            />
            Upcoming Tasks
          </Box>
          <Button
            onClick={() => navigate('/home/tasks?preSort=dateDue')}
            sx={{ display: tasksLength > 0 ? 'block' : 'none' }}>
            View All
          </Button>
        </Box>
        {
          tasksLength > 0 ?
            <UpcomingTasksList tasks={tasks} /> :
            <NoUpcomingTasksMessage />
        }
      </Paper>
    </Grid>
  );
};

function NoUpcomingTasksMessage() {
  return (
    <Box mt={2}>
      <Typography variant="body2">
        There are currently no upcoming tasks.
      </Typography>
    </Box>
  );
}

const UpcomingTasksList = ({ tasks }) => tasks.map(task => <UpcomingTaskRow task={task} key={task.task_id} />);

function UpcomingTaskRow({ task }) {
  const {
    openDrawer
  } = useOutletContext();

  let taskName = task.task_name;

  if (taskName.length > 40) {
    taskName = taskName.substring(0, 40) + '...';
  }

  const dateDue = new Date(task.date_due);
  const dateDueDay = days[dateDue.getDay()];
  const dateDueMonth = months[dateDue.getMonth()];

  return (
    <Box
      display="flex"
      alignItems="center"
      gap={1.5}
      mb={0.25}
      px={1}
      py={1}
      borderRadius='8px'
      key={task.task_id}
      className="task-row"
      onClick={() => openDrawer('task', { taskProp: task })}
      justifyContent="center">
      <Box flexBasis='40%' minWidth={75}>
        <Typography
          variant="body2">
          {taskName}
        </Typography>
        <Typography variant="caption" color="#adadad">
          {`${dateDueDay}, ${dateDueMonth} ${dateDue.getDate()}, ${dateDue.getFullYear()}`}
        </Typography>
      </Box>
      <Box flex={1} textAlign="center">
        <Chip
          label={task.status}
          sx={{ cursor: 'pointer' }}
          className={task.status} />
      </Box>
      <Box flexBasis={'10%'}>
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