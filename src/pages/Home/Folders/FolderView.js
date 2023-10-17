import { Grid, Paper, Fade, TableHead, Checkbox, Box, Tooltip, IconButton, Chip, Typography, TextField } from "@mui/material";
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
import EditIcon from '@mui/icons-material/Edit';

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];


export default function FolderView({ folder }) {

  const {
    tagsMap
  } = useOutletContext();

  const [isEditMode, setEditMode] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [sortBy, setSortBy] = useState('name');
  const [editingTask, setEditingTask] = useState(null);
  const [isEditingName, setEditingName] = useState(false);

  const nameRef = useRef(null);

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
                              <Box
                                className="name-text"
                                width='100%'
                                onClick={() => handleEditNameClick(task)}>
                                {taskName}
                              </Box>
                          }
                        </Box>
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
                            `${dateDueDay}, ${dateDueMonth} ${dateDue.getDate()}` :
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
                })
              }
            </TableBody>
          </Table>
        </Paper>
      </Fade>
    </Grid>
  );
}
