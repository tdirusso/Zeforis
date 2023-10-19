import { Grid, Paper, Fade, TableHead, Checkbox, Box, Tooltip, IconButton, Chip, Typography, TextField, Menu, MenuItem, Avatar, FormControl, Autocomplete, Button } from "@mui/material";
import './styles.scss';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import StarIcon from '@mui/icons-material/Star';
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { statuses } from "../../../lib/constants";
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import moment from "moment";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import EditRoundedIcon from '@mui/icons-material/EditRounded';

export default function FolderView({ folder }) {

  const {
    tagsMap,
    engagementAdmins,
    engagementMembers,
    user
  } = useOutletContext();

  const [isEditMode, setEditMode] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [sortBy, setSortBy] = useState('name');
  const [editingTask, setEditingTask] = useState(null);
  const [isEditingName, setEditingName] = useState(false);
  const [statusMenuAnchor, setStatusMenuAnchor] = useState(null);
  const [assigneeMenuAnchor, setAssigneeMenuAnchor] = useState(null);
  const [dateDueMenuAnchor, setDateDueMenuAnchor] = useState(null);
  const [tempAssignee, setTempAssignee] = useState(null);

  const statusMenuOpen = Boolean(statusMenuAnchor);
  const assigneeMenuOpen = Boolean(assigneeMenuAnchor);
  const dateDueMenuOpen = Boolean(dateDueMenuAnchor);

  const nameRef = useRef(null);

  const now = moment();
  const tomorrow = moment().add(1, 'day');

  const membersAndAdmins = [...engagementAdmins, ...engagementMembers];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (nameRef.current && !nameRef.current.contains(event.target)) {
        setEditingName(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const tasks = folder.tasks;

  const filteredTasks = tasks;

  const handleSelectAll = () => {

  };

  const handleTaskSelection = () => {

  };

  const handleEditNameClick = task => {
    setEditingTask(task);
    setEditingName(true);
  };

  const handleStatusClick = (e, task) => {
    setEditingTask(task);
    setStatusMenuAnchor(e.currentTarget);
  };

  const handleAssigneeClick = (e, task) => {
    setEditingTask(task);
    setTempAssignee(
      task.assigned_to_id ?
        {
          id: task.assigned_to_id,
          firstName: task.assigned_first,
          lastName: task.assigned_last
        } :
        null
    );
    setAssigneeMenuAnchor(e.currentTarget);
  };

  const handleAssignToMe = () => {
    setTempAssignee({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName
    });
  };

  const handleAssigneeChange = (_, newVal) => {
    setTempAssignee(newVal);
  };

  const handleDateDueClick = (e, task) => {
    setEditingTask(task);
    setDateDueMenuAnchor(e.currentTarget);
  };

  useEffect(() => {
    if (isEditingName) {
      nameRef.current.focus();
      nameRef.current.setSelectionRange(1000, 1000);
    }
  }, [isEditingName]);

  return (
    <Grid item xs={9}>
      <Fade in appear style={{ transitionDuration: '250ms', transitionDelay: '255ms' }}>
        <Paper sx={{ p: 2 }}>
          <h5>{folder.name}</h5>
          <Table size="small" className="folder-tasks-table">
            <TableHead>
              <TableRow style={{ paddingBottom: '1.5rem' }}>
                <TableCell hidden={!isEditMode} style={{ width: '60px' }}>
                  <Checkbox
                    onChange={handleSelectAll}
                    checked={selectedTasks.length === filteredTasks.length && filteredTasks.length > 0}
                  />
                </TableCell>
                <TableCell style={{ width: '350px' }} onClick={() => setSortBy('name')}>
                  <Box className="flex-ac">
                    Name <FilterListRoundedIcon
                      fontSize="small"
                      htmlColor="#cbced4"
                      style={{ marginLeft: '5px' }}
                    />
                  </Box>
                </TableCell>
                <TableCell onClick={() => setSortBy('status')}>
                  <Box className="flex-ac">
                    Status <FilterListRoundedIcon
                      fontSize="small"
                      htmlColor="#cbced4"
                      style={{ marginLeft: '5px' }}
                    />
                  </Box>
                </TableCell>
                <TableCell onClick={() => setSortBy('status')}>
                  <Box className="flex-ac">
                    Assignee <FilterListRoundedIcon
                      fontSize="small"
                      htmlColor="#cbced4"
                      style={{ marginLeft: '5px' }}
                    />
                  </Box>
                </TableCell>
                <TableCell onClick={() => setSortBy('dateDue')}>
                  <Box className="flex-ac">
                    Due <FilterListRoundedIcon
                      fontSize="small"
                      htmlColor="#cbced4"
                      style={{ marginLeft: '5px' }}
                    />
                  </Box></TableCell>
                <TableCell style={{ width: '175px' }}>Tags</TableCell>
                <TableCell style={{ width: '30px' }}></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {
                filteredTasks.map((task) => {
                  let dateDueText = '...';
                  let dateDueColor = 'inherit';

                  if (task.date_due) {
                    const dateDue = moment(task.date_due);

                    if (dateDue.isSame(now, 'day')) {
                      dateDueText = 'Today';
                      dateDueColor = '#ed6c02';
                    } else if (dateDue.isSame(tomorrow, 'day')) {
                      dateDueColor = '#0293e3';
                      dateDueText = 'Tomorrow';
                    } else if (dateDue.isBefore(now, 'day')) {
                      dateDueText = dateDue.format('MMM Do');
                      dateDueColor = 'error';
                    } else {
                      dateDueText = dateDue.format('MMM Do');
                    }
                  }

                  const tagsArray = task.tags?.split(',').filter(Boolean) || [];
                  const isSelectedRow = selectedTasks.includes(task.task_id);

                  let taskName = task.task_name;
                  if (taskName.length > 100) {
                    taskName = taskName.substring(0, 100) + '...';
                  }

                  // console.log(task);
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
                      <TableCell scope="row" className="task-name-cell" style={{ paddingLeft: 0 }}>
                        <Box className="flex-ac" gap="5px" flexGrow={1}>
                          <StarIcon
                            style={{ visibility: task.is_key_task ? 'visible' : 'hidden' }}
                            htmlColor="gold"
                            fontSize="small"
                          />
                          {
                            isEditingName && editingTask.task_id === task.task_id ?
                              <TextField
                                multiline
                                variant="standard"
                                inputProps={{
                                  style: {
                                    fontSize: 14,
                                    padding: '0 8px'
                                  }
                                }}
                                fullWidth
                                size="small"
                                inputRef={nameRef}
                                value={editingTask.task_name}
                              />
                              :
                              <>
                                <Box
                                  className="name-text"
                                  width='100%'
                                  onClick={() => handleEditNameClick(task)}>
                                  {taskName}
                                </Box>
                                <EditRoundedIcon
                                  fontSize="small"
                                  className="edit-icon"
                                />
                              </>
                          }
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={task.status}
                          deleteIcon={<MoreVertIcon fontSize="small" />}
                          onClick={e => handleStatusClick(e, task)}
                          style={{
                            marginRight: '2rem',
                          }}
                          onDelete={e => handleStatusClick(e, task)}
                          className={task.status}>
                        </Chip>
                      </TableCell>
                      <TableCell className="task-assigned-cell">
                        {
                          task.assigned_to_id ?
                            <Tooltip title={`${task.assigned_first} ${task.assigned_last}`}>
                              <IconButton
                                onClick={e => handleAssigneeClick(e, task)}
                                size="small"
                                className="assigned-btn">
                                {
                                  <Avatar>
                                    {task.assigned_first[0]}{task.assigned_last[0]}
                                  </Avatar>
                                }
                              </IconButton>
                            </Tooltip>
                            :
                            <Tooltip title="Assign task">
                              <IconButton
                                onClick={e => handleAssigneeClick(e, task)}
                                size="small"
                                className="unassigned-btn">
                                <PersonOutlineIcon />
                              </IconButton>
                            </Tooltip>
                        }

                      </TableCell>
                      <TableCell className="task-due-cell">
                        <Typography
                          onClick={e => handleDateDueClick(e, task)}
                          className="due-text"
                          color={dateDueColor}>
                          {
                            dateDueText
                          }
                        </Typography>
                        <EditRoundedIcon
                          fontSize="small"
                          className="edit-icon"
                        />
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
                })
              }
            </TableBody>
          </Table>
        </Paper>
      </Fade>

      <Menu
        anchorEl={dateDueMenuAnchor}
        open={dateDueMenuOpen}
        onClose={() => setDateDueMenuAnchor(null)}>
        <Box>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <StaticDatePicker
              renderInput={() => { }}
              onChange={() => { }}
              displayStaticWrapperAs="desktop"
            />
          </LocalizationProvider>
        </Box>
      </Menu>


      <Menu
        PaperProps={{
          className: 'assignee-menu'
        }}
        anchorEl={assigneeMenuAnchor}
        open={assigneeMenuOpen}
        onClose={() => setAssigneeMenuAnchor(null)}>
        <Box mx={1} >
          <FormControl fullWidth>
            <Autocomplete
              ListboxProps={{
                className: 'assignee-menu-list'
              }}
              size="small"
              options={membersAndAdmins}
              renderOption={(props, option) => <li {...props} key={option.id}>{option.firstName} {option.lastName}</li>}
              getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              groupBy={(option) => option.role}
              onChange={handleAssigneeChange}
              value={tempAssignee}
              renderInput={(params) => (
                <TextField
                  autoFocus
                  {...params}
                  inputProps={{
                    ...params.inputProps,
                    style: {
                      fontSize: 14
                    }
                  }}
                  placeholder="Assignee"
                />
              )}
            />
          </FormControl>
          <Box className="flex-ac" justifyContent='space-between' mt={0.25}>
            <Button
              onClick={handleAssignToMe}
              size="small"
              color="secondary">
              Assign to me
            </Button>
            <Button size="small">
              Save
            </Button>
          </Box>
        </Box>

      </Menu>

      <Menu
        anchorEl={statusMenuAnchor}
        open={statusMenuOpen}
        onClose={() => setStatusMenuAnchor(null)}>
        {
          statuses.map(({ name }) => {
            return (
              <MenuItem
                selected={name === editingTask?.status}
                key={name}
                onClick={() => { }}>
                <Chip
                  size="small"
                  label={name}
                  className={name}
                  style={{ cursor: 'pointer' }}
                />
              </MenuItem>
            );
          })
        }
      </Menu>
    </Grid >
  );
}
