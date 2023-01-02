import { Box, Paper, Typography, Button, Grid } from "@mui/material";
import FolderIcon from '@mui/icons-material/Folder';
import { useNavigate } from "react-router-dom";

export default function KeyFolders({ folders }) {

  return (
    <>
      {
        folders.map(folder => {
          const taskLength = folder.tasks.length;

          return (
            <Grid item xs={12} md={4} key={folder.id}>
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
                    <FolderIcon
                      htmlColor="#cbced4"
                      sx={{ mr: 0.75 }}
                    />
                    {folder.name}
                  </Box>
                  <Button>
                    View Folder
                  </Button>
                </Box>
                {
                  taskLength > 0 ?
                    <TaskList tasks={folder.tasks.slice(0, 5)} /> :
                    <NoTasksMessage />
                }
              </Paper>
            </Grid>
          );
        })
      }
    </>
  );
};

function NoTasksMessage() {
  return (
    <Box mt={2}>
      <Typography variant="body2">
        There no tasks in this folder.
      </Typography>
    </Box>
  );
}

function TaskList({ tasks }) {
  const navigate = useNavigate();

  return tasks.map(task => {
    let taskName = task.task_name;

    if (task.task_name.length > 30) {
      taskName = taskName.substring(0, 30) + ' ...';
    }

    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        className="task-row"
        mb={0.25}
        px={1}
        py={0.5}
        gap={0.5}
        borderRadius='8px'
        onClick={() => navigate(`/home/task/${task.task_id}?exitPath=/home/dashboard`)}
        key={task.task_id}>
        <Typography variant="body2">
          {taskName}
        </Typography>
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
  });
}