import { Box, Grid, Paper } from "@mui/material";
import Chart from "react-apexcharts";
import { useOutletContext } from "react-router-dom";
import moment from 'moment';
import { statuses } from "../../lib/constants";

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
    org
  } = useOutletContext();

  let count5 = 5;
  let count4 = 10;
  let count3 = 3;
  let count2 = 20;
  let count1 = 14;
  let countThis = 2;

  const statusCount = {};
  statuses.forEach(({ name }) => statusCount[name] = 0);

  tasks.forEach(task => {
    statusCount[task.status]++;
    if (task.status === 'Complete' && task.date_completed) {
      const dateCompleted = moment(task.date_completed);

      if (dateCompleted.isBetween(_5weeksAgoStart, _5weeksAgoEnd)) {
        count5++;
      } else if (dateCompleted.isBetween(_4weeksAgoStart, _4weeksAgoEnd)) {
        count4++;
      } else if (dateCompleted.isBetween(_3weeksAgoStart, _3weeksAgoEnd)) {
        count3++;
      } else if (dateCompleted.isBetween(_2weeksAgoStart, _2weeksAgoEnd)) {
        count2++;
      } else if (dateCompleted.isBetween(_1weeksAgoStart, _1weeksAgoEnd)) {
        count1++;
      } else if (dateCompleted.isBetween(_thisWeekStart, _thisWeekEnd)) {
        countThis++;
      }
    }
  });

  const barOptions = {
    series: [
      {
        name: 'Tasks completed',
        data: [count5, count4, count3, count2, count1, countThis]
      }
    ],
    xaxis: {
      categories: [
        `Wk. of ${_5weeksAgoStart.format('MM/DD')}`,
        `Wk. of ${_4weeksAgoStart.format('MM/DD')}`,
        `Wk. of ${_3weeksAgoStart.format('MM/DD')}`,
        `Wk. of ${_2weeksAgoStart.format('MM/DD')}`,
        `Last week`,
        `This week`,
      ]
    },
    yaxis: {
      show: false
    },
    chart: {
      fontFamily: 'Inter',
      animations: {

      },
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        borderRadius: 8,
        borderRadiusApplication: 'end',
        dataLabels: {
          position: 'top'
        }
      },
    },
    grid: {
      show: false
    },
    tooltip: {
      enabled: false
    },
    colors: org.brandColor,
    fill: {
      opacity: 0.9
    }
  };

  const pieOptions = {
    labels: Object.keys(statusCount),
    colors: statuses.map(({ color }) => color),
    fill: {
      opacity: 0.9
    },
    chart: {
      fontFamily: 'Inter'
    },
    plotOptions: {
      pie: {
        expandOnClick: false,
        dataLabels: {
          offset: -10
        }
      }
    },
    stroke: {
      show: false
    }
  };

  const stackedBarOptions = {
    plotOptions: {
      bar: {
        horizontal: true,
        dataLabels: {
          total: {
            enabled: true,
            offsetX: 0, 
            style: {
              fontWeight: 400
            }
          },
          position: 'center'
        }
      }
    },
    chart: {
      stacked: true,
      fontFamily: 'Inter'
    }
  };

  return (
    <>
      <Grid item xs={6}>
        <Paper>
          <Box
            component="h4"
            mb={2}>
            Tasks Completed
          </Box>
          <Chart
            options={barOptions}
            series={barOptions.series}
            type="bar"
            height={'100%'}
          >
          </Chart>
        </Paper>
      </Grid>
      <Grid item xs={6}>
        <Paper>
          <Box
            component="h4"
            mb={2} >
            Overall Status Breakdown
          </Box>
          <Chart
            options={pieOptions}
            series={Object.keys(statusCount).map(status => statusCount[status])}
            type="pie"
            height={'100%'}>
          </Chart>
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Paper>
          <Box
            component="h4"
            mb={2}>
            Upcoming Tasks Breakdown by Status
          </Box>
          <Chart
            options={stackedBarOptions}
            series={barOptions.series}
            type="bar">
          </Chart>
        </Paper>
      </Grid>
    </>
  );
};
