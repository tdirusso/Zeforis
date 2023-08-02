/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Grid, Paper } from "@mui/material";
import { useOutletContext } from "react-router-dom";
import moment from 'moment';
import { statuses } from "../../../lib/constants";
import { useEffect, useState } from "react";
import TasksCompletedChart from "../../../components/core/analytics/TasksCompletedChart";
import StatusBreakdownChart from "../../../components/core/analytics/StatusBreakdownChart";
import UpcomingBreakdownChart from "../../../components/core/analytics/UpcomingBreakdownChart";

const statusColors = statuses.map(({ color }) => color);

const _5weeksAgoStart = moment().subtract(5, 'weeks').startOf('week');
const _4weeksAgoStart = moment().subtract(4, 'weeks').startOf('week');
const _3weeksAgoStart = moment().subtract(3, 'weeks').startOf('week');
const _2weeksAgoStart = moment().subtract(2, 'weeks').startOf('week');
const _1weeksAgoStart = moment().subtract(1, 'weeks').startOf('week');
const _thisWeekStart = moment().startOf('week');

const _5weeksAgoEnd = moment().subtract(5, 'weeks').endOf('week');
const _4weeksAgoEnd = moment().subtract(4, 'weeks').endOf('week');
const _3weeksAgoEnd = moment().subtract(3, 'weeks').endOf('week');
const _2weeksAgoEnd = moment().subtract(2, 'weeks').endOf('week');
const _1weeksAgoEnd = moment().subtract(1, 'weeks').endOf('week');
const _thisWeekEnd = moment().endOf('week');

const _1weekFromNowStart = moment().add(1, 'weeks').startOf('week');
const _2weekFromNowStart = moment().add(2, 'weeks').startOf('week');
const _3weekFromNowStart = moment().add(3, 'weeks').startOf('week');
const _4weekFromNowStart = moment().add(4, 'weeks').startOf('week');
const _5weekFromNowStart = moment().add(5, 'weeks').startOf('week');

const _1weekFromNowEnd = moment().add(1, 'weeks').endOf('week');
const _2weekFromNowEnd = moment().add(2, 'weeks').endOf('week');
const _3weekFromNowEnd = moment().add(3, 'weeks').endOf('week');
const _4weekFromNowEnd = moment().add(4, 'weeks').endOf('week');
const _5weekFromNowEnd = moment().add(5, 'weeks').endOf('week');

export default function AnalyticsPage() {
  const {
    tasks,
  } = useOutletContext();

  const [analyticsData, setAnalyticsData] = useState({});

  let completed5WeeksAgo = 0;
  let completed4WeeksAgo = 0;
  let completed3WeeksAgo = 0;
  let completed2WeeksAgo = 0;
  let completed1WeeksAgo = 0;
  let completedThisWeek = 0;
  const statusCount = {};

  useEffect(() => {
    statuses.forEach(({ name }) => {
      statusCount[name] = {
        total: 0,
        dueThisWeek: 0,
        due1Week: 0,
        due2Week: 0,
        due3Week: 0,
        due4Week: 0,
        due5Week: 0,
      };
    });

    tasks.forEach(task => {
      statusCount[task.status].total++;
      if (task.status === 'Complete' && task.date_completed) {
        const dateCompleted = moment(task.date_completed);

        if (dateCompleted.isBetween(_5weeksAgoStart, _5weeksAgoEnd)) {
          completed5WeeksAgo++;
        } else if (dateCompleted.isBetween(_4weeksAgoStart, _4weeksAgoEnd)) {
          completed4WeeksAgo++;
        } else if (dateCompleted.isBetween(_3weeksAgoStart, _3weeksAgoEnd)) {
          completed3WeeksAgo++;
        } else if (dateCompleted.isBetween(_2weeksAgoStart, _2weeksAgoEnd)) {
          completed2WeeksAgo++;
        } else if (dateCompleted.isBetween(_1weeksAgoStart, _1weeksAgoEnd)) {
          completed1WeeksAgo++;
        } else if (dateCompleted.isBetween(_thisWeekStart, _thisWeekEnd)) {
          completedThisWeek++;
        }
      }

      if (task.date_due) {
        const dateDue = moment(task.date_due);
        if (dateDue.isBetween(_thisWeekStart, _thisWeekEnd)) {
          statusCount[task.status].dueThisWeek++;
        } else if (dateDue.isBetween(_1weekFromNowStart, _1weekFromNowEnd)) {
          statusCount[task.status].due1Week++;
        } else if (dateDue.isBetween(_2weekFromNowStart, _2weekFromNowEnd)) {
          statusCount[task.status].due2Week++;
        } else if (dateDue.isBetween(_3weekFromNowStart, _3weekFromNowEnd)) {
          statusCount[task.status].due3Week++;
        } else if (dateDue.isBetween(_4weekFromNowStart, _4weekFromNowEnd)) {
          statusCount[task.status].due4Week++;
        } else if (dateDue.isBetween(_5weekFromNowStart, _5weekFromNowEnd)) {
          statusCount[task.status].due5Week++;
        }
      }
    });

    setAnalyticsData({
      completed5WeeksAgo,
      completed4WeeksAgo,
      completed3WeeksAgo,
      completed2WeeksAgo,
      completed1WeeksAgo,
      completedThisWeek,
      statusCount
    });
  }, []);

  return (
    <>
      <AnalyticsCharts
        analyticsData={analyticsData}
      />
    </>
  );
};

function AnalyticsCharts(props) {

  const {
    analyticsData: {
      completed5WeeksAgo = 0,
      completed4WeeksAgo = 0,
      completed3WeeksAgo = 0,
      completed2WeeksAgo = 0,
      completed1WeeksAgo = 0,
      completedThisWeek = 0,
      statusCount
    }
  } = props;

  return (
    <>
      <Grid item xs={6}>
        <Paper>
          <Box
            component="h4"
            mb={2}>
            Tasks Completed
          </Box>
          <TasksCompletedChart
            series={[
              completed5WeeksAgo,
              completed4WeeksAgo,
              completed3WeeksAgo,
              completed2WeeksAgo,
              completed1WeeksAgo,
              completedThisWeek
            ]}
          />
        </Paper>
      </Grid>
      <Grid item xs={6}>
        <Paper>
          <Box
            component="h4"
            mb={2} >
            Task Status Breakdown
          </Box>
          <StatusBreakdownChart
            statusCount={statusCount}
            statusColors={statusColors}
          />
        </Paper>
      </Grid>

      <Grid item xs={12}>
        <Paper sx={{ maxHeight: '700px', minHeight: '450px' }}>
          <Box
            component="h4"
            mb={2}>
            Upcoming Tasks Breakdown by Status
          </Box>
          <UpcomingBreakdownChart
            statusCount={statusCount}
            statusColors={statusColors}
          />
        </Paper>
      </Grid>
    </>
  );
}