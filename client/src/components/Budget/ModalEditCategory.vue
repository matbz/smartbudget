<template>
  <modal class="modal-popup modal-budget-edit-category" :name="name" :width="400" height="auto" :pivot-y="0.3" :pivot-x="0.45" @opened="opened" @closed="closed">
    <div class="modal-content">
      <div class="fieldset">
        <div>
          <div>
            <input
              ref="categoryInput"
              placeholder="Category Name"
              type="text"
              class="modal-budget-edit-category-name"
              v-model="category.name"
              @keyup.esc="close()"
              @keyup.enter="save()">
          </div>
        </div>
      </div>
    </div>
    <div class="modal-actions">
      <div class="modal-actions-left">
          <button class="button button-hide" @click="hide()">
            <i class="fa fa-eye"></i>
            Hide
          </button>
          <button class="button button-delete" @click="confirmDeleteCategory()">
            <i class="fa fa-trash-o"></i>
            Delete
          </button>
      </div>
      <div class="modal-actions-right">
        <button class="button button-primary" @click="save()">
            OK
            <i class="fa fa-check-circle-o"></i>
        </button>
        <button class="button button-cancel" @click="close()">
            Cancel
            <i class="fa fa-times-circle-o"></i>
        </button>
      </div>
    </div>
  </modal>
</template>

<script>
import { mapGetters } from 'vuex';
import { HTTP } from '@/common/utilities';

export default {
  props: [
    'name',
    'categoryid'
  ],
  data() {
    return {
      category: {}
    };
  },
  computed: {
    ...mapGetters([
      'budgetDate'
    ])
  },
  methods: {
    async opened() {
      await this.getCategory();
      this.$refs.categoryInput.focus();
    },
    closed() {
      this.$emit('closed');
    },
    close() {
      this.category = {};
      this.$modal.hide(this.name);
    },
    hide() {
      this.category.is_hidden = true;
      this.save();
    },
    confirmDeleteCategory() {
      this.$modal.hide(this.name);
      this.$modal.show('dialog', {
        title: 'Delete ' + this.category.name,
        text: 'Are you sure you want to delete this category?',
        buttons: [
          { title: 'Close' },
          { title: 'Delete', handler: () => { this.deleteCategory(); } }
        ]
      });
    },
    async deleteCategory() {
      await HTTP.delete(`/api/categories/${this.categoryid}`);
      await this.getBudget();
      this.$store.dispatch('removeAllSelectedCategories');
      this.$modal.hide('dialog');
      this.close();
    },
    async save() {
      if (this.category.name) {
        await this.$store.dispatch('updateCategory', this.category);
        await this.getBudget();
        this.close();
      } else {
        this.$toasted.error('Name is required.');
      }
    },
    async getCategory() {
      const response = await HTTP.get(`/api/categories/${this.categoryid}`);
      this.category = response.data;
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

