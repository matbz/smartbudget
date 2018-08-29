<template>
  <header
    class="budget-header left-to-budget-is-positive"
    :class="headerCurrencyClass"
  >
    <div class="budget-header-flexbox">
        <div class="budget-header-item budget-header-calendar">
          <i class="fa fa-chevron-circle-left budget-header-calendar-prev" @click="goToLastMonth()"></i>
          <div class="budget-header-calendar-date">
            <button class="budget-header-calendar-date-button">
              {{ budgetDateFormatted }}
            </button>
            <i class="fa fa-caret-down"></i>
            <el-date-picker
              v-model="datepickerDate"
              type="month"
              popper-class="sb-datepicker"
              :clearable="false"
              @change="setDate()"
              @focus="initDate()">
            </el-date-picker>
          </div>
          <i class="fa fa-chevron-circle-right budget-header-calendar-next" @click="goToNextMonth()"></i>
        </div>
        <div class="budget-header-item budget-header-totals">
          <div class="budget-header-totals-amount-flexbox" style="cursor: pointer" @click="changeAvailable()">
              <div class="budget-header-totals-amount">
                <div class="budget-header-totals-amount-value" style="cursor: pointer">
                    <button class="left-to-budget" style="cursor: pointer">
                      {{ toBeBudgeted | currency }}
                    </button>
                </div>
                <div class="budget-header-totals-amount-label">To be Budgeted</div>
              </div>
          </div>
        </div>
        <div class="budget-header-item budget-header-days">
        </div>
    </div>
    <div class="budget-toolbar">
        <button title="Add Category Group" class="budget-toolbar-add-category button" @click="addCategoryGroup()">
          <i class="fa fa-plus-circle"></i>
          Category Group
        </button>
    </div>

    <modal-move-available :mode="'tbb'" :name="modalNameMoveAvailable" :categoryid="tbbId" :available="toBeBudgeted" @closed="refreshInspector"></modal-move-available>
    <modal-cover-available :mode="'tbb'" :name="modalNameCoverAvailable" :categoryid="tbbId" :available="toBeBudgeted" @closed="refreshInspector"></modal-cover-available>
    <modal-add-category-group></modal-add-category-group>
  </header>
</template>

<script>
import { mapGetters } from 'vuex';
import moment from 'moment';
import ModalAddCategoryGroup from './ModalAddCategoryGroup';
import ModalMoveAvailable from './ModalMoveAvailable';
import ModalCoverAvailable from './ModalCoverAvailable';

export default {
  components: {
    ModalAddCategoryGroup,
    ModalMoveAvailable,
    ModalCoverAvailable
  },
  data() {
    return {
      datepickerDate: null
    };
  },
  computed: {
    ...mapGetters([
      'budgetDate',
      'toBeBudgeted',
      'categories',
      'tbbId'
    ]),
    budgetDateFormatted() {
      return moment(this.budgetDate).format('MMM YYYY');
    },
    headerCurrencyClass() {
      return this.toBeBudgeted >= 0 ?
              'left-to-budget-is-positive' :
              'left-to-budget-is-negative';
    },
    modalNameMoveAvailable() {
      return `move-available-${this.tbbId}`;
    },
    modalNameCoverAvailable() {
      return `cover-available-${this.tbbId}`;
    },
    toBeBudgetedCategoryId() {
      const toBeBudgetedCategory = this.categories.filter(e => e.position === -1);
      if (toBeBudgetedCategory.length > 0) {
        return toBeBudgetedCategory[0].id;
      }
    }
  },
  methods: {
    goToLastMonth() {
      const date = moment(this.budgetDate).subtract(1, 'months').format('YYYYMM01');
      this.navigate(date);
    },
    goToNextMonth() {
      const date = moment(this.budgetDate).add(1, 'months').format('YYYYMM01');
      this.navigate(date);
    },
    initDate() {
      this.datepickerDate = moment(this.budgetDate).toDate();
    },
    setDate() {
      if (this.datepickerDate) {
        const date = moment(this.datepickerDate).format('YYYYMM01');
        this.navigate(date);
      }
    },
    navigate(date) {
      this.$store.dispatch('setBudgetDate', date);
      this.$router.push({ name: 'budget_date', params: { date: moment(this.budgetDate).format('YYYYMM') } });
    },
    addCategoryGroup() {
      this.$modal.show('modal-add-category-group');
    },
    changeAvailable() {
      if (this.toBeBudgeted > 0) {
        this.moveAvailable();
      } else if (this.toBeBudgeted < 0) {
        this.coverAvailable();
      }
    },
    moveAvailable() {
      this.$modal.show(this.modalNameMoveAvailable);
    },
    coverAvailable() {
      this.$modal.show(this.modalNameCoverAvailable);
    },
    refreshInspector() {
      this.$store.dispatch('removeAllSelectedCategories');
    }
  }
};
</script>
