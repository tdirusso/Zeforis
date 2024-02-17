import { Box, Divider, FormHelperText, Grid, Paper, TextField, Typography, Chip, Button } from "@mui/material";
import { useRef, useState } from "react";
import { LoadingButton } from "@mui/lab";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers';
import moment, { Moment } from "moment";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { statuses } from "../../../lib/constants";
import { useOutletContext } from "react-router-dom";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { AppContext } from "src/types/AppContext";
import { Task } from "@shared/types/Task";

const statusesArray = statuses.map(({ name }) => name);

type MainTaskCondition =
  | ((taskDateDue: string | null) => boolean) // For 'date-due' case
  | ((_: string | null, taskDateUpdated: string | null) => boolean) // For 'date-updated' case
  | ((taskDateDue: string | null, taskDateUpdated: string) => boolean);

type ReportData = {
  statusToTaskMap: {
    [key: string]: Task[];
  },
  start: Moment,
  end: Moment,
  displayDescription?: boolean;
};

export default function ReportGeneratorTab() {

  const [isLoading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState('this-week');
  const [taskCriteria, setTaskCriteria] = useState('date-due');
  const [dateRangeStart, setDateRangeStart] = useState<Moment | null>(moment());
  const [dateRangeEnd, setDateRangeEnd] = useState<Moment | null>(moment().add(7, 'days'));
  const [dateMinRangeEnd, setDateMinRangeEnd] = useState<Moment | null>(moment().add(1, 'days'));
  const [includeStatuses, setIncludeStatuses] = useState(statusesArray);
  const [includeDescriptions, setIncludeDescriptions] = useState(true);
  const [reportData, setReportData] = useState<ReportData>({
    statusToTaskMap: {},
    start: moment(),
    end: moment().add(7, 'days'),
  });
  const [isComplete, setComplete] = useState(false);

  const {
    openSnackBar,
    tasks
  } = useOutletContext<AppContext>();

  const generateReport = () => {
    let momentRangeStart: Moment;
    let momentRangeEnd: Moment;

    if (dateRange === 'custom') {
      momentRangeStart = moment(dateRangeStart);
      momentRangeEnd = moment(dateRangeEnd);
    } else if (dateRange === 'last-week') {
      momentRangeStart = moment().subtract(1, 'weeks').startOf('week');
      momentRangeEnd = moment().subtract(1, 'weeks').endOf('week');
    } else {
      momentRangeStart = moment().startOf('week');
      momentRangeEnd = moment().endOf('week');
    }

    if (momentRangeEnd.isBefore(momentRangeStart)) {
      openSnackBar('Date Range - "End" date cannot be before "Start" date.');
      return;
    }

    if (includeStatuses.length === 0) {
      openSnackBar('Choose at least 1 status to include in the report.');
      return;
    }

    setLoading(true);

    let mainTaskCondition: MainTaskCondition;

    switch (taskCriteria) {
      case 'date-due':
        mainTaskCondition = (taskDateDue: string | null) =>
          Boolean(taskDateDue && moment(taskDateDue).isBetween(momentRangeStart, momentRangeEnd));
        break;
      case 'date-updated':
        mainTaskCondition = (_: string | null, taskDateUpdated: string) =>
          Boolean(taskDateUpdated && moment(taskDateUpdated).isBetween(momentRangeStart, momentRangeEnd));
        break;
      case 'both':
        mainTaskCondition = (taskDateDue: string | null, taskDateUpdated: string) =>
          Boolean((taskDateDue && moment(taskDateDue).isBetween(momentRangeStart, momentRangeEnd)) ||
            (taskDateUpdated && moment(taskDateUpdated).isBetween(momentRangeStart, momentRangeEnd)));
        break;
      default:
        break;
    }

    const statusToTaskMap: { [key: string]: Task[]; } = {};

    const filteredStatuses = statuses.filter(({ name }) => includeStatuses.includes(name)).reverse();

    filteredStatuses.forEach(({ name }) => {
      statusToTaskMap[name] = [];
    });

    tasks.forEach(task => {
      if (mainTaskCondition(task.date_due, task.date_last_updated) && includeStatuses.includes(task.status)) {
        statusToTaskMap[task.status].push(task);
      }
    });

    setTimeout(() => {
      setReportData({
        statusToTaskMap,
        start: momentRangeStart,
        end: momentRangeEnd,
        displayDescription: includeDescriptions
      });
      setComplete(true);
      setLoading(false);
    }, 1000);
  };

  const handleDateRangeStartChange = (momentEvent: Moment | null) => {
    if (momentEvent?.isValid()) {
      setDateMinRangeEnd(moment(momentEvent).add(1, 'days'));
    }
    setDateRangeStart(momentEvent);
  };

  return (
    isComplete ?
      <ReportDataPage
        setComplete={setComplete}
        reportData={reportData}
      />
      :
      <Grid item xs={12} className="report-generator">
        <Paper>
          <Typography variant="body2">
            The Report Generator is a powerful tool that allows you to effortlessly customize and generate reports for efficient customer communications.
            You can define date ranges and choose relevant fields to curate a report that provides valuable task insights to your engagement.
            <br></br><br></br>
            Our generator includes seamless integration with
            your organization's brand, ensuring consistent and professional representation to your engagements.
            <br></br><br></br>
            After generating the report, it will be displayed below in-line where it can then be copied into emails and other documents.
          </Typography>
          <Divider className="my4" />
          <Box component='h4'>Date Range</Box>
          <Box my={2} mt={1} display='flex' alignItems='center'>
            <FormControl style={{ marginRight: '25px' }}>
              <RadioGroup
                defaultValue="this-week"
                value={dateRange}
                onChange={e => setDateRange(e.target.value)}>
                <FormControlLabel disabled={isLoading} value="this-week" control={<Radio />} label="This week" />
                <FormControlLabel disabled={isLoading} value="last-week" control={<Radio />} label="Last week" />
                <FormControlLabel disabled={isLoading} value="custom" control={<Radio />} label="Custom" />
              </RadioGroup>
            </FormControl>
            <Box display={dateRange === 'custom' ? 'flex' : 'none'}>
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <DatePicker
                  disabled={isLoading}
                  inputFormat="MM/DD/YYYY"
                  value={dateRangeStart}
                  onChange={handleDateRangeStartChange}
                  renderInput={(params) => <TextField
                    {...params}
                    style={{ marginRight: '1rem' }}
                    label='From'
                  />}
                ></DatePicker>
                <DatePicker
                  disabled={isLoading}
                  inputFormat="MM/DD/YYYY"
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
            <FormControl>
              <RadioGroup
                value={taskCriteria}
                onChange={e => setTaskCriteria(e.target.value)}>
                <FormControlLabel
                  disabled={isLoading}
                  value="date-due"
                  control={<Radio />}
                  label="Date due"
                />
                <FormHelperText className="m0">
                  The report will only include tasks that have a due date assigned within the selected time range.
                </FormHelperText>
                <FormControlLabel
                  disabled={isLoading}
                  value="date-updated"
                  control={<Radio />}
                  label="Date updated"
                />
                <FormHelperText className="m0">
                  The report will only include tasks that have been updated within the selected time range, regardless of the due date.
                </FormHelperText>
                <FormControlLabel
                  value="both"
                  disabled={isLoading}
                  control={<Radio />}
                  label="Both"
                />
                <FormHelperText className="m0">
                  The report will include tasks that have been updated within the selected time range, regardless of the due date, as well as tasks that have a due date within the selected time range.
                </FormHelperText>
              </RadioGroup>
            </FormControl>
          </Box>
          <Box component='h4' mt={4}>Status Criteria</Box>
          <Box my={2} mt={3}>
            <FormControl className="status-criteria">
              <InputLabel id="to-label">Choose statuses</InputLabel>
              <Select
                renderValue={(selected) => (
                  <Box className="flex wrap" style={{ gap: 6 }}>
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
                label="Choose statuses"
                labelId="to-label"
                multiple
                onChange={e => {
                  if (typeof e.target.value === 'string') {
                    setIncludeStatuses([e.target.value]);
                  } else {
                    setIncludeStatuses(e.target.value);
                  }
                }}
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
                        style={{ cursor: 'pointer' }}
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
              style={{ width: '100%', height: '50px' }}
              size="large"
              onClick={generateReport}
              loading={isLoading}
              variant="contained">
              Generate Report
            </LoadingButton>
          </Box>
        </Paper>
      </Grid>
  );
};

type ReportDataPageProps = {
  reportData: ReportData,
  setComplete: React.Dispatch<React.SetStateAction<boolean>>;
};

function ReportDataPage(props: ReportDataPageProps) {
  const {
    setComplete,
    reportData: {
      statusToTaskMap,
      start,
      end,
      displayDescription
    }
  } = props;

  const reportContainer = useRef<HTMLDivElement>(null);
  const [copyButtonText, setCopyButtonText] = useState('Copy Report');

  const {
    org,
    engagement
  } = useOutletContext<AppContext>();

  const copyReport = async () => {
    if (reportContainer.current) {
      await window.navigator.clipboard.write([
        new ClipboardItem({
          'text/html': new Blob([reportContainer.current.innerHTML], { type: 'text/html' }),
          'text/plain': new Blob([reportContainer.current.innerHTML], { type: 'text/plain' })
        })
      ]);
      setCopyButtonText('Copied!');
      setTimeout(() => {
        setCopyButtonText('Copy Report');
      }, 750);
    }
  };

  return (
    <Grid item xs={12}>
      <Paper>
        <Box mb={2}>
          <Button
            size="large"
            variant="contained"
            onClick={() => setComplete(false)}>
            New Report
          </Button>
        </Box>
        <Button
          variant="outlined"
          size="large"
          startIcon={<ContentCopyIcon />}
          onClick={copyReport}>
          {copyButtonText}
        </Button>
        <Divider className="my4" />
        <Box ref={reportContainer}>
          <img src={org.logo} alt="" width={200} />
          <Box component="h2">{engagement.name} Update</Box>
          <Box component="h4" mt={1}>
            {start.format('MM/DD/YYYY')} &ndash; {end.format('MM/DD/YYYY')}
          </Box>
          <Box mt={5}>
            {
              Object.keys(statusToTaskMap).map(status => {
                if (statusToTaskMap[status].length > 0) {
                  return (
                    <Box key={status} my={3}>
                      <Box><strong>{status}</strong></Box>
                      <ul>
                        {
                          statusToTaskMap[status].map(task => {
                            return (
                              <li key={task.task_id}>
                                {
                                  task.link_url ?
                                    <a
                                      rel="noreferrer"
                                      href={task.link_url}
                                      target="_blank">{task.task_name}</a> :
                                    task.task_name
                                }
                                {
                                  displayDescription && task.description ?
                                    <ul style={{ listStyle: 'none' }}>
                                      <li>
                                        {task.description}
                                      </li>
                                    </ul> :
                                    null
                                }
                              </li>
                            );
                          })
                        }
                      </ul>
                    </Box>
                  );
                }
                return null;
              })
            }
          </Box>
        </Box>
      </Paper>
    </Grid>
  );
}