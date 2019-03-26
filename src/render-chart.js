import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';


export default (canvas, data) => new Chart(canvas, {
  plugins: [ChartDataLabels],
  type: `horizontalBar`,
  data: {
    labels: data.map((item) => item[0]),
    datasets: [{
      data: data.map((item) => item[1]),
      backgroundColor: `#ffe800`,
      hoverBackgroundColor: `#ffe800`,
      anchor: `start`
    }]
  },
  options: {
    plugins: {
      datalabels: {
        font: {
          size: 20
        },
        color: `#ffffff`,
        anchor: `start`,
        align: `start`,
        offset: 40,
      }
    },
    scales: {
      yAxes: [{
        ticks: {
          fontColor: `#ffffff`,
          padding: 100,
          fontSize: 20
        },
        gridLines: {
          display: false,
          drawBorder: false
        },
        barThickness: 24
      }],
      xAxes: [{
        ticks: {
          display: false,
          beginAtZero: true
        },
        gridLines: {
          display: false,
          drawBorder: false
        }
      }],
    },
    legend: {
      display: false
    },
    tooltips: {
      enabled: false
    }
  }
});
