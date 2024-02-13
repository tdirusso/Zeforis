import Chart from "react-apexcharts";
import moment from 'moment';
import { useOutletContext } from "react-router-dom";
import { useEffect } from "react";
import apexchart, { ApexOptions } from "apexcharts";
import { AppContext } from "src/types/AppContext";

const _2weekFromNowStart = moment().add(2, 'weeks').startOf('week');
const _3weekFromNowStart = moment().add(3, 'weeks').startOf('week');
const _4weekFromNowStart = moment().add(4, 'weeks').startOf('week');
const _5weekFromNowStart = moment().add(5, 'weeks').startOf('week');

type UpcomingBreakdownChartProps = {
  statusColors: string[],
  statusCount: {
    [key: string]: {
      dueThisWeek: number,
      due1Week: number,
      due2Week: number,
      due3Week: number,
      due4Week: number,
      due5Week: number;
    };
  },
  theme: string;
};

export default function UpcomingBreakdownChart(props: UpcomingBreakdownChartProps) {

  const {
    org
  } = useOutletContext<AppContext>();

  const {
    statusColors,
    statusCount,
    theme
  } = props;

  const options: ApexOptions = {
    plotOptions: {
      bar: {
        borderRadius: 7,
        horizontal: true,
        dataLabels: {
          total: {
            enabled: true,
            offsetX: 0,
            style: {
              fontWeight: 400
            }
          },
        }
      }
    },
    chart: {
      stacked: true,
      fontFamily: 'Inter',
      toolbar: {
        show: false
      },
      id: 'upcoming-breakdown'
    },
    legend: {
      position: 'top'
    },
    xaxis: {
      categories: [
        `This week`,
        `Next week`,
        `Wk. of ${_2weekFromNowStart.format('MM/DD')}`,
        `Wk. of ${_3weekFromNowStart.format('MM/DD')}`,
        `Wk. of ${_4weekFromNowStart.format('MM/DD')}`,
        `Wk. of ${_5weekFromNowStart.format('MM/DD')}`
      ]
    },
    series: [],
    colors: [],
    fill: {
      opacity: 0.9
    },
    noData: {
      text: "Loading...",
      align: 'center',
      verticalAlign: 'middle',
      offsetX: 0,
      offsetY: 0,
      style: {
        color: "#000000",
        fontSize: '14px',
        fontFamily: "Inter"
      }
    },
    theme: {
      mode: theme === 'dark' ? 'dark' : 'light'
    }
  };

  options.colors = [org.brandColor];

  useEffect(() => {
    if (statusColors && statusCount) {
      apexchart.exec('upcoming-breakdown', 'updateOptions', {
        labels: Object.keys(statusCount),
        colors: statusColors,
        series: Object.keys(statusCount).map(status => {
          const statusObj = statusCount[status];
          return {
            name: status,
            data: [
              statusObj.dueThisWeek,
              statusObj.due1Week,
              statusObj.due2Week,
              statusObj.due3Week,
              statusObj.due4Week,
              statusObj.due5Week
            ]
          };
        })
      }, true);
    }
  }, [props]);

  return (
    <Chart
      options={options}
      series={options.series}
      type="bar"
      height={'100%'}
    />
  );
};
