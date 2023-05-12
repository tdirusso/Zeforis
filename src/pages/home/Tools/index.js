import { Box, Divider, FormHelperText, Grid, Paper, Tab, Tabs, TextField, Typography, Chip } from "@mui/material";
import { useState } from "react";
import RestorePageIcon from '@mui/icons-material/RestorePage';
import WidgetsIcon from '@mui/icons-material/Widgets';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import { LoadingButton } from "@mui/lab";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers';
import moment from "moment";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { statuses } from "../../../lib/constants";

const statusesArray = statuses.map(({ name }) => name);

export default function ToolsPage() {

  const [tabVal, setTabVal] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState('this-week');
  const [taskCriteria, setTaskCriteria] = useState('date-due');
  const [dateRangeStart, setDateRangeStart] = useState(null);
  const [dateRangeEnd, setDateRangeEnd] = useState(null);
  const [dateMinRangeEnd, setDateMinRangeEnd] = useState(null);
  const [includeStatuses, setIncludeStatuses] = useState(statusesArray);
  const [includeDescriptions, setIncludeDescriptions] = useState(true);

  const generateReport = () => {
    setLoading(true);
  };

  const handleDateRangeStartChange = momentEvent => {
    if (momentEvent?._isValid) {
      setDateMinRangeEnd(moment(momentEvent).add(1, 'days'));
    }
    setDateRangeStart(momentEvent);
  };

  return (
    <>
      <Grid item xs={12}>
        <Tabs value={tabVal} onChange={(_, val) => setTabVal(val)} variant="fullWidth">
          <Tab label="Report Generator" icon={<RestorePageIcon />} iconPosition="start" />
          <Tab label="Widgets" icon={<WidgetsIcon />} iconPosition="start" />
          <Tab label="Import" icon={<DownloadIcon />} iconPosition="start" />
          <Tab label="Export" icon={<UploadIcon />} iconPosition="start" />
        </Tabs>
      </Grid>
      <Grid item xs={12}>
        <Paper>
          <Typography variant="body2">
            The Report Generator is a powerful tool allows you to effortlessly customize and generate reports for efficient client communications.
            You can define date ranges and select relevant fields to curate a report that provides valuable insights to your client.
            <br></br><br></br>
            Our generator includes seamless integration with
            your organization's brand, ensuring consistent and professional representation to your clients.
            <br></br><br></br>
            After generating the report, a downloadable PDF will be created as well as inline text that can be copied into emails and other documents.
          </Typography>
          <Divider sx={{ my: 4 }} />
          <Box component='h4'>Date Range</Box>
          <Box my={2} mt={1} display='flex' alignItems='center'>
            <FormControl sx={{ mr: 3 }}>
              <RadioGroup
                defaultValue="this-week"
                value={dateRange}
                onChange={e => setDateRange(e.target.value)}
              >
                <FormControlLabel disabled={isLoading} value="this-week" control={<Radio />} label="This week" />
                <FormControlLabel disabled={isLoading} value="last-week" control={<Radio />} label="Last week" />
                <FormControlLabel disabled={isLoading} value="custom" control={<Radio />} label="Custom" />
              </RadioGroup>
            </FormControl>
            <Box display={dateRange === 'custom' ? 'flex' : 'none'}>
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <DatePicker
                  disabled={isLoading}
                  format="MM/DD/YYYY"
                  value={dateRangeStart}
                  onChange={handleDateRangeStartChange}
                  renderInput={(params) => <TextField
                    {...params}
                    sx={{ mr: 2 }}
                    label='From'
                  />}
                ></DatePicker>
                <DatePicker
                  disabled={isLoading}
                  format="MM/DD/YYYY"
                  value={dateRangeEnd}
                  minDate={dateMinRangeEnd}
                  onChange={value => setDateRangeEnd(value)}
                  renderInput={(params) => <TextField
                    {...params}
                    label='To'
                  />}
                ></DatePicker>
              </LocalizationProvider>
            </Box>
          </Box>

          <Box component='h4' mt={4}>Task Criteria</Box>
          <Box my={2} mt={1}>
            <FormControl sx={{ mr: 3 }}>
              <RadioGroup
                value={taskCriteria}
                onChange={e => setTaskCriteria(e.target.value)}>
                <FormControlLabel
                  disabled={isLoading}
                  value="date-due"
                  control={<Radio />}
                  label="Date due"
                />
                <FormHelperText sx={{ m: 0 }}>
                  The report will only include tasks that have a due date assigned within the selected time range.
                </FormHelperText>
                <FormControlLabel
                  disabled={isLoading}
                  value="date-updated"
                  control={<Radio />}
                  label="Date updated"
                />
                <FormHelperText sx={{ m: 0 }}>
                  The report will only include tasks that have been updated within the selected time range, regardless of the due date.
                </FormHelperText>
                <FormControlLabel
                  value="both"
                  disabled={isLoading}
                  control={<Radio />}
                  label="Both"
                />
                <FormHelperText sx={{ m: 0 }}>
                  The report will include tasks that have been updated within the selected time range, regardless of the due date, as well as tasks that have a due date within the selected time range.
                </FormHelperText>
              </RadioGroup>
            </FormControl>
          </Box>
          <Box component='h4' mt={4}>Status Criteria</Box>
          <Box my={2} mt={3}>
            <FormControl sx={{ width: 500 }}>
              <InputLabel id="to-label">Select statuses</InputLabel>
              <Select
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip
                        className={value}
                        key={value}
                        label={value}
                      />
                    ))}
                  </Box>
                )}
                value={includeStatuses}
                label="Select statuses"
                labelId="to-label"
                multiple
                onChange={e => setIncludeStatuses(e.target.value)}
                disabled={isLoading}>
                {
                  statuses.map(({ name }) =>
                    <MenuItem
                      value={name}
                      key={name}>
                      <Checkbox checked={includeStatuses.indexOf(name) > -1} />
                      <Chip
                        label={name}
                        className={name}
                        sx={{ cursor: 'pointer' }}
                      />
                    </MenuItem>
                  )}
              </Select>
            </FormControl>
          </Box>

          <Box component='h4' mt={4}>Options</Box>
          <Box my={2} mt={0.5}>
            <FormControlLabel
              control={<Checkbox
                disabled={isLoading}
                onChange={(_, val) => setIncludeDescriptions(val)}
                checked={includeDescriptions}
              />}
              label="Include task descriptions"
            />
          </Box>

          <Box mt={5} width={'100%'}>
            <LoadingButton
            sx={{width: '100%',height: '50px'}}
              size="large"
              onClick={generateReport}
              loading={isLoading}
              variant="contained">
              Generate Report
            </LoadingButton>
          </Box>
        </Paper>
      </Grid >
    </>
  );
};
