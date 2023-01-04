import { Checkbox, Chip, Grid, Paper, IconButton, TextField, FormControl, Autocomplete, Box, Button } from "@mui/material";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useOutletContext } from "react-router-dom";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import './styles.css';
import { useEffect, useState } from "react";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import { LoadingButton } from "@mui/lab";
import EditIcon from '@mui/icons-material/Edit';
import AddTaskIcon from '@mui/icons-material/AddTask';
import AddTaskModal from "../../admin/AddTaskModal";

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const statuses = [
  'New',
  'Next Up',
  'In Progress',
  'Currently Writing',
  'Pending Approval',
  'Approved',
  'Ready to Implement',
  'Complete'
];

export default function TasksTable({ tasks }) {

  const [addTaskModalOpen, setAddTaskModalOpen] = useState(false);

  const [filterName, setFilterName] = useState('');
  const [filterTags, setFilterTags] = useState([]);
  const [filterAssignedTo, setFilterAssignedTo] = useState(null);
  const [filterFolder, setFilterFolder] = useState(null);
  const [filterStatus, setFilterStatus] = useState(null);
  const [sortBy, setSortBy] = useState('name');
  const [theTasks, setTheTasks] = useState(tasks);

  useEffect(() => {
    setTheTasks(tasks);
  }, [tasks]);

  const {
    folderIdToName,
    tagIdToName,
    tags,
    clientAdmins,
    clientMembers,
    folders
  } = useOutletContext();

  const handleMenuClick = () => {

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

    if (filterStatus) {
      shouldReturnTask = filterStatus === task.status;
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
      filteredTasks = filteredTasks.filter(t => t.date_due).sort((a, b) => {
        return new Date(a.date_due) - new Date(b.date_due);
      });
      break;
    case 'folder':
      filteredTasks.sort((a, b) => folderIdToName[a.folder_id].localeCompare(folderIdToName[b.folder_id]));
      break;
    default:
      break;
  }

  return (
    <>
      <Grid item xs={12}>
        <Paper>
          <Accordion
            disableGutters
            defaultExpanded
            sx={{
              '&.MuiPaper-root': {
                p: '0 !important',
                boxShadow: 0
              }
            }}>
            <AccordionSummary
              sx={{
                justifyContent: 'flex-start',
                '& .MuiAccordionSummary-content': {
                  flexGrow: 0
                }
              }}
              expandIcon={<ExpandMoreIcon />}>
              <Typography sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
                <FilterAltIcon htmlColor="#cbced4" />
                Filters
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container rowSpacing={2} columnSpacing={2}>
                <Grid item xs={12} md={4} >
                  <TextField
                    fullWidth
                    size="small"
                    label='Name'
                    onChange={e => setFilterName(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <Autocomplete
                      size="small"
                      options={[...clientAdmins, ...clientMembers]}
                      getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      groupBy={(option) => option.role}
                      onChange={(_, newVal) => setFilterAssignedTo(newVal)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Assigned To"
                        />
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <Autocomplete
                      multiple
                      options={tags}
                      isOptionEqualToValue={(option, value) => option.name === value.name}
                      getOptionLabel={(option) => option.name}
                      filterSelectedOptions
                      disableCloseOnSelect
                      size="small"
                      onChange={(_, newVal) => setFilterTags(newVal)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Tags"
                        />
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <Autocomplete
                      size="small"
                      options={folders}
                      getOptionLabel={(option) => option.name || ''}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      onChange={(_, newVal) => setFilterFolder(newVal)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Folder"
                        />
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <Autocomplete
                      size="small"
                      options={statuses}
                      onChange={(_, newVal) => setFilterStatus(newVal)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Status"
                        />
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4}></Grid>
                <Grid item xs>
                  <FormControl className="filter-sort-buttons">
                    <FormLabel>Sort by</FormLabel>
                    <RadioGroup
                      row
                      value={sortBy}
                      onChange={(_, val) => setSortBy(val)}
                      name="row-radio-buttons-group">
                      <FormControlLabel
                        value="name"
                        control={<Radio size="small" />}
                        label="Task Name (default)"
                      />
                      <FormControlLabel
                        value="status"
                        control={<Radio size="small" />}
                        label="Status"
                      />
                      <FormControlLabel
                        value="dateDue"
                        control={<Radio size="small" />}
                        label="Date Due"
                      />
                      <FormControlLabel
                        value="folder"
                        control={<Radio size="small" />}
                        label="Folder"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Paper>
      </Grid>

      <Grid item xs={12}>
        <Box display="flex" justifyContent="space-between">
          <LoadingButton
            variant="contained"
            startIcon={<EditIcon />}>
            Edit Selected
          </LoadingButton>
          <Button
            variant="outlined"
            onClick={() => setAddTaskModalOpen(true)}
            startIcon={<AddTaskIcon />}>New Task</Button>
        </Box>
      </Grid>

      <Grid item xs={12}>
        <Paper sx={{ px: 0, overflowX: 'auto' }}>
          <Table sx={{ minWidth: 650 }} className="tasks-table" size="small">
            <TableHead>
              <TableRow sx={{
                '& .MuiTableCell-root': { border: 0 }
              }}>
                <TableCell><Checkbox /></TableCell>
                <TableCell sx={{ width: '175px' }}>Name</TableCell>
                <TableCell>Assigned To</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Progress</TableCell>
                <TableCell>Due</TableCell>
                <TableCell sx={{ width: '175px' }}>Tags</TableCell>
                <TableCell>Folder</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTasks.map((task) => {
                const dateDue = new Date(task.date_due);
                const dateDueDay = days[dateDue.getDay()];
                const dateDueMonth = months[dateDue.getMonth()];

                const tagsArray = task.tags?.split(',') || [];

                return (
                  <TableRow
                    hover
                    key={task.task_id}
                    sx={{
                      '& .MuiTableCell-root': { border: 0 }
                    }}
                  >
                    <TableCell><Checkbox /></TableCell>
                    <TableCell scope="row">
                      {task.task_name}
                    </TableCell>
                    <TableCell>{task.assigned_first} {task.assigned_last}</TableCell>
                    <TableCell>
                      <Chip
                        label={task.status}
                        className={task.status}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{task.progress}</TableCell>
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
                          label={tagIdToName[tagId]}
                          size="small"
                          sx={{ m: 0.5 }}
                        />)}
                    </TableCell>

                    <TableCell>{folderIdToName[task.folder_id]}</TableCell>
                    <TableCell>
                      <IconButton onClick={handleMenuClick}>
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              }
              )}
            </TableBody>
          </Table>
        </Paper>
      </Grid>

      <AddTaskModal
        open={addTaskModalOpen}
        setOpen={setAddTaskModalOpen}
      />
    </>
  );
};
