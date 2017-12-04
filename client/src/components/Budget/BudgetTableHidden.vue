<template>
  <div>
    <ul class="budget-table-row is-master-category">
      <li class="budget-table-cell-checkbox">
      </li>
      <li class="budget-table-cell-name" style="cursor: pointer" @click="showModal()">
          <div class="budget-table-cell-name-static-width" style="margin-left: 10.8125px"></div>
          <div class="budget-table-cell-name-row-label-item">
            <div class="button budget-table-cell-button budget-table-cell-edit-category">Hidden Categories</div>
          </div>
      </li>
      <li class="budget-table-cell-budgeted">
          <div><span class="currency">{{ total_budgeted | currency }}</span></div>
      </li>
      <li class="budget-table-cell-activity">
          <div class="budget-number"><span class="currency">{{ total_activity | currency }}</span></div>
      </li>
      <li class="budget-table-cell-available">
          <div class="budget-table-cell-available-div"><span class="currency">{{ total_available | currency }}</span></div>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters([
      'budgetList',
      'budgetDate'
    ]),
    total_budgeted() {
      return this.getSum('budgeted');
    },
    total_activity() {
      return this.getSum('activity');
    },
    total_available() {
      return this.getSum('available');
    },
    budgetListFiltered() {
      const data = [];
      let items = [];

      this.budgetList.forEach(e => {
        items = e.items.filter(item => item.category_is_hidden);
        if (items.length > 0) {
          data.push({
            header: e.header,
            items
          });
        }
      });

      return data;
    }
  },
  methods: {
    getSum(fieldname) {
      let sum = 0;
      this.budgetListFiltered.forEach(header => header.items.forEach(item => {
        sum += Number(item[fieldname]);
      }));
      return sum;
    },
    showModal() {
      this.$modal.show('moda-hidden-categories');
    },
    getBudget() {
      try {
        this.$store.dispatch('getBudgetList', this.budgetDate);
      } catch (error) {
        this.$toasted.error('There was an error getting the budget list.');
      }
    }
  }
};
</script>

