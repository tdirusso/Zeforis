/* eslint-disable react-hooks/exhaustive-deps */
import Chart from "react-apexcharts";
import moment from 'moment';
import { useOutletContext } from "react-router-dom";
import { useEffect } from "react";
import apexchart from "apexcharts";

const _2weekFromNowStart = moment().add(2, 'weeks').startOf('week');
const _3weekFromNowStart = moment().add(3, 'weeks').startOf('week');
const _4weekFromNowStart = moment().add(4, 'weeks').startOf('week');
const _5weekFromNowStart = moment().add(5, 'weeks').startOf('week');

export default function UpcomingBreakdownChart(props) {

  const {
    org
  } = useOutletContext();

  const {
    statusColors,
    statusCount,
    theme
  } = props;

  const options = {
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
      mode: theme
    }
  };

  options.colors = org.brandColor;

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
