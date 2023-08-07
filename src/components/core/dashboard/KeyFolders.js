import { Box, Paper, Typography, Button, Grid, Tooltip, IconButton } from "@mui/material";
import FolderIcon from '@mui/icons-material/Folder';
import { useNavigate, useOutletContext } from "react-router-dom";
import AddTaskIcon from '@mui/icons-material/AddTask';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

export default function KeyFolders({ folders }) {

  const {
    openDrawer
  } = useOutletContext();

  const navigate = useNavigate();

  const handleOpenCreateTaskDrawer = folder => {
    openDrawer('create-task', { defaultFolder: folder });
  };

  return (
    <>
      {
        folders.map(folder => {
          const taskLength = folder.tasks.length;

          return (
            <Grid item xs={12} md={4} key={folder.id}>
              <Paper style={{ height: '100%' }}>
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
                      style={{ marginRight: '6px' }}
                    />
                    {folder.name}
                  </Box>
                  <Button
                    onClick={() => navigate(`/home/tasks?folderId=${folder.id}`)}>
                    View Folder
                  </Button>
                </Box>
                {
                  taskLength > 0 ?
                    <TaskList
                      tasks={folder.tasks.slice(0, 5)}
                      openDrawer={openDrawer}
                    /> :
                    <NoTasksMessage
                      handleOpenCreateTaskDrawer={() => handleOpenCreateTaskDrawer(folder)}
                    />
                }
              </Paper>
            </Grid>
          );
        })
      }
    </>
  );
};

function NoTasksMessage({ handleOpenCreateTaskDrawer }) {
  return (
    <Box mt={2}>
      <Typography variant="body2">
        There are no tasks in this folder.
      </Typography>
      <Button
        style={{ marginTop: '12px' }}
        variant="outlined"
        onClick={handleOpenCreateTaskDrawer}
        startIcon={<AddTaskIcon />}>
        New Task
      </Button>
    </Box>
  );
}

function TaskList({ tasks, openDrawer }) {
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
        minHeight={40}
        gap={0.5}
        borderRadius='8px'
        onClick={() => openDrawer('task', { taskProp: task })}
        key={task.task_id}>
        <Typography variant="body2">
          {taskName}
        </Typography>
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
    );
  });
}