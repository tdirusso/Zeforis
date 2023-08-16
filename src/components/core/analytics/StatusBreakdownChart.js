import Chart from "react-apexcharts";
import { useEffect } from "react";
import apexchart from "apexcharts";

const options = {
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
  }]
};

export default function StatusBreakdownChart(props) {

  useEffect(() => {
    const {
      statusColors,
      statusCount
    } = props;

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
      options={options}
      series={options.series}
      type="pie"
      height={'100%'}>
    </Chart>
  );
};
