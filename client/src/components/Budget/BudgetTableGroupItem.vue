<template>
  <ul
    class="budget-table-row is-sub-category"
    :class="{ 'is-checked': selectedCategory === this.item.category_id }"
    >
    <li class="budget-table-cell-checkbox is-draggable" @click="toggleChecked()">
        <div class="ynab-checkbox">
          <button class="ynab-checkbox-button">
              <div class="flaticon stroke ynab-checkbox-button-square"
                   :class="{ 'is-checked': selectedCategory === this.item.category_id }"></div>
          </button>
        </div>
    </li>
    <li class="budget-table-cell-name" @click="check()">
        <div class="button budget-table-cell-name-row-label-item budget-table-cell-button budget-table-cell-edit-category">
          <div class="button-truncate">
              <span class="user-entered-text" @click="editCategory()">{{ item.category_name }}</span>
          </div>
        </div>
    </li>
    <li class="budget-table-cell-budgeted" @click="check()">
        <div v-if="!edit" class="currency-input">
          <span
            class="currency"
            :class="budgetedCurrencyClass"
            @click="editBudget()"
          >
            {{ item.budgeted | currency }}
          </span>
        </div>
        <div
          v-else
          class="currency-input user-data is-editing"
        >
          <input
            type="text"
            @keyup.enter="saveBudget()"
            @keyup.esc="hideBudgetInput()"
            @focus="formatBudgetInput()"
            v-on-click-outside="saveBudget"
            ref="edit"
            v-model="amount"
          >
        </div>
    </li>
    <li class="budget-table-cell-activity" @click="check()">
        <div class="budget-number" :class="activityCurrencyClass" @click="showActivity()">
          <span class="currency">{{ item.activity | currency }}</span>
        </div>
    </li>
    <li class="budget-table-cell-available" @click="check()">
        <div class="budget-table-cell-available-div" @click="changeAvailable()">
          <span
            class="currency"
            :class="availableCurrencyClass"
          >
            {{ item.available | currency }}
          </span>
        </div>
    </li>

    <modal-edit-category :name="modalNameEditCategory" :categoryid="item.category_id" @closed="refreshInspector"></modal-edit-category>
    <modal-activity :name="modalNameActivity" :categoryid="item.category_id" :categoryname="item.category_name"></modal-activity>
    <modal-move-available :name="modalNameMoveAvailable" :categoryid="item.category_id" :available="item.available" @closed="refreshInspector"></modal-move-available>
    <modal-cover-available :name="modalNameCoverAvailable" :categoryid="item.category_id" :available="item.available" @closed="refreshInspector"></modal-cover-available>
  </ul>
</template>

<script>
import { mapGetters } from 'vuex';
import { mixin as onClickOutside } from 'vue-on-click-outside';
import moment from 'moment';
import ModalEditCategory from './ModalEditCategory';
import ModalActivity from './ModalActivity';
import ModalMoveAvailable from './ModalMoveAvailable';
import ModalCoverAvailable from './ModalCoverAvailable';

