import { Box, Paper, Typography, Button, Grid, Tooltip, IconButton, Chip, useMediaQuery, useTheme, Divider } from "@mui/material";
import { useNavigate, useOutletContext } from "react-router-dom";
import StarIcon from '@mui/icons-material/Star';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

export default function KeyTasks({ tasks }) {
  const tasksLength = tasks.length;

  const theme = useTheme();
  const taskButtonTextColor = theme.palette.text.primary;

  const navigate = useNavigate();

  return (
    <Grid item xs={12} md={6}>
      <Paper style={{ height: '100%' }}>
        <Box
          display="flex"
          alignItems="center"
          //  mb={0.5}
          justifyContent="space-between">
          <Box
            component="h5"
            display="flex"
            alignItems="center">
            <StarIcon
              htmlColor="gold"
              style={{ marginRight: '5px' }}
            />
            Key Tasks
          </Box>
          <Button
            onClick={() => navigate('/home/tasks?preFilterKeyTasks=true')}
            style={{ display: tasksLength > 0 ? 'block' : 'none' }}>
            View all
          </Button>
        </Box>
        <Divider style={{ margin: '3px 6px 8px 6px' }} />
        {
          tasksLength > 0 ?
            <KeyTasksList tasks={tasks} buttonColor={taskButtonTextColor} /> :
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
        There are no key tasks.
      </Typography>
    </Box>
  );
}

const KeyTasksList = ({ tasks, buttonColor }) => tasks.map(task =>
  <KeyTaskRow
    buttonColor={buttonColor}
    task={task}
    key={task.task_id} />
);

function KeyTaskRow({ task, buttonColor }) {
  const {
    openDrawer
  } = useOutletContext();

  const isSmallScreen = useMediaQuery('(max-width: 500px)');

  let taskName = task.task_name;

  if (taskName.length > 75) {
    taskName = taskName.substring(0, 75) + '...';
  }

  return (
    <Box
      style={{ color: buttonColor }}
      className="task-button"
      component={Button}
      display="flex"
      alignItems="center"
      gap={1}
      px={1}
      py={0.4}
      borderRadius='6px'
      key={task.task_id}
      onClick={() => openDrawer('task', { taskProp: task })}
      justifyContent="space-between">
      <Typography
        flexBasis={isSmallScreen ? 'unset' : '60%'}
        variant="body2">
        {taskName}
      </Typography>
      <Box display={isSmallScreen ? 'none' : 'block'}>
        <Chip
          size="small"
          label={task.status}
          className={task.status}
        />
      </Box>
      <Box flexBasis={'10%'} textAlign="right">
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