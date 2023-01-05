import { Chip, Divider, Grid, Paper, IconButton } from "@mui/material";
import { useLocation, useNavigate, useOutletContext, useParams } from "react-router-dom";
import Button from '@mui/material/Button';
import { Box, Typography } from '@mui/material';
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
import { useState } from "react";
import StarIcon from '@mui/icons-material/Star';
import EditIcon from '@mui/icons-material/Edit';
import EditTaskModal from "../../../components/admin/EditTaskModal";

export default function TaskPage() {

  const { taskId } = useParams();
  const navigate = useNavigate();

  const [copyButtonText, setCopyButtonText] = useState('Copy Link URL');
  const [editTaskModalOpen, setEditTaskModalOpen] = useState(false);

  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);

  const exitPath = queryParams.get('exitPath');

  const {
    tasks,
    foldersMap,
    tagsMap
  } = useOutletContext();

  const task = tasks.find(t => t.task_id === Number(taskId));

  const taskTagIds = task.tags?.split(',').filter(Boolean) || [];
  const taskTags = taskTagIds.map(id => tagsMap[id].name);

  const handleCopyLink = () => {
    window.navigator.clipboard.writeText(task.link_url);
    setCopyButtonText('Copied!');
    setTimeout(() => {
      setCopyButtonText('Copy Link URL');
    }, 500);
  };

  return (
    <>
      <Header />
      <Grid
        item
        xs={12}
        md={8}
        sx={{ margin: 'auto' }}>
        <Paper sx={{ px: '45px' }}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between">
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(exitPath)}>
              Back
            </Button>
            <IconButton
              onClick={() => setEditTaskModalOpen(true)}
              size="large">
              <EditIcon size="large" />
            </IconButton>
          </Box>
          <Box
            my={2}
            display="flex"
            alignItems="center"
            justifyContent="space-between">
            <Box mr={3}>
              <Box component="h2">
                {task.task_name}
              </Box>
              {
                task.is_key_task ?
                  <Box display="flex" alignItems="center" mt={0.5}>
                    <StarIcon htmlColor="gold" fontSize="small" />
                    <Typography variant="caption">Key Task</Typography>
                  </Box>
                  :
                  ''
              }
            </Box>
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
          <Divider sx={{ mt: 4 }} />
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
                onClick={() => window.open(task.link_url, '_blank')}
                endIcon={<OpenInNewIcon />}
                variant="outlined">
                Open Link URL
              </Button>
              <Button
                onClick={handleCopyLink}
                disabled={!Boolean(task.link_url)}
                startIcon={<ContentCopyIcon />}>
                {copyButtonText}
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
              <Typography variant="body2">
                {task.progress}%
              </Typography>
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
                {foldersMap[task.folder_id].name}
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
                    sx={{ m: 0.5 }}
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
        </Paper>
      </Grid>

      <EditTaskModal
        open={editTaskModalOpen}
        setOpen={setEditTaskModalOpen}
        task={task}
      />
    </>
  );
};
