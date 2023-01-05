import { Box, Paper, Typography, Button, Grid, Chip } from "@mui/material";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

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
      onClick={() => navigate(`/home/task/${task.task_id}?exitPath=/home/dashboard`)}
      justifyContent="center">
      <Box flexBasis='45%' minWidth={75}>
        <Typography
          variant="body2">
          {taskName}
        </Typography>
        <Typography variant="caption" color="#adadad">
          Due: &nbsp;{`${dateDueDay}, ${dateDueMonth} ${dateDue.getDate()}, ${dateDue.getFullYear()}`}
        </Typography>
      </Box>
      <Box flex={1} textAlign="center">
        <Chip
          label={task.status}
          sx={{ cursor: 'pointer' }}
          className={task.status} />
      </Box>
      <Button
        variant="outlined"
        component="a"
        href={task.link_url}
        target="_blank"
        disabled={task.link_url === '' || task.link_url === null}
        onClick={e => e.stopPropagation()}
        size="small">
        {
          task.link_url ? 'Open Link' : 'No Link'
        }
      </Button>
    </Box>
  );
}