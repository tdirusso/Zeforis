import { Box, Paper, Typography, Button, Grid, Chip, Tooltip, IconButton, useMediaQuery, useTheme, Divider } from "@mui/material";
import { useNavigate, useOutletContext } from "react-router-dom";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import { Task } from "@shared/types/Task";
import { AppContext } from "src/types/AppContext";

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

type UpcomingTasksProps = {
  tasks: Task[];
};

export default function UpcomingTasks({ tasks }: UpcomingTasksProps) {
  const tasksLength = tasks.length;

  const navigate = useNavigate();

  const theme = useTheme();
  const taskButtonTextColor = theme.palette.text.primary;

  return (
    <Grid item xs={12} md={6}>
      <Paper style={{ height: '100%' }}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between">
          <Box
            component="h5"
            display="flex"
            alignItems="center">
            <AccessAlarmIcon
              color="primary"
              style={{ marginRight: '7px' }}
            />
            Upcoming Tasks
          </Box>
          <Button
            size="small"
            onClick={() => navigate('/home/tasks?preSort=dateDue')}
            style={{ display: tasksLength > 0 ? 'block' : 'none' }}>
            View all
          </Button>
        </Box>
        <Divider style={{ margin: '3px 6px 8px 6px' }} />
        <Box className={`upcoming-tasks-wrapper ${tasks.length > 9 ? 'app-scrollable' : ''}`}>
          {
            tasksLength > 0 ?
              <UpcomingTasksList tasks={tasks} buttonColor={taskButtonTextColor} /> :
              <NoUpcomingTasksMessage />
          }
        </Box>
      </Paper>
    </Grid>
  );
};

function NoUpcomingTasksMessage() {
  return (
    <Box mt={2}>
      <Typography variant="body2">
        There are no upcoming tasks.
      </Typography>
    </Box>
  );
}

type UpcomingTasksListProps = {
  tasks: Task[],
  buttonColor: string;
};

const UpcomingTasksList = ({ tasks, buttonColor }: UpcomingTasksListProps) =>
  <>
    {
      tasks.map(task =>
        <UpcomingTaskRow task={task} key={task.task_id} buttonColor={buttonColor}
        />
      )
    }
  </>;



function UpcomingTaskRow({ task, buttonColor }: { task: Task, buttonColor: string; }) {
  const {
    openDrawer
  } = useOutletContext<AppContext>();

  const isSmallScreen = useMediaQuery('(max-width: 500px)');

  let taskName = task.task_name;

  if (taskName.length > 40) {
    taskName = taskName.substring(0, 40) + '...';
  }

  const dateDue = new Date(task.date_due || '');
  const dateDueDay = days[dateDue.getDay()];
  const dateDueMonth = months[dateDue.getMonth()];

  return (
    <Box
      style={{ color: buttonColor }}
      color={buttonColor}
      className="task-button"
      display="flex"
      alignItems="center"
      gap={1.5}
      px={1}
      py={0.5}
      borderRadius='8px'
      key={task.task_id}
      component={Button}
      onClick={() => openDrawer('task', { taskProp: task })}
      justifyContent="center">
      <Box flexBasis={isSmallScreen ? 'unset' : '60%'} minWidth={75} mr='auto'>
        <Typography
          lineHeight='14px'
          variant="body2">
          {taskName}
        </Typography>
        <Typography variant="caption" color="#adadad">
          {`${dateDueDay}, ${dateDueMonth} ${dateDue.getDate()}, ${dateDue.getFullYear()}`}
        </Typography>
      </Box>
      <Box flex={1} textAlign="center" display={isSmallScreen ? 'none' : 'block'}>
        <Chip
          size="small"
          label={task.status}
          style={{ cursor: 'pointer' }}
          className={task.status} />
      </Box>
      <Box flexBasis={'10%'}>
        {
          task.link_url ?
            <Tooltip title="Open Link">
              <IconButton
                component="div"
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