import {
  Checkbox,
  Chip,
  Grid,
  Paper,
  IconButton,
  Box,
  Button,
  TablePagination,
  Typography,
  Tooltip,
  FormGroup,
  FormControlLabel,
  Switch
} from "@mui/material";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import './styles.css';
import { useEffect, useState } from "react";
import { LoadingButton } from "@mui/lab";
import EditIcon from '@mui/icons-material/Edit';
import AddTaskIcon from '@mui/icons-material/AddTask';
import AddTaskModal from "../../admin/AddTaskModal";
import TasksFilter from "./TasksFilter";
import EditSelectedTasksModal from "../../admin/EditSelectedTasksModal";
import RemoveTasksModal from "../../admin/RemoveTasksModal";
import DeleteIcon from '@mui/icons-material/Delete';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import StarIcon from '@mui/icons-material/Star';

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function TasksTable({ tasks }) {

  const {
    foldersMap,
    tagsMap,
    isAdmin
  } = useOutletContext();

  const [addTaskModalOpen, setAddTaskModalOpen] = useState(false);
  const [editSelectedTasksModalOpen, setEditSelectedTasksModalOpen] = useState(false);
  const [removeTasksModalOpen, setRemoveTasksModalOpen] = useState(false);

  const [page, setPage] = useState(0);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);

  const { search } = useLocation();

  const queryParams = new URLSearchParams(search);

  const preFilterKeyTasks = queryParams.get('preFilterKeyTasks');
  const preSort = queryParams.get('preSort') || 'name';
  const folderId = queryParams.get('folderId');

  const [filterName, setFilterName] = useState('');
  const [filterTags, setFilterTags] = useState([]);
  const [filterAssignedTo, setFilterAssignedTo] = useState(null);
  const [filterFolder, setFilterFolder] = useState(folderId ? foldersMap[folderId] : null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterKeyTasks, setFilterKeyTasks] = useState(Boolean(preFilterKeyTasks));
  const [sortBy, setSortBy] = useState(preSort);
  const [theTasks, setTheTasks] = useState(tasks);

  const navigate = useNavigate();

  useEffect(() => {
    setTheTasks(tasks);
  }, [tasks]);

  const handleTaskSelection = (taskId) => {
    if (isEditMode) {
      if (selectedTasks.includes(taskId)) {
        setSelectedTasks(selectedTasks.filter(id => id !== taskId));
      } else {
        setSelectedTasks(taskIds => [...taskIds, taskId]);
      }
    } else {
      navigate(`/home/task/${taskId}?exitPath=/home/tasks`);
    }
  };

  const handleSelectAll = (_, isChecked) => {
    if (isChecked) {
      setSelectedTasks(filteredTasks.map(({ task_id }) => task_id));
    } else {
      setSelectedTasks([]);
    }
  };

  const handleEditModeChange = (_, val) => {
    setSelectedTasks([]);
    setIsEditMode(val);
  };

  let filteredTasks = [...theTasks];

  filteredTasks = filteredTasks.filter(task => {
    let shouldReturnTask = true;
    const tagIds = task.tags?.split(',') || [];

    if (filterName) {
      shouldReturnTask = task.task_name.toLowerCase().includes(filterName.toLowerCase());
      if (!shouldReturnTask) {
        return false;
      }
    }

    if (filterAssignedTo) {
      shouldReturnTask = filterAssignedTo.id === task.assigned_to_id;
      if (!shouldReturnTask) {
        return false;
      }
    }

    if (filterTags.length > 0) {
      shouldReturnTask = filterTags.every(({ id }) => tagIds.includes(String(id)));
      if (!shouldReturnTask) {
        return false;
      }
    }

    if (filterFolder) {
      shouldReturnTask = filterFolder.id === task.folder_id;
      if (!shouldReturnTask) {
        return false;
      }
    }

    if (filterStatus !== 'all') {
      shouldReturnTask = filterStatus === task.status;
      if (!shouldReturnTask) {
        return false;
      }
    }

    if (filterKeyTasks) {
      shouldReturnTask = Boolean(task.is_key_task);
    }

    return shouldReturnTask;;
  });

  switch (sortBy) {
    case 'name':
      filteredTasks.sort((a, b) => a.task_name.localeCompare(b.task_name));
      break;
    case 'status':
      filteredTasks.sort((a, b) => a.status.localeCompare(b.status));
      break;
    case 'dateDue':
      filteredTasks.sort((a, b) => {
        // Sort all tasks without due dates to the bottom
        if (!a.date_due) return 1;
        if (!b.date_due) return -1;
        else return 0;
      }).sort((a, b) => {
        // Now sort by the due date
        if (!a.date_due || !b.date_due) return 1;
        return new Date(a.date_due) - new Date(b.date_due);
      });
      break;
    case 'folder':
      filteredTasks.sort((a, b) => foldersMap[a.folder_id].name.localeCompare(foldersMap[b.folder_id].name));
      break;
    default:
      break;
  }

  return (
    <>
      <TasksFilter
        setFilterName={setFilterName}
        setFilterTags={setFilterTags}
        setFilterAssignedTo={setFilterAssignedTo}
        setFilterFolder={setFilterFolder}
        setFilterStatus={setFilterStatus}
        setFilterKeyTasks={setFilterKeyTasks}
        filterKeyTasks={filterKeyTasks}
        filterStatus={filterStatus}
        filterFolder={filterFolder}
        setSortBy={setSortBy}
        sortBy={sortBy}
      />

      <Grid item xs={12} hidden={!isAdmin}>
        <Box
          display="flex"
          justifyContent="space-between">
          <Box display="flex" alignItems="center">
            <LoadingButton
              variant="contained"
              sx={{ mr: 1.5 }}
              onClick={() => setEditSelectedTasksModalOpen(true)}
              disabled={selectedTasks.length === 0}
              startIcon={<EditIcon />}>
              Edit Selected
            </LoadingButton>
            {
              selectedTasks.length > 0 ?
                <Button
                  variant="outlined"
                  sx={{ mr: 1.5 }}
                  onClick={() => setRemoveTasksModalOpen(true)}
                  startIcon={<DeleteIcon />}
                  color="error">
                  Delete Selected
                </Button> :
                ''
            }
            {
              selectedTasks.length > 0 ?
                <Box component="h6">
                  {selectedTasks.length} selected
                </Box> :
                ''
            }
          </Box>
          <Button
            variant="outlined"
            onClick={() => setAddTaskModalOpen(true)}
            startIcon={<AddTaskIcon />}>
            New Task
          </Button>
        </Box>
      </Grid>

      <Grid item xs={12} hidden={!isAdmin}>
        <Box>
          <FormGroup>
            <FormControlLabel
              fontSize="small"
              control={<Switch
                size="small"
                onChange={handleEditModeChange}
              />}
              label={
                <Typography
                  variant="body2">
                  Editing mode
                </Typography>
              }
            />
          </FormGroup>
        </Box>
      </Grid>

      <Grid item xs={12}>
        <Paper sx={{ px: 0, overflowX: 'auto' }}>
          <Table
            sx={{ minWidth: 650 }}
            className="tasks-table"
            size="small">
            <TableHead>
              <TableRow sx={{ pb: 3 }}>
                <TableCell hidden={!isEditMode}>
                  <Checkbox
                    onChange={handleSelectAll}
                    checked={selectedTasks.length === filteredTasks.length && filteredTasks.length > 0}
                  />
                </TableCell>
                <TableCell sx={{ width: '175px' }}>Name</TableCell>
                <TableCell>Assigned To</TableCell>
                <TableCell>Status</TableCell>
                <TableCell sx={{ width: '160px' }}>Due</TableCell>
                <TableCell sx={{ width: '175px' }}>Tags</TableCell>
                <TableCell>Folder</TableCell>
                <TableCell sx={{ width: '30px' }}></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {
                filteredTasks.slice(page * 25, (page * 25) + 25).map((task) => {
                  const dateDue = new Date(task.date_due);
                  const dateDueDay = days[dateDue.getDay()];
                  const dateDueMonth = months[dateDue.getMonth()];

                  const tagsArray = task.tags?.split(',') || [];

                  const isSelectedRow = selectedTasks.includes(task.task_id);

                  let taskName = task.task_name;
                  if (taskName.length > 30) {
                    taskName = taskName.substring(0, 30) + '...';
                  }

                  return (
                    <TableRow
                      hover
                      onClick={() => handleTaskSelection(task.task_id)}
                      key={task.task_id}
                      className={isSelectedRow ? 'selected' : ''}
                      sx={{ position: 'relative', }}>
                      <TableCell hidden={!isEditMode}>
                        <Checkbox checked={isSelectedRow} />
                      </TableCell>
                      <TableCell scope="row">
                        <Box display="flex" alignItems="center">
                          {
                            task.is_key_task ?
                              <StarIcon
                                htmlColor="gold"
                                sx={{ mr: 0.3 }}
                                fontSize="small"
                              /> :
                              ''
                          }
                          {taskName}
                        </Box>

                      </TableCell>
                      <TableCell>
                        {task.assigned_first} {task.assigned_last}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={task.status}
                          className={task.status}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {
                          task.date_due ?
                            `${dateDueDay}, ${dateDueMonth} ${dateDue.getDate()}, ${dateDue.getFullYear()}` :
                            'None'
                        }
                      </TableCell>

                      <TableCell>{
                        tagsArray.map(tagId =>
                          <Chip
                            key={tagId}
                            label={tagsMap[tagId].name}
                            size="small"
                            sx={{ m: 0.5 }}
                          />)}
                      </TableCell>

                      <TableCell>{foldersMap[task.folder_id].name}</TableCell>
                      <TableCell>
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
                            </Tooltip> : <Box height={36}></Box>
                        }
                      </TableCell>
                    </TableRow>
                  );
                }
                )}
            </TableBody>
          </Table>

          <Box mt={2} mr={2}>
            <TablePagination
              rowsPerPageOptions={[-1]}
              component="div"
              count={filteredTasks.length}
              rowsPerPage={25}
              page={page}
              onPageChange={(_, pageNum) => setPage(pageNum)}
            />
          </Box>
        </Paper>
      </Grid>

      <AddTaskModal
        open={addTaskModalOpen}
        setOpen={setAddTaskModalOpen}
      />

      <EditSelectedTasksModal
        taskIds={selectedTasks}
        open={editSelectedTasksModalOpen}
        setOpen={setEditSelectedTasksModalOpen}
        setSelectedTasks={setSelectedTasks}
      />

      <RemoveTasksModal
        open={removeTasksModalOpen}
        setOpen={setRemoveTasksModalOpen}
        taskIds={selectedTasks}
        setSelectedTasks={setSelectedTasks}
      />
    </>
  );
};
