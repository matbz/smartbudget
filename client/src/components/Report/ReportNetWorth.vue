<template>
  <div class="ynab-u content">
    <div class="scroll-wrap reports-header-top">
      <div class="ynab-u reports-header">
        <button class="" @click="goToRoute('reportsspending')">Spending</button>
        <button class="active" @click="goToRoute('reportsnetworth')">Net Worth</button>
      </div>
      <div class="pure-u reports-controls">
        <el-date-picker
          v-model="dateFilter"
          type="daterange"
          align="right"
          unlink-panels
          :picker-options="pickerOptions"
          @change="setDate()"
          @focus="initDate()">
        </el-date-picker>
        <button class="button-timeframe button">
          {{ formattedStartdate }} - {{ formattedEnddate }}
          <i class="fa fa-caret-down"></i>
        </button>
      </div>
      <div class="pure-u reports-container reports-net-worth">
        <div class="reports-content">
            <h3 class="reports-title">Net Worth</h3>
            <div class="reports-net-worth chart-container">
              <div class="chart-spacer"></div>
              <div class="chart">
                  <div class="c3">
                    <chart-net-worth ref="chartNetWorth" :data="dataCollection"></chart-net-worth>
                  </div>
              </div>
            </div>
        </div>
        <report-net-worth-aside :dates="dataCollection.labels" :balances="dataCollection.datasets[0].data"></report-net-worth-aside>
      </div>
   </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { HTTP } from '@/common/utilities';
import moment from 'moment';
import ChartNetWorth from './ChartNetWorth';
import ReportNetWorthAside from './ReportNetWorthAside';

export default {
  components: {
    ChartNetWorth,
    ReportNetWorthAside
  },
  data() {
    const self = this;
    return {
      dataCollection: {
        datasets: [{
          label: 'Line Dataset',
          data: [],
          type: 'line',
          lineTension: 0,
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: '#333',
          pointBorderColor: '#333',
          pointBackgroundColor: '#e5f5f9',
          pointRadius: 5
        }, {
          label: 'Bar Dataset',
          data: [],
          backgroundColor: 'rgb(44, 173, 191)',
        }],
        labels: [],
      },
      dateFilter: [],
      pickerOptions: {
        shortcuts: [{
          text: 'This Month',
          onClick(picker) {
            const end = moment().endOf('month').toDate();
            const start = moment().startOf('month').toDate();
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: 'Last Month',
          onClick(picker) {
            const end = moment().subtract(1, 'month').endOf('month').toDate();
            const start = moment().subtract(1, 'month').startOf('month').toDate();
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: 'Last 3 months',
          onClick(picker) {
            const end = new Date();
            const start = moment().subtract(2, 'month').startOf('month').toDate();
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: 'Last 12 months',
          onClick(picker) {
            const end = new Date();
            const start = moment().subtract(11, 'month').startOf('month').toDate();
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: 'This Year',
          onClick(picker) {
            const end = moment(moment(new Date()).year().toString() + '1231').toDate();
            const start = moment(moment(new Date()).year().toString() + '0101').toDate();
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: 'Last Year',
          onClick(picker) {
            const end = moment(moment(new Date()).year().toString() + '1231').subtract(1, 'year').toDate();
            const start = moment(moment(new Date()).year().toString() + '0101').subtract(1, 'year').toDate();
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: 'All Dates',
          async onClick(picker) {
            const response = await HTTP.get(`/api/${self.budgetId}/turnovers/minmaxdate`);
            const end = moment(response.data.max).toDate();
            const start = moment(response.data.min).toDate();
            picker.$emit('pick', [start, end]);
          }
        }]
      }
    };
  },
  computed: {
    ...mapGetters([
      'budgetId',
      'user',
      'chartStartdate',
      'chartEnddate'
    ]),
    formattedStartdate() {
      return moment(this.chartStartdate).format('MMM YYYY');
    },
    formattedEnddate() {
      return moment(this.chartEnddate).format('MMM YYYY');
    }
  },
  methods: {
    initDate() {
      this.dateFilter = [
        moment(this.chartStartdate).toDate(),
        moment(this.chartEnddate).toDate(),
      ];
    },
    async setDate() {
      const dates = [
        moment(this.dateFilter[0]).format('YYYYMMDD'),
        moment(this.dateFilter[1]).format('YYYYMMDD'),
      ];
      this.$store.dispatch('setChartDate', dates);
      await this.prepareData();
      this.$refs.chartNetWorth.update();
    },
    async prepareData() {
      this.dataCollection.datasets[0].data = [];
      this.dataCollection.datasets[1].data = [];
      this.dataCollection.labels = [];

      const results = await HTTP.get(`/api/${this.budgetId}/accounts/balance?start=${this.chartStartdate}&end=${this.chartEnddate}&userid=${this.user.id}`);

      let arr = [];
      let sum = 0;

      results.data.balances.forEach((e, index, array) => {
        arr = array.filter((el, i) => i <= index);
        sum = arr.reduce((total, value) => {
          return total + Number(value.amount);
        }, Number(results.data.pastBalance));
        this.dataCollection.datasets[0].data.push(sum);
        this.dataCollection.labels.push(e.date);
      });

      this.dataCollection.datasets[1].data = [...this.dataCollection.datasets[0].data];
    },
    goToRoute(route) {
      this.$router.push({ name: route });
    },
  },
  async created() {
    await this.prepareData();
    this.$refs.chartNetWorth.update();
  }
};
</script>
