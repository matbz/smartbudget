<template>
  <div>
    <budget-table-group-header @collapse="toggleBodyVisibility()" :header="list.header"></budget-table-group-header>
    <div class="budget-table-group-body" v-show="displayCategories">
      <draggable :list="list.items" :options="{ group: 'dnd-items', animation: 100, handle: '.is-draggable'}" @add="onDndAdded" @update="onDndUpdate">
        <budget-table-group-item
          v-for="item in list.items"
          :item = "item"
          :key="item.category_id"
        ></budget-table-group-item>
      </draggable>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { HTTP } from '@/common/utilities';
import draggable from 'vuedraggable';
import BudgetTableGroupHeader from './BudgetTableGroupHeader';
import BudgetTableGroupItem from './BudgetTableGroupItem';

export default {
  components: {
    draggable,
    BudgetTableGroupHeader,
    BudgetTableGroupItem
  },
  props: [
    'list'
  ],
  data() {
    return {
      displayCategories: true
    };
  },
  computed: {
    ...mapGetters([
      'budgetDate'
    ])
  },
  methods: {
    toggleBodyVisibility() {
      this.displayCategories = !this.displayCategories;
    },
    showCategories() {
      this.displayCategories = true;
    },
    hideCategories() {
      this.displayCategories = false;
    },
    onDndAdded() {
      this.$emit('sorted');
    },
    async onDndUpdate() {
      await this.saveSortedList();
      this.getBudget();
    },
    async saveSortedList() {
      const sortedList = [];
      this.list.items.forEach((e, index) => {
        sortedList.push({
          id: e.category_id,
          position: index + 1
        });
      });
      await HTTP.post('/api/categories/positions', sortedList);
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
