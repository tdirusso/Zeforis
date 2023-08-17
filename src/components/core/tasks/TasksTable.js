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
  Switch,
  useMediaQuery
} from "@mui/material";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useLocation, useOutletContext } from "react-router-dom";
import './styles.scss';
import { useState } from "react";
import EditIcon from '@mui/icons-material/Edit';
import TasksFilter from "./TasksFilter";
import DeleteIcon from '@mui/icons-material/Delete';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import StarIcon from '@mui/icons-material/Star';

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function TasksTable({ tasks }) {

  const {
    foldersMap,
    tagsMap,
    isAdmin,
    openDrawer,
    openModal
  } = useOutletContext();

  const isSmallScreen = useMediaQuery('(max-width: 500px)');

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

  const handleTaskSelection = task => {
    if (isEditMode) {
      if (selectedTasks.includes(task.task_id)) {
        setSelectedTasks(selectedTasks.filter(id => id !== task.task_id));
      } else {
        setSelectedTasks(taskIds => [...taskIds, task.task_id]);
      }
    } else {
      openDrawer('task', { taskProp: task });
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

  const filteredTasks = tasks.filter(task => {
    const tagIds = task.tags?.split(',').filter(Boolean).map(id => String(id)) || [];

    return (!filterName || task.task_name.toLowerCase().includes(filterName.toLowerCase())) &&
      (!filterAssignedTo || filterAssignedTo.id === task.assigned_to_id) &&
      (filterTags.length === 0 || filterTags.every(tag => tagIds.includes(tag.id.toString()))) &&
      (!filterFolder || filterFolder.id === task.folder_id) &&
      (filterStatus === 'all' || filterStatus === task.status) &&
      (!filterKeyTasks || task.is_key_task);
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
        filterName={filterName}
        filterAssignedTo={filterAssignedTo}
        filterTags={filterTags}
      />

      <Grid item xs={12}>
        <Paper className="px0" style={{ overflowX: 'auto' }}>
          <Box px={3} mb={2} hidden={!isAdmin}>
            <Button
              variant="contained"
              onClick={() => openDrawer('create-task')}>
              New Task
            </Button>
          </Box>
          <Box
            hidden={!isAdmin}
            display='flex'
            alignItems='center'
            px={3}
            mb={2}
            height={40}>
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
                    Edit
                  </Typography>
                }
              />
            </FormGroup>
            <Button
              hidden={!isEditMode}
              variant="outlined"
              style={{ marginRight: '0.75rem' }}
              onClick={() => openModal('edit-tasks', { taskIds: selectedTasks, setSelectedTasks })}
              disabled={selectedTasks.length === 0}
              startIcon={<EditIcon />}>
              Edit
            </Button>
            {
              selectedTasks.length > 0 ?
                <Box component="h6" textAlign='center'>
                  {selectedTasks.length} selected
                </Box> :
                null
            }
            {
              selectedTasks.length > 0 ?
                isSmallScreen ?
                  <IconButton
                    onClick={() => openModal('delete-tasks', { taskIds: selectedTasks, setSelectedTasks })}
                    style={{ marginLeft: 'auto' }} color="error">
                    <DeleteIcon />
                  </IconButton> :
                  <Button
                    style={{ marginLeft: 'auto' }}
                    onClick={() => openModal('delete-tasks', { taskIds: selectedTasks, setSelectedTasks })}
                    startIcon={<DeleteIcon />}
                    color="error">
                    Delete
                  </Button> :
                null
            }
          </Box>
          <Table
            className="tasks-table"
            size="small">
            <TableHead>
              <TableRow style={{ paddingBottom: '1.5rem' }}>
                <TableCell hidden={!isEditMode} style={{ width: '60px' }}>
                  <Checkbox
                    onChange={handleSelectAll}
                    checked={selectedTasks.length === filteredTasks.length && filteredTasks.length > 0}
                  />
                </TableCell>
                <TableCell style={{ width: '350px' }}>Name</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Folder</TableCell>
                <TableCell>Due</TableCell>
                <TableCell style={{ width: '175px' }}>Tags</TableCell>
                <TableCell style={{ width: '30px' }}></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {
                filteredTasks.slice(page * 25, (page * 25) + 25).map(task => {
                  const dateDue = new Date(task.date_due);
                  const dateDueDay = days[dateDue.getDay()];
                  const dateDueMonth = months[dateDue.getMonth()];

                  const tagsArray = task.tags?.split(',').filter(Boolean) || [];
                  const isSelectedRow = selectedTasks.includes(task.task_id);

                  let taskName = task.task_name;
                  if (taskName.length > 100) {
                    taskName = taskName.substring(0, 100) + '...';
                  }

                  return (
                    <TableRow
                      hover
                      onClick={() => handleTaskSelection(task)}
                      key={task.task_id}
                      className={isSelectedRow ? 'selected' : ''}
                      style={{ position: 'relative', }}>
                      <TableCell hidden={!isEditMode}>
                        <Checkbox checked={isSelectedRow} />
                      </TableCell>
                      <TableCell scope="row">
                        {
                          task.is_key_task ?
                            <StarIcon
                              htmlColor="gold"
                              style={{ position: 'relative', top: '4px', right: '2px' }}
                              fontSize="small"
                            /> :
                            ''
                        }
                        {taskName}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={task.status}
                          className={task.status}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{foldersMap[task.folder_id].name}</TableCell>
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
                            style={{ marginRight: '10px', marginBottom: '5px' }}
                          />)}
                      </TableCell>
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
    </>
  );
};
