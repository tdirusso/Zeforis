import { Chip, Divider, Grid, Paper } from "@mui/material";
import { useLocation, useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useRef, useState } from 'react';
import Button from '@mui/material/Button';
import { Box, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Snackbar from '../../../components/core/Snackbar';
import useSnackbar from '../../../hooks/useSnackbar';
import RemoveTasksModal from "../../../components/admin/RemoveTasksModal";
import { updateTask } from "../../../api/task";
import Header from "../../../components/core/Header";
import Alert from '@mui/material/Alert';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import FolderIcon from '@mui/icons-material/Folder';
import Avatar from '@mui/material/Avatar';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { LinearProgress } from "@mui/material";

export default function TaskPage() {

  const { taskId } = useParams();
  const navigate = useNavigate();

  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);

  const exitPath = queryParams.get('exitPath');

  const {
    tasks,
    tags,
    client,
    setTasks,
    folderIdToName,
    tagIdToName
  } = useOutletContext();

  const {
    isOpen,
    openSnackBar,
    type,
    message
  } = useSnackbar();

  const task = tasks.find(t => t.task_id === Number(taskId));

  const name = useRef();
  const description = useRef();
  const linkUrl = useRef();

  const clientId = client.id;

  const tagIdNameMap = {};
  tags.forEach(tag => tagIdNameMap[tag.id] = tag.name);

  const curTagsIds = task.tags?.split(',').filter(Boolean) || [];
  const taskTagIds = task.tags?.split(',').filter(Boolean) || [];

  const currentTags = curTagsIds.map(tagId => tagIdToName[tagId]);
  const taskTags = taskTagIds.map(id => tagIdToName[id]);

  const [status, setStatus] = useState(task.status);
  const [folderId, setFolderId] = useState(task.folder_id);
  const [assignedToId, setAssignedToId] = useState(task.assigned_to_id);
  const [progress, setProgress] = useState(task.progress);
  const [selectedTags, setSelectedTags] = useState(currentTags);
  const [isKeyTask, setIsKeyTask] = useState(Boolean(task.is_key_task));
  const [dueDate, setDueDate] = useState(task.date_due);
  const [isLoading, setLoading] = useState(false);
  const [removeTasksModalOpen, setRemoveTasksModalOpen] = useState(false);

  if (!task) {
    return <div>No task found.</div>;
  }

  const tasksIdMap = {};

  tasks.forEach(t => tasksIdMap[t.task_id] = t);

  const handleUpdateTask = () => {
    const nameVal = name.current.value;
    const descriptionVal = description.current.value;
    const linkVal = linkUrl.current.value;

    if (!nameVal) {
      openSnackBar('Please enter a name for the task.', 'error');
      return;
    }

    if (!folderId) {
      openSnackBar('Please select a folder the task should reside in.', 'error');
      return;
    }

    setLoading(true);

    setTimeout(async () => {
      try {
        const result = await updateTask({
          name: nameVal,
          description: descriptionVal,
          linkUrl: linkVal,
          status,
          assignedToId,
          progress,
          folderId,
          clientId,
          tags: selectedTags,
          isKeyTask,
          dueDate,
          taskId,
          currentTags
        });

        if (result.task) {
          let tasksClone = [...tasks];
          let theTaskIndex = tasksClone.findIndex(t => t.task_id === Number(taskId));
          tasksClone[theTaskIndex] = result.task;

          setTasks(tasksClone);
          openSnackBar('Task updated.', 'success');
          setLoading(false);
        } else {
          openSnackBar(result.message, 'error');
          setLoading(false);
        }
      } catch (error) {
        openSnackBar(error.message, 'error');
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <>
      <Header />

      <Grid item xs={12} md={8} sx={{ margin: 'auto' }}>
        <Paper sx={{ px: '45px' }}>
          <Box>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(exitPath)}>
              Back
            </Button>
          </Box>
          <Box my={2} display="flex" alignItems="center">
            <Box component="h2" mr={2}>{task.task_name}</Box>
            <Chip
              label={task.status}
              className={task.status}>
            </Chip>
          </Box>
          <Box my={2}>
            <Typography variant="body1">
              {
                task.description ? task.description : 'No description.'
              }
            </Typography>
          </Box>
          <Box my={4}>
            <Box component="h4" mb={0.5}>Link URL</Box>
            <Typography mb={1}>
              {
                task.link_url ? task.link_url : 'None.'
              }
            </Typography>
            <Box>
              <Button
                disabled={!Boolean(task.link_url)}
                sx={{ mr: 1.5 }}
                endIcon={<OpenInNewIcon />}
                variant="outlined">
                Open Link URL
              </Button>
              <Button
                disabled={!Boolean(task.link_url)}
                startIcon={<ContentCopyIcon />}
              >Copy Link URL
              </Button>
            </Box>
          </Box>

          <Divider />

          <Box my={4}>
            <Box component="h4" mb={2}>Progress</Box>
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

          <Divider />

          <Box my={4}
            display="flex"
            justifyContent="space-evenly"
            textAlign="center"
            flexWrap="wrap"
            gap={2}>
            <Box>
              <Box component="h4" mb={1}>Folder</Box>
              <Button
                variant="outlined"
                size="large"
                startIcon={<FolderIcon />}>
                {folderIdToName[task.folder_id]}
              </Button>
            </Box>

            <Box>
              <Box component="h4" mb={1}>Assigned To</Box>
              <Box display="flex" alignItems="center">
                <Avatar sx={{ mr: 1 }}>
                  <PersonIcon />
                </Avatar>
                <Typography mb={0.5}>
                  {task.assigned_first} {task.assigned_last}
                </Typography>
              </Box>
            </Box>

            <Box>
              <Box component="h4" mb={1}>Date Due</Box>
              <Box display="flex" alignItems="center">
                <Avatar sx={{ mr: 1 }}>
                  <CalendarTodayIcon />
                </Avatar>
                <Typography mb={0.5}>
                  {
                    task.date_due ? new Date(task.date_due).toLocaleDateString() : 'None'
                  }
                </Typography>
              </Box>
            </Box>
          </Box>
          <Divider />

          <Box my={4}>
            <Box component="h4" mb={2}>Tags</Box>
            <Box>
              {
                taskTags.length > 0 ?
                  taskTags.map(tag => <Chip 
                    label={tag}
                     key={tag}
                     sx={{m: 0.5}}
                      />) :
                  'None.'
              }
            </Box>
          </Box>
          <Divider />
          
          <Box my={4}>
          <Alert severity="info">
            Last updated by {task.updated_by_first} {task.updated_by_last} on
            &nbsp;{new Date(new Date(task.date_last_updated).toLocaleString() + ' UTC').toLocaleString()}
          </Alert>

          </Box>


          <Grid container sx={{ mt: 4 }}>
            <Grid item sx={12}>
              <Button
                disabled={isLoading}
                onClick={() => navigate(exitPath)}>
                Cancel
              </Button>

              <LoadingButton
                variant="contained"
                color="error"
                disabled={isLoading}
                onClick={() => setRemoveTasksModalOpen(true)}>
                Delete Task
              </LoadingButton>

              <LoadingButton
                loading={isLoading}
                variant="contained"
                onClick={handleUpdateTask}>
                Update Task
              </LoadingButton>
            </Grid>
          </Grid>
        </Paper>
      </Grid>

      <Snackbar
        isOpen={isOpen}
        type={type}
        message={message}
      />

      <RemoveTasksModal
        open={removeTasksModalOpen}
        setOpen={setRemoveTasksModalOpen}
        taskIds={[task.task_id]}
        setTasks={setTasks}
        clientId={client.id}
        exitPath={exitPath}
      />
    </>
  );
};
