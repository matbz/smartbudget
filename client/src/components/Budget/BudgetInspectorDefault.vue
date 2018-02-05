<template>
  <div class="budget-inspector">
    <div class="budget-inspector-default-inspector">
        <div class="budget-inspector-default">
          <h3>TOTAL BUDGETED</h3>
          <h1><span class="currency">{{ total_budgeted | currency}}</span></h1>
          <hr>
          <h3>TOTAL ACTIVITY</h3>
          <h1><span class="currency">{{ total_activity | currency}}</span></h1>
          <hr>
          <h3>TOTAL AVAILABLE</h3>
          <h1><span class="currency">{{ total_available | currency}}</span></h1>
          <hr>
          <div class="inspector-quick-budget">
              <h3>QUICK BUDGET</h3>
              <button
                class="budget-inspector-button"
                @click="confirmDeleteLastMonth()"
              >
                Budgeted Last Month: <strong><span class="currency">{{ budgetedLastMonth | currency}}</span></strong>
              </button>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters([
      'budgetList',
      'budgetDate',
      'budgetedLastMonth'
    ]),
    total_budgeted() {
      return this.getSum('budgeted');
    },
    total_activity() {
      return this.getSum('activity');
    },
    total_available() {
      return this.getSum('available');
    }
  },
  methods: {
    getSum(fieldname) {
      let sum = 0;
      this.budgetList.forEach(header => header.items.forEach(item => {
        sum += Number(item[fieldname]);
      }));
      return sum;
    },
    confirmDeleteLastMonth() {
      this.$modal.show('dialog', {
        title: 'Take budgeted of last month',
        text: 'Are you sure? This will overwrite all budgeted amounts of this month.',
        buttons: [
          { title: 'Close' },
          { title: 'Yes', handler: () => { this.setBudgetedLastMonth(); } }
        ]
      });
    },
    async setBudgetedLastMonth() {
      this.$modal.hide('dialog');
      try {
        await this.$store.dispatch('setBudgetedLastMonth');
        await this.$store.dispatch('getToBeBudgeted', this.budgetDate);
        await this.$store.dispatch('getBudgetList', this.budgetDate);
      } catch (error) {
        this.$toasted.error('There was an error setting budgeted last month.');
      }
    }
  }
};
</script>

