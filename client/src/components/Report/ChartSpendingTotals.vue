<script>
import { Doughnut } from 'vue-chartjs';

export default {
  extends: Doughnut,
  props: [
    'data'
  ],
  data() {
    return {
      options: {
        scales: {
          yAxes: [{
            display: false
          }],
          xAxes: [{
            display: false,
          }]
        },
        legend: {
          display: false
        },
        tooltips: {
          callbacks: {
            title: (tooltipItem) => {
              if (tooltipItem[0]) {
                return tooltipItem[0].xLabel;
              }
            },
            label: (tooltipItem, data) => {
              return ' ' + data.labels[tooltipItem.index] + ': ' + Number(data.datasets[0].data[tooltipItem.index]).toLocaleString(undefined, { minimumFractionDigits: 2 }) + ' €';
            }
          }
        },
        responsive: true,
        maintainAspectRatio: false
      }
    };
  },
  mounted() {
    this.renderChart(this.data, this.options);
  },
  methods: {
    update() {
      this.$data._chart.update();
    }
  }
};
</script>
