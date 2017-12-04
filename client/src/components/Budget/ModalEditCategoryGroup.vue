<template>
  <modal class="modal-popup modal-budget-edit-category" :name="name" :width="400" height="auto" :pivot-y="0.3" :pivot-x="0.45" @opened="opened">
    <div class="modal-content">
      <div class="fieldset">
        <div>
          <div>
            <input
              ref="categoryGroupInput"
              placeholder="Category Group Name"
              type="text"
              class="modal-budget-edit-category-name"
              v-model="categoryGroup.name"
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
          <button class="button button-delete" @click="confirmDeleteCategoryGroup()">
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
    'categorygroupid'
  ],
  data() {
    return {
      categoryGroup: {}
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
      this.$refs.categoryGroupInput.focus();
    },
    close() {
      this.categoryGroup = {};
      this.$modal.hide(this.name);
    },
    hide() {
      this.categoryGroup.is_hidden = true;
      this.save();
    },
    confirmDeleteCategoryGroup() {
      this.$modal.hide(this.name);
      this.$modal.show('dialog', {
        title: 'Delete ' + this.categoryGroup.name,
        text: 'Are you sure you want to delete this category group?',
        buttons: [
          { title: 'Close' },
          { title: 'Delete', handler: () => { this.deleteCategoryGroup(); } }
        ]
      });
    },
    async deleteCategoryGroup() {
      await HTTP.delete(`/api/categorygroups/${this.categorygroupid}`);
      await this.getBudget();
      this.$modal.hide('dialog');
      this.close();
    },
    async save() {
      if (this.categoryGroup.name) {
        await this.$store.dispatch('updateCategoryGroup', this.categoryGroup);
        await this.getBudget();
        this.close();
      } else {
        this.$toasted.error('Name is required.');
      }
    },
    async getCategory() {
      const response = await HTTP.get(`/api/categorygroups/${this.categorygroupid}`);
      this.categoryGroup = response.data;
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

