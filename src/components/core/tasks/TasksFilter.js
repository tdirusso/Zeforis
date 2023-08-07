import {
  Grid,
  Paper,
  TextField,
  FormControl,
  Autocomplete,
  MenuItem,
  Select,
  InputLabel,
  Button,
  InputAdornment
} from "@mui/material";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import './styles.scss';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import { useOutletContext } from "react-router-dom";
import Switch from '@mui/material/Switch';
import StarIcon from '@mui/icons-material/Star';
import ReplayIcon from '@mui/icons-material/Replay';
import { statuses } from "../../../lib/constants";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Folder, LocalOffer } from "@mui/icons-material";

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
    filterFolder,
    setSortBy,
    sortBy,
    filterName,
    filterAssignedTo,
    filterTags
  } = props;

  const {
    tags,
    engagementAdmins,
    engagementMembers,
    folders
  } = useOutletContext();

  const handleResetFilters = () => {
    setFilterName('');
    setFilterTags([]);
    setFilterAssignedTo(null);
    setFilterFolder(null);
    setFilterStatus('all');
    setFilterKeyTasks(false);
    setSortBy('name');
  };

  return (
    <Grid item xs={12}>
      <Paper style={{ padding: '8px' }}>
        <Accordion
          className="tasks-filter-accordion"
          disableGutters>
          <AccordionSummary
            className="accordion-summary" expandIcon={<ExpandMoreIcon />}>
            <Typography className="flex-ac" style={{ marginRight: '0.5rem' }} variant="body1">
              <FilterAltIcon htmlColor="#cbced4" />
              Filters
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container rowSpacing={2} columnSpacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  size="small"
                  label='Task Name'
                  value={filterName}
                  onChange={e => setFilterName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={8}></Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <Autocomplete
                    size="small"
                    renderOption={(props, option) => <li {...props} key={option.id}>{option.firstName} {option.lastName}</li>}
                    options={[...engagementAdmins, ...engagementMembers]}
                    getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    groupBy={(option) => option.role}
                    onChange={(_, newVal) => setFilterAssignedTo(newVal)}
                    value={filterAssignedTo}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Assigned To"
                        InputProps={{
                          ...params.InputProps,
                          startAdornment:
                            <InputAdornment position='start'>
                              <AccountCircleIcon />
                            </InputAdornment>
                        }}
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
                    renderOption={(props, option) => <li {...props} key={option.id}>{option.name}</li>}
                    isOptionEqualToValue={(option, value) => option.name === value.name}
                    getOptionLabel={(option) => option.name}
                    filterSelectedOptions
                    disableCloseOnSelect
                    size="small"
                    onChange={(_, newVal) => setFilterTags(newVal)}
                    value={filterTags}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Tags"
                        InputProps={{
                          ...params.InputProps,
                          startAdornment:
                            <InputAdornment position='start'>
                              <LocalOffer />
                            </InputAdornment>
                        }}
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
                    value={filterFolder}
                    renderOption={(props, option) => <li {...props} key={option.id}>{option.name}</li>}
                    getOptionLabel={(option) => option.name || ''}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    onChange={(_, newVal) => setFilterFolder(newVal)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Folder"
                        InputProps={{
                          ...params.InputProps,
                          startAdornment:
                            <InputAdornment position='start'>
                              <Folder />
                            </InputAdornment>
                        }}
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
                      statuses.map(({ name }) =>
                        <MenuItem
                          key={name}
                          value={name}>
                          {name}
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
              <Grid item xs={12}>
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
              <Grid item xs mt={1}>
                <Button
                  onClick={handleResetFilters}
                  startIcon={<ReplayIcon />}
                  variant="contained">
                  Reset
                </Button>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Paper>
    </Grid>

  );
};
