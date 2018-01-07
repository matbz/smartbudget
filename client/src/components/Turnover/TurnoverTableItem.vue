<template>
  <div v-if="!isEdit" class="ynab-grid-body-row ynab-grid-body-parent" :class="{ 'is-checked': checked, 'is-new': showImported }">
    <div class="ynab-grid-cell ynab-grid-cell-checkbox">
      <button class="ynab-checkbox-button" @click="toggleChecked()">
        <div class="flaticon stroke ynab-checkbox-button-square"
            :class="{ 'is-checked': checked }"></div>
      </button>
    </div>
    <div class="ynab-grid-cell ynab-grid-cell-notification">
      <button v-if="!turnover.category_id"
              class="transaction-notification transaction-notification-warning fa fa-exclamation-circle"></button>
    </div>
    <div class="ynab-grid-cell ynab-grid-cell-accountName" @click="toggleEdit()">
      <span class="user-entered-text">{{ turnover.account_name }}</span>
    </div>
    <div class="ynab-grid-cell ynab-grid-cell-date" @click="toggleEdit()">
      <span class="user-entered-text">{{ turnover.turnover_date }}</span>
    </div>
    <div class="ynab-grid-cell ynab-grid-cell-payeeName" @click="toggleEdit()">
      <span class="user-entered-text" :title="turnover.payee">{{ turnover.payee }}</span>
    </div>
    <div class="ynab-grid-cell ynab-grid-cell-subCategoryName" @click="toggleEdit()">
      <span v-if="turnover.category_name" class="user-entered-text" :title="turnover.category_name">{{ turnover.category_name }}</span>
      <i v-else class="needs-category">This needs a category</i>
    </div>
    <div class="ynab-grid-cell ynab-grid-cell-memo" @click="toggleEdit()">
      <span class="user-entered-text" :title="turnover.note">{{ turnover.note }}</span>
    </div>
    <div class="ynab-grid-cell ynab-grid-cell-inflow" @click="toggleEdit()">
      <span
        class="currency"
        :class="[turnover.amount < 0 ? 'negative' : 'positive']"
      >
        {{ turnover.amount | currency }}
      </span>
    </div>
    <div class="ynab-grid-cell ynab-grid-cell-cleared">
      <i class="fa"
         :class="[turnover.source === 'M' ? 'fa-pencil-square-o': 'fa-cloud-upload']"
         :title="[turnover.source === 'M' ? 'Manual': 'Import']"
      ></i>
    </div>
  </div>
  <turnover-table-add-row v-else :accountid="accountid" :propTurnover="turnover" @cancel="toggleEdit()"></turnover-table-add-row>
</template>

<script>
import { mapGetters } from 'vuex';
import moment from 'moment';
import TurnoverTableAddRow from './TurnoverTableAddRow';

export default {
  components: {
    TurnoverTableAddRow
  },
  props: [
    'accountid',
    'turnover'
  ],
  data() {
    return {
      isEdit: false,
      checked: false
    };
  },
  computed: {
    ...mapGetters([
      'turnoverImportDate'
    ]),
    showImported() {
      if (this.turnoverImportDate === null || this.turnoverImportDate === '') {
        return false;
      }

      return moment(this.turnover.imported_date).format('YYYY-MM-DD') === this.turnoverImportDate;
    }
  },
  methods: {
    toggleEdit() {
      this.isEdit = !this.isEdit;
    },
    toggleChecked() {
      if (this.checked) {
        this.$store.dispatch('removeFromSelectedTurnovers', this.turnover.id);
      } else {
        this.$store.dispatch('addToSelectedTurnovers', this.turnover.id);
      }

      this.checked = !this.checked;
    },
    check() {
      this.checked = true;
    },
    uncheck() {
      this.checked = false;
    }
  }
};
</script>
