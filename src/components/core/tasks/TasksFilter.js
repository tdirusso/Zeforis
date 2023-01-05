import {
  Grid,
  Paper,
  TextField,
  FormControl,
  Autocomplete,
  MenuItem,
  Select,
  InputLabel
} from "@mui/material";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import './styles.css';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import { useOutletContext } from "react-router-dom";
import Switch from '@mui/material/Switch';
import StarIcon from '@mui/icons-material/Star';

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

export default function TasksFilter(props) {

  const {
    setFilterName,
    setFilterTags,
    setFilterAssignedTo,
    setFilterFolder,
    setFilterStatus,
    setFilterKeyTasks,
    filterKeyTasks,
    filterStatus,
    setSortBy,
    sortBy
  } = props;

  const {
    tags,
    clientAdmins,
    clientMembers,
    folders
  } = useOutletContext();

  return (
    <Grid item xs={12}>
      <Paper>
        <Accordion
          disableGutters
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
                  label='Task Name'
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
                  <InputLabel size="small">Status</InputLabel>
                  <Select
                    value={filterStatus}
                    label="Status"
                    size="small"
                    onChange={e => setFilterStatus(e.target.value)}>
                    <MenuItem value='all'>All</MenuItem>
                    {
                      statuses.map(status =>
                        <MenuItem
                          key={status}
                          value={status}>
                          {status}
                        </MenuItem>)
                    }
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}></Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Switch
                    checked={filterKeyTasks}
                    onChange={(_, val) => setFilterKeyTasks(val)}
                  />}
                  label={
                    <Typography variant="body2" display="flex" alignItems="center">
                      <StarIcon fontSize="small" htmlColor="gold" />
                      Key Tasks Only
                    </Typography>
                  }
                />
              </Grid>
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

  );
};
