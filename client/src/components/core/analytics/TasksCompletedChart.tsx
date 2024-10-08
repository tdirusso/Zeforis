import Chart from "react-apexcharts";
import moment from 'moment';
import { useOutletContext } from "react-router-dom";
import { useEffect } from "react";
import apexchart, { ApexOptions } from "apexcharts";
import { AppContext } from "src/types/AppContext";

const _5weeksAgoStart = moment().subtract(5, 'weeks').startOf('week');
const _4weeksAgoStart = moment().subtract(4, 'weeks').startOf('week');
const _3weeksAgoStart = moment().subtract(3, 'weeks').startOf('week');
const _2weeksAgoStart = moment().subtract(2, 'weeks').startOf('week');

type TasksCompletedChartProps = {
  theme: string,
  series: number[];
};

export default function TasksCompletedChart({ series, theme }: TasksCompletedChartProps) {

  const {
    org
  } = useOutletContext<AppContext>();


  const options: ApexOptions = {
    series: [
      {
        name: 'Tasks completed',
        data: []
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
      id: 'tasks-completed',
      toolbar: {
        show: false
      }
    },
    grid: {
      show: false
    },
    tooltip: {
      enabled: false
    },
    fill: {
      opacity: 0.85
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
    },
    plotOptions: {
      bar: {
        borderRadius: 8,
        borderRadiusApplication: 'end',
        dataLabels: {
          position: 'top'
        }
      }
    },
    dataLabels: {
      enabled: true,
      offsetY: -25,
      style: {
        colors: ['#121f43'],
        fontWeight: 300
      }
    }
  };

  options.colors = [org.brandColor];

  useEffect(() => {
    apexchart.exec('tasks-completed', 'updateSeries', [{ data: series }]);
  }, [series]);

  return (
    <Chart
      options={options}
      series={options.series}
      type="bar"
      height={'100%'}
    />
  );
};