export default {
  components: {
    ModalEditCategory,
    ModalActivity,
    ModalMoveAvailable,
    ModalCoverAvailable
  },
  mixins: [onClickOutside],
  props: [
    'item'
  ],
  data() {
    return {
      edit: false,
      isChecked: false,
      amount: 0,
    };
  },
  computed: {
    ...mapGetters([
      'budgetDate',
      'selectedCategories'
    ]),
    selectedCategory() {
      if (this.selectedCategories.length > 0) {
        return this.selectedCategories[0].category_id;
      }
    },
    modalNameEditCategory() {
      return `edit-cat-${this.item.category_id}`;
    },
    modalNameActivity() {
      return `activity-${this.item.category_id}`;
    },
    modalNameMoveAvailable() {
      return `move-available-${this.item.category_id}`;
    },
    modalNameCoverAvailable() {
      return `cover-available-${this.item.category_id}`;
    },
    budgetedData() {
      return {
        categoryId: Number(this.item.category_id),
        budgetedDate: this.budgetDate,
        amount: this.amount
      };
    },
    budgetedCurrencyClass() {
      return {
        positive: this.item.budgeted > 0,
        negative: this.item.budgeted < 0,
        zero: Number(this.item.budgeted) === 0
      };
    },
    activityCurrencyClass() {
      return {
        positive: this.item.activity > 0,
        negative: this.item.activity < 0,
        notxns: Number(this.item.activity) === 0
      };
    },
    availableCurrencyClass() {
      return {
        positive: this.item.available > 0,
        negative: this.item.available < 0,
        zero: Number(this.item.available) === 0 && !this.goalNotOnTrack,
        cautious: this.goalNotOnTrack
      };
    },
    goalNotOnTrack() {
      const monthsDifference = moment(this.item.goal_enddate).diff(moment(this.budgetDate), 'month', true) + 1;
      const amountLeft = Number(this.item.goal_amount) - Number(this.item.available);
      const amountToStayOnTrack = Number((amountLeft + Number(this.item.budgeted)) / monthsDifference).toFixed(2);

      if (this.item.goal_enddate && amountToStayOnTrack && amountToStayOnTrack > 0 && amountToStayOnTrack > Number(this.item.budgeted)) {
        return true;
      }
      return false;
    }
  },
  methods: {
    toggleChecked() {
      if (this.isChecked) {
        this.hideBudgetInput();
        this.uncheck();
      } else {
        this.check();
      }
    },
    check() {
      this.isChecked = true;
      this.$store.dispatch('removeAllSelectedCategories');
      this.$store.dispatch('addSelectedCategory', this.item);
    },
    uncheck() {
      this.isChecked = false;
      this.$store.dispatch('removeAllSelectedCategories');
    },
    editCategory() {
      this.$modal.show(this.modalNameEditCategory);
    },
    refreshInspector() {
      this.$store.dispatch('removeAllSelectedCategories');
      this.$store.dispatch('addSelectedCategory', this.item);
    },
    editBudget() {
      this.amount = Number(this.item.budgeted);
      this.edit = true;
      this.$nextTick(() => {
        this.$refs.edit.select();
      });
    },
    hideBudgetInput() {
      this.amount = Number(this.item.budgeted);
      this.edit = false;
    },
    formatBudgetInput() {
      this.check();
      this.amount = this.amount.toString().replace(/\./g, ',');
      this.$nextTick(() => {
        this.$refs.edit.select();
      });
    },
    async saveBudget() {
      this.amount = parseFloat(this.amount.replace(/[^0-9,-]+/g, '').replace(/\s/g, '').replace(',', '.'));
      this.amount = this.amount ? this.amount : 0;

      if (this.amount !== Number(this.item.budgeted)) {
        try {
          this.item.available = Number(this.item.available) + (this.amount - Number(this.item.budgeted));
          this.item.budgeted = this.amount;
          this.$store.dispatch('removeAllSelectedCategories');
          this.$store.dispatch('addSelectedCategory', this.item);
          await this.$store.dispatch('updateBudgeted', this.budgetedData);
          this.getBudget();
        } catch (error) {
          this.$toasted.error('There was an error editing the budget.');
        }
      }

      this.hideBudgetInput();
    },
    showActivity() {
      this.$modal.show(this.modalNameActivity);
    },
    changeAvailable() {
      if (this.item.available > 0) {
        this.moveAvailable();
      } else if (this.item.available < 0) {
        this.coverAvailable();
      }
    },
    moveAvailable() {
      this.$modal.show(this.modalNameMoveAvailable);
    },
    coverAvailable() {
      this.$modal.show(this.modalNameCoverAvailable);
    },
    async getBudget() {
      try {
        this.$store.dispatch('getToBeBudgeted', this.budgetDate);
        this.$store.dispatch('getBudgetedLastMonth', this.budgetDate);
        await this.$store.dispatch('getBudgetList', this.budgetDate);
      } catch (error) {
        this.$toasted.error('There was an error getting the budget list.');
      }
    }
  }
};
</script>


