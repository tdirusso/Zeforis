import { useOutletContext } from "react-router-dom";
import KeyFolders from "../../../components/core/dashboard/KeyFolders";
import KeyTasks from "../../../components/core/dashboard/KeyTasks";
import TaskStats from "../../../components/core/dashboard/TaskStats";
import UpcomingTasks from "../../../components/core/dashboard/UpcomingTasks";
import './styles.css';
import { Paper, Typography, Button, Grid } from "@mui/material";
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import CustomWidgets from "../../../components/core/dashboard/CustomWidgets";

export default function Dashboard() {
  const {
    tasks,
    folders,
    openDrawer,
    widgets,
    isAdmin
  } = useOutletContext();

  const tasksSortedByDate = tasks.sort((a, b) => {
    return new Date(a.date_due) - new Date(b.date_due);
  }).filter(t => t.date_due);

  const now = new Date();
  let numTasksInProgress = 0;
  let numTasksCompleted = 0;
  let numTasksPastDue = 0;

  const keyTasks = [];
  const keyFolders = folders.filter(folder => Boolean(folder.is_key_folder));

  tasks.forEach(task => {
    const dateDue = task.date_due ? new Date(task.date_due) : null;

    if (task.status === 'In Progress') {
      numTasksInProgress++;
    } else if (task.status === 'Complete') {
      numTasksCompleted++;
    }

    if (dateDue && (dateDue < now && task.status !== 'Complete')) {
      numTasksPastDue++;
    }

    if (task.is_key_task) {
      keyTasks.push(task);
    }
  });

  return (
    <>
      <KeyTasks tasks={keyTasks.slice(0, 5)} />
      <UpcomingTasks tasks={tasksSortedByDate.slice(0, 5)} />
      <CustomWidgets widgets={widgets} />
      <TaskStats
        numComplete={numTasksCompleted}
        numPastDue={numTasksPastDue}
        numInProgress={numTasksInProgress}
      />
      {
        keyFolders.length > 0 ?
          <KeyFolders folders={keyFolders} /> :
          <NoFoldersMessage
            isAdmin={isAdmin}
            openDrawer={openDrawer}
          />
      }
    </>
  );
};

function NoFoldersMessage({ openDrawer, isAdmin }) {
  return (
    <Grid item xs={12} md={4}>
      <Paper>
        <Typography variant="body2">
          There are currently no key folders.
        </Typography>
        <Button
          hidden={!isAdmin}
          sx={{ mt: 1.5 }}
          variant="outlined"
          onClick={() => openDrawer('create-folder')}
          startIcon={<CreateNewFolderIcon />}>
          Create Folder
        </Button>
      </Paper>
    </Grid>
  );
}