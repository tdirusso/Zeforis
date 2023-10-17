import { Grid, Paper, Fade, TableHead, Checkbox, Box, Tooltip, IconButton, Chip } from "@mui/material";
import './styles.scss';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import StarIcon from '@mui/icons-material/Star';
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { useState } from "react";
import { useOutletContext } from "react-router-dom";

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];


export default function FolderView({ folder }) {

  const {
    tagsMap
  } = useOutletContext();

  const [isEditMode, setEditMode] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [sortBy, setSortBy] = useState('name');


  const tasks = folder.tasks;

  const filteredTasks = tasks;

  const handleSelectAll = () => {

  };

  const handleTaskSelection = () => {

  };

  return (
    <Grid item xs={9}>
      <Fade in appear style={{ transitionDuration: '250ms', transitionDelay: '255ms' }}>
        <Paper sx={{ p: 2 }}>
          <h5>{folder.name}</h5>
          <Table size="small">
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
              {filteredTasks.map((task) => {
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
              })}
            </TableBody>
          </Table>
        </Paper>
      </Fade>
    </Grid>
  );
}
