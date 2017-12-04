<template>
  <div>
    <li v-if="list.header.categorygroup_is_hidden" class="modal-budget-hidden-categories-master-hidden">
      <button class="category-name-text" @click="unhideCategoryGroup(list.header.categorygroup_id)">
      <span>{{ list.header.categorygroup_name}}:</span>
      </button>
    </li>
    <span v-else class="has-feature is-enabled">
      <li class="modal-budget-hidden-categories-master-unhidden category-name-text">
        <span>{{ list.header.categorygroup_name}}:</span>
      </li>
    </span>
    <li
      v-for="item in list.items"
      :key="item.category_id"
      class="modal-budget-hidden-categories-sub-hidden">
      <button class="category-name-text" @click="unhideCategory(item.category_id)">
        <span>{{ item.category_name }}</span>
      </button>
    </li>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { HTTP } from '@/common/utilities';

export default {
  props: [
    'list'
  ],
  computed: {
    ...mapGetters([
      'budgetDate',
      'budgetList',
      'budgetId'
    ])
  },
  methods: {
    close() {
      this.$modal.hide('moda-hidden-categories');
    },
    async unhideCategoryGroup(categorygroupId) {
      const categoryGroup = {
        id: categorygroupId,
        is_hidden: false
      };
      await this.$store.dispatch('updateCategoryGroup', categoryGroup);
      this.closeWithUpdate();
    },
    async unhideCategory(categoryid) {
      const category = {
        id: categoryid,
        is_hidden: false
      };
      await this.$store.dispatch('updateCategory', category);

      if (this.list.header.categorygroup_is_hidden) {
        const categoryGroup = {
          id: this.list.header.categorygroup_id,
          is_hidden: false
        };
        await HTTP.put(`/api/categorygroups/${this.list.header.categorygroup_id}/unhide`, categoryGroup);
      }

      this.closeWithUpdate();
    },
    async closeWithUpdate() {
      await this.getBudget();
      this.close();
    },
    async getBudget() {
      try {
        await this.$store.dispatch('getBudgetList', this.budgetDate);
      } catch (error) {
        this.$toasted.error('There was an error getting the budget list.');
      }
    }
  }
};
</script>

