<template>
  <modal class="modal-popup" :name="name" :width="224" height="auto" :pivot-y="0.3" :pivot-x="0.45" @opened="opened">
    <div class="modal-content">
      <div class="fieldset">
        <div>
          <div>
            <input
              ref="addCategoryInput"
              placeholder="New Category"
              type="text"
              class="input-primary"
              v-model="categoryName"
              @keyup.esc="close()"
              @keyup.enter="save()">
          </div>
        </div>
      </div>
    </div>
    <div class="modal-actions">
      <button class="button button-primary" @click="save()">
          OK
          <i class="fa fa-check-circle-o"></i>
      </button>
      <button class="button button-cancel" @click="close()">
          Cancel
          <i class="fa fa-times-circle-o"></i>
      </button>
    </div>
  </modal>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  props: [
    'name',
    'categorygroupid'
  ],
  data() {
    return {
      categoryName: ''
    };
  },
  computed: {
    ...mapGetters([
      'budgetDate'
    ])
  },
  methods: {
    opened() {
      this.$refs.addCategoryInput.focus();
    },
    close() {
      this.categoryName = '';
      this.$modal.hide(this.name);
    },
    async save() {
      if (this.categoryName) {
        const data = {
          name: this.categoryName,
          categorygroupId: this.categorygroupid
        };
        await this.$store.dispatch('createCategory', data);
        await this.getBudget();
        this.close();
      } else {
        this.$toasted.error('Name is required.');
      }
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

