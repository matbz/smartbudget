<template>
  <div class="ynab-grid-header">
    <div class="ynab-grid-header-row">
        <div class="ynab-grid-header-cell ynab-grid-cell-checkbox" @click="toggleChecked()">
          <div class="ynab-checkbox">
              <button class="ynab-checkbox-button">
                <div class="flaticon stroke ynab-checkbox-button-square" :class="{ 'is-checked': allChecked }"></div>
              </button>
          </div>
        </div>
        <div class="ynab-grid-header-cell ynab-grid-cell-notification">
          <i class="fa fa-exclamation-circle"></i>
        </div>
        <div class="ynab-grid-header-cell ynab-grid-cell-accountName" :class="{ 'is-sorting': turnoverOrderName === 'account' }" @click="sort('account')">
          <i v-if="turnoverOrderName === 'account' && turnoverOrderDirection === 'desc'" class="fa fa-caret-down sort-icon"></i>
          <i v-if="turnoverOrderName === 'account' && turnoverOrderDirection === 'asc'" class="fa fa-caret-up sort-icon"></i>
          ACCOUNT
        </div>
        <div class="ynab-grid-header-cell ynab-grid-cell-date" :class="{ 'is-sorting': turnoverOrderName === 'date' }" @click="sort('date')">
          <i v-if="turnoverOrderName === 'date' && turnoverOrderDirection === 'desc'" class="fa fa-caret-down sort-icon"></i>
          <i v-if="turnoverOrderName === 'date' && turnoverOrderDirection === 'asc'" class="fa fa-caret-up sort-icon"></i>
          DATE
        </div>
        <div class="ynab-grid-header-cell ynab-grid-cell-payeeName" :class="{ 'is-sorting': turnoverOrderName === 'payee' }" @click="sort('payee')">
          <i v-if="turnoverOrderName === 'payee' && turnoverOrderDirection === 'desc'" class="fa fa-caret-down sort-icon"></i>
          <i v-if="turnoverOrderName === 'payee' && turnoverOrderDirection === 'asc'" class="fa fa-caret-up sort-icon"></i>
          PAYEE
        </div>
        <div class="ynab-grid-header-cell ynab-grid-cell-subCategoryName" :class="{ 'is-sorting': turnoverOrderName === 'category' }" @click="sort('category')">
          <i v-if="turnoverOrderName === 'category' && turnoverOrderDirection === 'desc'" class="fa fa-caret-down sort-icon"></i>
          <i v-if="turnoverOrderName === 'category' && turnoverOrderDirection === 'asc'" class="fa fa-caret-up sort-icon"></i>
          CATEGORY
        </div>
        <div class="ynab-grid-header-cell ynab-grid-cell-memo" :class="{ 'is-sorting': turnoverOrderName === 'note' }" @click="sort('note')">
          <i v-if="turnoverOrderName === 'note' && turnoverOrderDirection === 'desc'" class="fa fa-caret-down sort-icon"></i>
          <i v-if="turnoverOrderName === 'note' && turnoverOrderDirection === 'asc'" class="fa fa-caret-up sort-icon"></i>
          NOTE
        </div>
        <div class="ynab-grid-header-cell ynab-grid-cell-inflow" :class="{ 'is-sorting': turnoverOrderName === 'amount' }" @click="sort('amount')">
          <i v-if="turnoverOrderName === 'amount' && turnoverOrderDirection === 'desc'" class="fa fa-caret-down sort-icon sort-icon-amount"></i>
          <i v-if="turnoverOrderName === 'amount' && turnoverOrderDirection === 'asc'" class="fa fa-caret-up sort-icon sort-icon-amount"></i>
          AMOUNT
        </div>
        <div class="ynab-grid-header-cell ynab-grid-cell-cleared">
          <i class="turnover-cleared-header fa fa-file-text-o"></i>
        </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  props: [
    'accountid'
  ],
  data() {
    return {
      allChecked: false
    };
  },
  computed: {
    ...mapGetters([
      'turnovers',
      'turnoverOrderName',
      'turnoverOrderDirection'
    ])
  },
  methods: {
    sort(name) {
      const data = {
        name,
        direction: ''
      };

      if (this.turnoverOrderDirection === 'desc') {
        data.direction = 'asc';
      } else {
        data.direction = 'desc';
      }

      this.$store.dispatch('setTurnoverOrder', data);
      this.getTurnovers();
    },
    toggleChecked() {
      this.allChecked = !this.allChecked;

      this.turnovers.forEach(t => {
        this.$store.dispatch('removeFromSelectedTurnovers', t.id);
        if (this.allChecked) {
          this.$store.dispatch('addToSelectedTurnovers', t.id);
        }
      });

      if (this.allChecked) {
        this.$emit('checked');
      } else {
        this.$emit('unchecked');
      }
    },
    uncheck() {
      this.allChecked = false;
    },
    getTurnovers() {
      try {
        if (this.accountid) {
          this.$store.dispatch('getTurnovers', { accountid: this.accountid });
        } else {
          this.$store.dispatch('getTurnovers');
        }
      } catch (error) {
        this.$toasted.error('There was an error getting the turnovers.');
      }
    }
  }
};
</script>
