import Chart from "react-apexcharts";
import { useEffect } from "react";
import apexchart, { ApexOptions } from "apexcharts";
import '../styles/analytics.scss';

type StatusBreakdownChartProps = {
  statusColors: string[],
  statusCount: {
    [key: string]: {
      total: number;
    };
  },
  theme: string;
};

export default function StatusBreakdownChart(props: StatusBreakdownChartProps) {

  const {
    statusColors,
    statusCount,
    theme
  } = props;

  const options: ApexOptions = {
    series: [
      {
        data: []
      }
    ],
    labels: [],
    fill: {
      opacity: 0.9
    },
    chart: {
      fontFamily: 'Inter',
      id: 'status-breakdown'
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
    responsive: [{
      breakpoint: 500,
      options: {
        legend: {
          position: 'bottom'
        }
      }
    }],
    theme: {
      mode: theme === 'dark' ? 'dark' : 'light'
    }
  };

  useEffect(() => {
    if (statusColors && statusCount) {
      apexchart.exec('status-breakdown', 'updateOptions', {
        labels: Object.keys(statusCount),
        colors: statusColors,
        series: Object.keys(statusCount).map(status => statusCount[status].total)
      }, true);
    }
  }, [props]);

  return (
    <Chart
      className='status-pie-chart'
      options={options}
      series={options.series}
      type="pie"
      height={'100%'}>
    </Chart>
  );
};
