<template>
  <modal class="modal-budget-hidden-categories" name="moda-hidden-categories" :width="231" height="auto" :pivot-y="0.3" :pivot-x="0.45">
    <div class="modal-header">
      Click to unhide a category
    </div>
    <ul class="modal-content">
      <modal-hidden-categories-group
        v-for="list in budgetListFiltered"
        :list="list"
        :key="list.header.categorygroup_id"
      ></modal-hidden-categories-group>
    </ul>
    <div class="modal-actions">
      <button class="button button-primary button-hidden" @click="unhideAll()">
        Show all hidden categories
      </button>
    </div>
  </modal>
</template>

<script>
import { mapGetters } from 'vuex';
import { HTTP } from '@/common/utilities';
import ModalHiddenCategoriesGroup from './ModalHiddenCategoriesGroup';

export default {
  components: {
    ModalHiddenCategoriesGroup
  },
  computed: {
    ...mapGetters([
      'budgetDate',
      'budgetList',
      'budgetId'
    ]),
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
    close() {
      this.$modal.hide('moda-hidden-categories');
    },
    async unhideAll() {
      await HTTP.put(`/api/${this.budgetId}/categories/unhide`);
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

