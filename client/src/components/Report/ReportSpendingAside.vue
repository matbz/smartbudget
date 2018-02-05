<template>
  <aside class="ynab-u reports-inspector reports-inspector-spending">
    <div class="reports-inspector-timeframe">
      <div class="reports-inspector-timeframe-title">{{ formattedStartdate }} - {{ formattedEnddate }}</div>
      <hr>
    </div>
    <h3>Total Spending</h3>
    <h2 class="reports-inspector-total-spending">
      <span class="currency positive">{{ total | currency }}</span>
    </h2>
    <h4>For this time period</h4>
    <hr>
    <h3>Average Spending</h3>
    <h2 class="reports-inspector-average-spending">
      <span class="currency positive">{{ averageSpent | currency }}</span>
    </h2>
    <h4>Per month</h4>
    <hr>
    <table class="reports-inspector-table">
      <thead>
        <tr>
          <th colspan="2">CATEGORY</th>
          <th>SPENDING</th>
        </tr>
      </thead>
      <tbody>
        <report-spending-aside-row
          v-for="(spending, index) in spendings"
          :name="names[index]"
          :amount="spending"
          :color="colors[index]"
          :key="spending"></report-spending-aside-row>
      </tbody>
    </table>
  </aside>
</template>

<script>
import { mapGetters } from 'vuex';
import moment from 'moment';
import ReportSpendingAsideRow from './ReportSpendingAsideRow';

export default {
  components: {
    ReportSpendingAsideRow
  },
  props: [
    'colors',
    'names',
    'spendings',
    'monthsCount'
  ],
  computed: {
    ...mapGetters([
      'chartStartdate',
      'chartEnddate'
    ]),
    formattedStartdate() {
      return moment(this.chartStartdate).format('MMM YYYY');
    },
    formattedEnddate() {
      return moment(this.chartEnddate).format('MMM YYYY');
    },
    averageSpent() {
      return Number(this.total / this.monthsCount).toFixed(2);
    },
    total() {
      return this.spendings.reduce((total, value) => {
        return total + Number(value);
      }, 0);
    }
  },
};
</script>
