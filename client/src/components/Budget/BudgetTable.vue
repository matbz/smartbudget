<template>
  <div class="budget-content">
      <ul class=" budget-table-header sticky-header">
        <li class="budget-table-cell-checkbox">
            <div  class="ynab-checkbox">
              <button role="checkbox" class="ynab-checkbox-button">
                  <div class="ynab-checkbox-button-square"></div>
              </button>
            </div>
        </li>
        <li class="budget-table-cell-name">CATEGORY</li>
        <li class="budget-table-cell-budgeted">BUDGETED</li>
        <li class="budget-table-cell-activity">ACTIVITY</li>
        <li class="budget-table-cell-available bolder">AVAILABLE</li>
      </ul>
      <div class="budget-table-container">
        <div class="budget-table">
          <draggable :list="lists" :options="{ handle: '.is-draggable', animation: 100 }" @start="hideCategories" @end="showCategories" @update="onDndUpdate">
            <budget-table-group
              v-for="list in lists"
              :list = "list"
              :key="list.categorygroup_id"
              @sorted="onSorted()"
              ref="budgetGroup"
            ></budget-table-group>
          </draggable>
          <budget-table-hidden v-if="isHidden"></budget-table-hidden>
        </div>
      </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { HTTP } from '@/common/utilities';
import draggable from 'vuedraggable';
import BudgetTableGroup from './BudgetTableGroup';
import BudgetTableHidden from './BudgetTableHidden';

export default {
  components: {
    draggable,
    BudgetTableGroup,
    BudgetTableHidden
  },
  props: [
    'lists'
  ],
  computed: {
    ...mapGetters([
      'budgetDate',
      'isHidden'
    ])
  },
  methods: {
    showCategories() {
      this.$refs.budgetGroup.forEach(item => {
        item.showCategories();
      });
    },
    hideCategories() {
      this.$refs.budgetGroup.forEach(item => {
        item.hideCategories();
      });
    },
    async onDndUpdate() {
      await this.saveSortedList();
      this.getBudget();
    },
    async saveSortedList() {
      const sortedList = [];
      this.lists.forEach((e, index) => {
        sortedList.push({
          id: e.header.categorygroup_id,
          position: index + 1
        });
      });
      await HTTP.post('/api/categorygroups/positions', sortedList);
    },
    async onSorted() {
      const sortedList = [];
      this.lists.forEach(e => {
        e.items.forEach((c, index) => {
          sortedList.push({
            id: c.category_id,
            position: index + 1,
            categorygroup_id: e.header.categorygroup_id
          });
        });
      });
      await HTTP.post('/api/categories/positions', sortedList);
      this.getBudget();
    },
    async getBudget() {
      try {
        this.$store.dispatch('getBudgetList', this.budgetDate);
      } catch (error) {
        this.$toasted.error('There was an error getting the budget list.');
      }
    }
  }
};
</script>
