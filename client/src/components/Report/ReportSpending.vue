<template>
  <div class="ynab-u content">
    <div class="scroll-wrap reports-header-top">
      <div class="ynab-u reports-header">
        <button class="active" @click="goToRoute('reportsspending')">Spending</button>
        <button class="" @click="goToRoute('reportsnetworth')">Net Worth</button>
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
        <el-select
          v-model="selectedCategories"
          multiple
          collapse-tags
          class="s-categories"
          @visible-change="setCategories">
            <el-option
              v-for="item in selectOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
        </el-select>
        <button class="button button-categories">
          Categories
          <i class="fa fa-caret-down"></i>
        </button>
        <button class="button-select-option-first button-select-option" @click="unselectAllCategories()">
          Select None
        </button>
        <button class="button-select-option" @click="selectAllCategories()">
          Select All
        </button>
        <!-- <button class="button-select-option" @click="selectActiveCategories()">
          Select Active
        </button> -->
      </div>
      <div class="pure-u reports-container reports-spending">
        <div class="reports-content">
          <div class="pure-u reports-spending-toggle">
            <button :class="{'active': totalsActive}" @click="setActive(true)">
              <i class="fa fa-pie-chart"></i>
              Totals
            </button>
            <button :class="{'active': !totalsActive}" @click="setActive(false)">
              <i class="fa fa-line-chart"></i>
              Trends
            </button>
          </div>
          <h3 class="reports-title">{{ totalsActive ? 'Spending Totals' : 'Spending Trends' }}</h3>
          <div class="reports-spending-totals chart-container">
            <div class="chart-spacer"></div>
            <div class="chart">
              <div class="c3">
                <chart-spending-totals v-if="totalsActive" ref="chartSpendingTotals" :data="dataPieChart"></chart-spending-totals>
                <chart-spending-trends v-else ref="chartSpendingTrends" :data="dataBarChart" @showact="showActivity"></chart-spending-trends>
              </div>
            </div>
          </div>
        </div>
        <report-spending-aside
          :colors="dataPieChart.datasets[0].backgroundColor"
          :names="dataPieChart.labels"
          :spendings="dataPieChart.datasets[0].data"
          :monthsCount ="monthsCount"></report-spending-aside>
      </div>
   </div>
    <div v-for="item in acts" :key="item.name">
      <modal-activity :name="item.name" :categoryid="item.catid" :categoryname="item.catname" :tdate="item.date"></modal-activity>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { HTTP } from '@/common/utilities';
import moment from 'moment';
import ChartSpendingTotals from './ChartSpendingTotals';
import ChartSpendingTrends from './ChartSpendingTrends';
import ReportSpendingAside from './ReportSpendingAside';
import ModalActivity from './ModalActivity';

