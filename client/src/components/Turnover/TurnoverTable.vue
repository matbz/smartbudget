<template>
  <div class="ynab-grid ynab-grid-show-notification">
      <turnover-table-header ref="turnovertableheader" :accountid="accountid" @checked="selectAllRows()" @unchecked="unselectAllRows()"></turnover-table-header>
      <turnover-table-add-row :accountid="accountid" @cancel="hideAddRow()" v-if="isAdding"></turnover-table-add-row>
      <div class="ynab-grid-container">
        <div class="ynab-grid-body">
            <div class="ynab-grid-body-row-top">
              <div class="ynab-grid-cell ynab-grid-cell-checkbox"></div>
              <div class="ynab-grid-cell ynab-grid-cell-notification"></div>
              <div class="ynab-grid-cell ynab-grid-cell-accountName"></div>
              <div class="ynab-grid-cell ynab-grid-cell-date"></div>
              <div class="ynab-grid-cell ynab-grid-cell-payeeName"></div>
              <div class="ynab-grid-cell ynab-grid-cell-subCategoryName"></div>
              <div class="ynab-grid-cell ynab-grid-cell-memo"></div>
              <div class="ynab-grid-cell ynab-grid-cell-inflow"></div>
              <div class="ynab-grid-cell ynab-grid-cell-cleared"></div>
            </div>
            <turnover-table-item
              v-for="turnover in turnovers"
              :turnover="turnover"
              :accountid="accountid"
              :key="turnover.id"
              :ref="turnover.id"
            ></turnover-table-item>
            <div v-if="turnoverSearchstring && total !== 0" class="ynab-grid-body-row-top border-style">
              <div class="ynab-grid-cell ynab-grid-cell-checkbox"></div>
              <div class="ynab-grid-cell ynab-grid-cell-notification"></div>
              <div class="ynab-grid-cell ynab-grid-cell-accountName"></div>
              <div class="ynab-grid-cell ynab-grid-cell-date"></div>
              <div class="ynab-grid-cell ynab-grid-cell-payeeName"></div>
              <div class="ynab-grid-cell ynab-grid-cell-subCategoryName"></div>
              <div class="ynab-grid-cell ynab-grid-cell-memo"></div>
              <div class="ynab-grid-cell ynab-grid-cell-inflow padding-inflow">
                <span class="total">Total:</span>
                <span
                  class="currency"
                  :class="[total < 0 ? 'negative' : 'positive']"
                >
                  {{ total | currency }}
                </span>
              </div>
              <div class="ynab-grid-cell ynab-grid-cell-cleared"></div>
            </div>
            <div class="ynab-grid-body-row-bottom" style="height: 30px;">
              <div class="ynab-grid-cell ynab-grid-cell-checkbox"></div>
              <div class="ynab-grid-cell ynab-grid-cell-notification"></div>
              <div class="ynab-grid-cell ynab-grid-cell-accountName"></div>
              <div class="ynab-grid-cell ynab-grid-cell-date"></div>
              <div class="ynab-grid-cell ynab-grid-cell-payeeName"></div>
              <div class="ynab-grid-cell ynab-grid-cell-subCategoryName"></div>
              <div class="ynab-grid-cell ynab-grid-cell-memo"></div>
              <div class="ynab-grid-cell ynab-grid-cell-inflow"></div>
              <div class="ynab-grid-cell ynab-grid-cell-cleared"></div>
            </div>
          </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import TurnoverTableHeader from './TurnoverTableHeader';
import TurnoverTableAddRow from './TurnoverTableAddRow';
import TurnoverTableItem from './TurnoverTableItem';

export default {
  components: {
    TurnoverTableHeader,
    TurnoverTableAddRow,
    TurnoverTableItem
  },
  props: [
    'accountid',
    'turnovers',
    'selectedTurnovers'
  ],
  data() {
    return {
      isAdding: false
    };
  },
  computed: {
    ...mapGetters([
      'turnoverSearchstring'
    ]),
    total() {
      return this.turnovers.reduce((total, e) => {
        return total + Number(e.amount);
      }, 0);
    }
  },
  methods: {
    showAddRow() {
      this.isAdding = true;
    },
    hideAddRow() {
      this.isAdding = false;
    },
    selectAllRows() {
      Object.keys(this.$refs).forEach(e => {
        if (this.$refs[e][0]) {
          this.$refs[e][0].check();
        }
      });
    },
    unselectAllRows() {
      Object.keys(this.$refs).forEach(e => {
        if (this.$refs[e][0]) {
          this.$refs[e][0].uncheck();
        }
      });

      this.$refs.turnovertableheader.uncheck();
    },
    uncheck() {
      this.$refs.turnovertableheader.uncheck();
    }
  }
};
</script>

<style scoped>
  .border-style {
    border-top: 2px solid #dfe4e9
  }

  .padding-inflow {
    padding-top: .5em;
    font-weight: 600;
  }

  .total {
    padding-right: .5em;
    font-weight: 600;
  }
</style>

