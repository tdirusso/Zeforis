import { Box, Paper, Typography, Button, Grid, Tooltip, IconButton, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Folder } from "@shared/types/Folder";
import { AppContext } from "src/types/AppContext";
import { Task } from "@shared/types/Task";

type KeyFoldersProps = {
  folders: Folder[],
  isAdmin: boolean,
  openDrawer: AppContext['openDrawer'];
};

export default function KeyFolders({ folders, isAdmin, openDrawer }: KeyFoldersProps) {

  const navigate = useNavigate();

  const theme = useTheme();
  const taskButtonTextColor = theme.palette.text.primary;

  if (folders.length === 0) {
    return <NoFoldersMessage isAdmin={isAdmin} openDrawer={openDrawer} />;
  }

  const handleOpenCreateTaskDrawer = (folder: Folder) => {
    openDrawer('create-task', { defaultFolder: folder });
  };

  return (
    <>
      {
        folders.map(folder => {
          const taskLength = folder.tasks?.length || 0;

          return (
            <Grid item xs={12} md={3} key={folder.id} marginBottom={3}>
              <Paper style={{ height: '100%' }} className="folder">
                <Box
                  gap={2}
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between">
                  <Box
                    component="h5"
                    display="flex"
                    alignItems="center">
                    {folder.name}
                  </Box>
                  <Button
                    size="small"
                    onClick={() => navigate(`/home/folders?viewingFolderId=${folder.id}`)}>
                    View folder
                  </Button>
                </Box>
                {
                  taskLength > 0 ?
                    <TaskList
                      tasks={folder.tasks?.slice(0, 5) || []}
                      openDrawer={openDrawer}
                      buttonColor={taskButtonTextColor}
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

type NoFoldersMessageProps = {
  openDrawer: AppContext['openDrawer'],
  isAdmin: boolean;
};

function NoFoldersMessage({ openDrawer, isAdmin }: NoFoldersMessageProps) {
  return (
    <Grid item xs={12} md={4}>
      <Paper className="folder p0">
        <Button
          fullWidth
          hidden={!isAdmin}
          style={{ padding: '2.5rem 24px' }}
          onClick={() => openDrawer('folder', { folderProps: { is_key_folder: true } })}>
          + New folder
        </Button>
      </Paper>
    </Grid>
  );
}

type NoTasksMessageProps = {
  handleOpenCreateTaskDrawer: () => void;
};

function NoTasksMessage({ handleOpenCreateTaskDrawer }: NoTasksMessageProps) {
  return (
    <Box mt={2}>
      <Typography variant="body2">
        No tasks in this folder.
      </Typography>
      <Button
        size="small"
        style={{ marginTop: '12px' }}
        onClick={handleOpenCreateTaskDrawer}>
        + Task
      </Button>
    </Box>
  );
}

type TasksList = {
  tasks: Task[],
  openDrawer: AppContext['openDrawer'],
  buttonColor: string;
};

function TaskList({ tasks, openDrawer, buttonColor }: TasksList) {
  return <>
    {
      tasks.map(task => {
        let taskName = task.task_name;

        if (task.task_name.length > 30) {
          taskName = taskName.substring(0, 30) + ' ...';
        }

        return (
          <Box
            style={{ color: buttonColor }}
            className="task-button"
            component={Button}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            p={0}
            minHeight={35}
            gap={0.5}
            px={.5}
            borderRadius='8px'
            onClick={() => openDrawer('task', { taskProp: task })}
            key={task.task_id}>
            <Typography variant="body2">
              {taskName}
            </Typography>
            {
              task.link_url ?
                <Tooltip title="Open Link">
                  <a href={task.link_url} target="_blank" rel="noreferrer">
                    <IconButton
                      component="div"
                      onClick={e => e.stopPropagation()}>
                      <OpenInNewIcon
                        fontSize="small"
                      />
                    </IconButton>
                  </a>
                </Tooltip> : null
            }
          </Box>
        );
      })
    }
  </>;
}