export default {
  components: {
    ChartSpendingTotals,
    ChartSpendingTrends,
    ReportSpendingAside,
    ModalActivity
  },
  data() {
    const self = this;
    return {
      acts: [],
      monthsCount: 1,
      totalsActive: false,
      dataPieChart: {
        datasets: [{
          label: 'Doughnut Dataset',
          backgroundColor: [
            'rgb(220, 95, 122)',
            'rgb(232, 125, 104)',
            'rgb(206, 136, 165)',
            'rgb(158, 226, 106)',
            'rgb(136, 206, 142)',
            'rgb(249, 173, 96)',
            'rgb(245, 234, 85)',
            'rgb(193, 93, 93)',
            'rgb(252, 210, 73)',
            'rgb(200, 226, 106)',
            'rgb(220, 95, 122)',
            'rgb(232, 125, 104)',
            'rgb(206, 136, 165)',
            'rgb(158, 226, 106)',
            'rgb(136, 206, 142)',
            'rgb(249, 173, 96)',
            'rgb(245, 234, 85)',
            'rgb(193, 93, 93)',
            'rgb(252, 210, 73)',
            'rgb(200, 226, 106)',
            'rgb(220, 95, 122)',
            'rgb(232, 125, 104)',
            'rgb(206, 136, 165)',
            'rgb(158, 226, 106)',
            'rgb(136, 206, 142)',
            'rgb(249, 173, 96)',
            'rgb(245, 234, 85)',
            'rgb(193, 93, 93)',
            'rgb(252, 210, 73)',
            'rgb(200, 226, 106)'
          ],
          data: []
        }],
        labels: [],
      },
      dataBarChart: {
        datasets: [{
          label: 'Line Dataset',
          data: [],
          type: 'line',
          lineTension: 0,
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: '#333',
          pointBorderColor: '#333',
          pointBackgroundColor: '#fff',
          pointRadius: 5
        }],
        labels: [],
      },
      dateFilter: [],
      selectedCategories: [],
      selectOptions: [],
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
            const end = moment().subtract(1, 'month').endOf('month').toDate();
            const start = moment().subtract(3, 'month').startOf('month').toDate();
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: 'Last 12 months',
          onClick(picker) {
            const end = moment().subtract(1, 'month').endOf('month').toDate();
            const start = moment().subtract(12, 'month').startOf('month').toDate();
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
    showActivity(value) {
      this.$modal.show(value);
    },
    setActive(value) {
      this.totalsActive = value;
    },
    initDate() {
      this.dateFilter = [
        moment(this.chartStartdate).toDate(),
        moment(this.chartEnddate).toDate(),
      ];
    },
    async saveCats() {
      const catarr = [];
      this.selectedCategories.forEach(c => {
        const catobj = {};
        catobj.userid = this.user.id;
        catobj.budgetid = this.budgetId;
        catobj.catid = c;
        catarr.push(catobj);
      });

      await HTTP.post(`/api/${this.budgetId}/${this.user.id}/categories/reportcats`, catarr);
    },
    async selectAllCategories() {
      await this.getCategories('all');
      await this.saveCats();
      await this.prepareData();
      if (this.totalsActive) {
        this.$refs.chartSpendingTotals.update();
      } else {
        this.$refs.chartSpendingTrends.update();
      }
    },
    async selectActiveCategories() {
      await this.getCategories('active');
      await this.saveCats();
      await this.prepareData();
      if (this.totalsActive) {
        this.$refs.chartSpendingTotals.update();
      } else {
        this.$refs.chartSpendingTrends.update();
      }
    },
    async unselectAllCategories() {
      this.selectedCategories = [];
      await this.saveCats();
      await this.prepareData();
      if (this.totalsActive) {
        this.$refs.chartSpendingTotals.update();
      } else {
        this.$refs.chartSpendingTrends.update();
      }
    },
    async setDate() {
      const dates = [
        moment(this.dateFilter[0]).format('YYYYMMDD'),
        moment(this.dateFilter[1]).format('YYYYMMDD'),
      ];

      await this.$store.dispatch('setChartDate', dates);

      await this.prepareData();
      if (this.totalsActive) {
        this.$refs.chartSpendingTotals.update();
      } else {
        this.$refs.chartSpendingTrends.update();
      }
    },
    async setCategories(isOpen) {
      await this.saveCats();
      if (!isOpen) {
        await this.prepareData();
        if (this.totalsActive) {
          this.$refs.chartSpendingTotals.update();
        } else {
          this.$refs.chartSpendingTrends.update();
        }
      }
    },
    async prepareData() {
      this.acts = [];
      this.dataPieChart.datasets[0].data = [];
      this.dataPieChart.labels = [];
      this.dataBarChart.datasets = [{
        label: 'Total',
        data: [],
        type: 'line',
        lineTension: 0,
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: '#333',
        pointBorderColor: '#333',
        pointBackgroundColor: '#e5f5f9',
        pointRadius: 5
      }];
      this.dataBarChart.labels = [];
      const categories = [];

      let route = `/api/${this.budgetId}/accounts/spending?start=${this.chartStartdate}&end=${this.chartEnddate}&userid=${this.user.id}&`;
      let ids = '';

      this.selectedCategories.forEach((id, index, array) => {
        ids += `categoryid=${id}`;
        if (index < array.length - 1) {
          ids += '&';
        }
      });

      route += ids;
      const results = await HTTP.get(route);

      this.monthsCount = await this.calculateMonthsCount(JSON.parse(JSON.stringify(results.data.totalsByMonth)));

      results.data.totals.forEach(e => {
        this.dataPieChart.datasets[0].data.push(e.amount);
        this.dataPieChart.labels.push(e.name);
        categories.push({
          id: e.category_id,
          name: e.name
        });
      });

      results.data.totalsByMonth.forEach(e => {
        if (!this.dataBarChart.labels.includes(e.date)) {
          this.dataBarChart.labels.push(e.date);
        }
      });
      let count = 0;
      categories.forEach((c, index) => {
        this.dataBarChart.datasets.push({
          label: c.name,
          data: [],
          catid: c.id,
          backgroundColor: this.dataPieChart.datasets[0].backgroundColor[index]
        });

        this.dataBarChart.labels.forEach(date => {
          this.acts.push({ id: count, name: date + c.id, catid: c.id, date: date, catname: c.name });
          count++;
          let e = results.data.totalsByMonth.find(obj => obj.category_id === c.id && obj.date === date);
          if (e === undefined) {
            e = {
              amount: 0
            };
          }

          this.dataBarChart.datasets[index + 1].data.push(Number(e.amount));
        });
      });

      const sums = [];
      this.dataBarChart.datasets.forEach((ds, index) => {
        if (index === 0) {
          return;
        }

        ds.data.forEach((e, i) => {
          if (sums[i] === undefined) {
            sums[i] = 0;
          }

          sums[i] += e;
        });
      });

      sums.forEach(e => {
        this.dataBarChart.datasets[0].data.push(e);
      });
    },
    async calculateMonthsCount(data) {
      const filteredDataByDate = [];
      let date = '';
      data.forEach(o => {
        if (date !== o.date) {
          filteredDataByDate.push(o);
          date = o.date;
        }
      });

      if (filteredDataByDate.length < 1) {
        return 1;
      }

      const results = await HTTP.get(`/api/date/${this.budgetId}/${this.chartStartdate}/${this.chartEnddate}`);
      const date2 = moment(results.data.tdate).format('YYYYMM01').toString();

      const results2 = await HTTP.get(`/api/datemax/${this.budgetId}/${this.chartStartdate}/${this.chartEnddate}`);
      const date3 = moment(moment(results2.data.tdate).format('YYYYMM01').toString());

      const monthDiff = Math.floor(date3.diff(date2, 'months', true) + 1);
      return monthDiff;
    },
    goToRoute(route) {
      this.$router.push({ name: route });
    },
    async getCategories(type) {
      this.selectedCategories = [];
      this.selectOptions = [];
      const results = await HTTP.get(`/api/${this.budgetId}/categories`);
      const categories = results.data;

      categories.sort((a, b) => {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();

        if (nameA < nameB) {
          return -1;
        }

        if (nameA > nameB) {
          return 1;
        }

        return 0;
      });

      categories.forEach(c => {
        if (c.name === 'To be Budgeted') {
          return;
        }

        this.selectOptions.push({
          value: c.id,
          label: c.name
        });

        if (type === 'all') {
          this.selectedCategories.push(c.id);
        }

        if (type === 'active' && !c.is_hidden) {
          this.selectedCategories.push(c.id);
        }
      });
    }
  },
  async created() {
    const response = await HTTP.get(`/api/${this.budgetId}/${this.user.id}/categories/reportcats`);
    response.data.forEach(e => {
      this.selectedCategories.push(e.category_id);
    });

    this.selectOptions = [];
    const results = await HTTP.get(`/api/${this.budgetId}/categories`);
    const categories = results.data;

    categories.sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();

      if (nameA < nameB) {
        return -1;
      }

      if (nameA > nameB) {
        return 1;
      }

      return 0;
    });

    categories.forEach(c => {
      if (c.name === 'To be Budgeted') {
        return;
      }

      this.selectOptions.push({
        value: c.id,
        label: c.name
      });
    });

    await this.prepareData();
    if (this.totalsActive) {
      this.$refs.chartSpendingTotals.update();
    } else {
      this.$refs.chartSpendingTrends.update();
    }
  }
};
</script>
