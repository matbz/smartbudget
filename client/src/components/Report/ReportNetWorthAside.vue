<template>
  <aside class="ynab-u reports-inspector reports-inspector-net-worth">
      <div class="reports-inspector-timeframe">
        <div class="reports-inspector-timeframe-title">{{ formattedStartdate }} - {{ formattedEnddate }}</div>
        <hr>
      </div>
      <h3>Change in Net Worth</h3>
      <h2 class="reports-inspector-change-in-net-worth">
        <i v-if="netWorthChange !== 0" class="fa" :class="[netWorthChange > 0 ? 'fa-arrow-circle-up' : 'fa-arrow-circle-down']"></i>
        <span class="currency">{{ netWorthChange >= 0 ? netWorthChange : netWorthChange * -1 | currency }}</span>
      </h2>
      <h4 class="reports-inspector-change-in-net-worth-percentage">{{ percentChange }}%</h4>
      <hr>
      <table class="reports-inspector-table">
        <thead>
            <tr>
              <th>MONTH</th>
              <th>NET WORTH</th>
            </tr>
        </thead>
        <tbody>
          <report-net-worth-aside-row
            v-for="(balance, index) in balancesReversed"
            :balance="balance"
            :date="datesReversed[index]"
            :prevBalance="balancesReversed[index + 1] || balancesReversed[balancesReversed.length]"
            :key="balance"
          ></report-net-worth-aside-row>
        </tbody>
      </table>
  </aside>
</template>

<script>
import { mapGetters } from 'vuex';
import moment from 'moment';
import ReportNetWorthAsideRow from './ReportNetWorthAsideRow';

export default {
  components: {
    ReportNetWorthAsideRow
  },
  props: [
    'dates',
    'balances'
  ],
  computed: {
    ...mapGetters([
      'chartStartdate',
      'chartEnddate'
    ]),
    datesReversed() {
      const arr = [...this.dates];
      return arr.reverse();
    },
    balancesReversed() {
      const arr = [...this.balances];
      return arr.reverse();
    },
    first() {
      return Number(this.balances[0]);
    },
    last() {
      return Number(this.balances[this.balances.length - 1]);
    },
    netWorthChange() {
      return this.last - this.first;
    },
    percentChange() {
      return Number(this.last / this.first * 100 - 100).toFixed(1);
    },
    formattedStartdate() {
      return moment(this.chartStartdate).format('MMM YYYY');
    },
    formattedEnddate() {
      return moment(this.chartEnddate).format('MMM YYYY');
    }
  },
};
</script>
