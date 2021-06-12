<script>
import { Bar } from 'vue-chartjs';
import moment from 'moment';

export default {
  extends: Bar,
  props: [
    'data'
  ],
  data() {
    return {
      options: {
        scales: {
          yAxes: [{
            stacked: true,
            ticks: {
              fontFamily: 'Lato',
              fontSize: '14',
              beginAtZero: true,
              callback: (value) => {
                return value.toLocaleString(undefined, { minimumFractionDigits: 2 }) + ' €';
              }
            },
            gridLines: {
              display: false
            }
          }],
          xAxes: [{
            stacked: true,
            ticks: {
              fontFamily: 'Lato',
              fontSize: '14',
              autoSkip: true,
              maxTicksLimit: 6
            },
            barPercentage: 0.5,
            gridLines: {
              display: false
            }
          }]
        },
        legend: {
          display: false
        },
        tooltips: {
          callbacks: {
            title: (tooltipItem) => {
              if (tooltipItem[0]) {
                const dateParts = tooltipItem[0].xLabel.split('/');
                return moment(new Date(dateParts[1], dateParts[0] - 1, '01')).format('MMM YYYY');
              }
            },
            label: (tooltipItem, data) => {
              return ' ' + data.datasets[tooltipItem.datasetIndex].label + ': ' + Number(tooltipItem.yLabel).toLocaleString(undefined, { minimumFractionDigits: 2 }) + ' €';
            }
          }
        },
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 0
        },
        hover: {
          animationDuration: 0
        },
        responsiveAnimationDuration: 0,
        onClick: this.clickHandler
      }
    };
  },
  mounted() {
    this.renderChart(this.data, this.options);
  },
  methods: {
    update() {
      this.$data._chart.update();
    },
    clickHandler(evt) {
      const c = this._data._chart;
      const activeElement = c.getElementAtEvent(evt);

      const activePoints = c.getElementsAtEventForMode(evt, 'point', c.options);
      const firstPoint = activePoints[0];
      const xLabel = c.data.labels[firstPoint._index];
      this.$emit('showact', xLabel + c.data.datasets[activeElement[0]._datasetIndex].catid);
    }
  }
};
</script>
