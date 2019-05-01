<template>
  <div class="ynab-u content">
    <budget-header></budget-header>
    <div class="scroll-wrap" v-on-click-outside="uncheckAll">
      <budget-table :lists="budgetListFiltered"></budget-table>
      <budget-inspector></budget-inspector>
      <modal-hidden-categories></modal-hidden-categories>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { mixin as onClickOutside } from 'vue-on-click-outside';
import moment from 'moment';
import BudgetHeader from './BudgetHeader';
import BudgetTable from './BudgetTable';
import BudgetInspector from './BudgetInspector';
import ModalHiddenCategories from './ModalHiddenCategories';

export default {
  components: {
    BudgetHeader,
    BudgetTable,
    BudgetInspector,
    ModalHiddenCategories
  },
  mixins: [onClickOutside],
  props: [
    'date'
  ],
  computed: {
    ...mapGetters([
      'budgetList',
      'budgetDate'
    ]),
    budgetDateFormatted() {
      return `${this.date}01`;
    },
    budgetListFiltered() {
      const data = [];
      let items = [];

      this.budgetList.forEach(e => {
        if (e.header.categorygroup_is_hidden) {
          return;
        }

        items = e.items.filter(item => !item.category_is_hidden);

        data.push({
          header: e.header,
          items
        });
      });

      return data;
    }
  },
  watch: {
    date: function () {
      this.getBudget();
      this.getTurnovers();
    }
  },
  methods: {
    uncheckAll() {
      this.$store.dispatch('removeAllSelectedCategories');
    },
    async getBudget() {
      // const loader = this.$loading.show({
      //   // Optional parameters
      //   container: this.fullPage ? null : this.$refs.formContainer,
      //   canCancel: false,
      // });
      await this.$store.dispatch('getCategories');

      try {
        if (this.date) {
          this.$store.dispatch('setBudgetDate', this.budgetDateFormatted);
        }

        this.$store.dispatch('getToBeBudgeted', this.budgetDate);
        this.$store.dispatch('getBudgetedLastMonth', this.budgetDate);
        await this.$store.dispatch('getBudgetList', this.budgetDate);
        // loader.hide();
      } catch (error) {
        this.$toasted.error('There was an error getting the budget list.');
      }
    },
    getTurnovers() {
      this.$store.dispatch('getTurnovers', {
        start: this.budgetDate,
        end: moment(this.budgetDate).format('YYYYMM' + moment(this.budgetDate).daysInMonth().toString())
      });
    }
  },
  async created() {
    await this.getBudget();
    this.$store.dispatch('setTBBID');
    this.getTurnovers();
  }
};
</script>
