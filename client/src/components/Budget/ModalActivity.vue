<template>
  <modal class="modal-popup modal-budget-activity" :name="name" :width="512" height="auto" :pivot-y="0.2" :pivot-x="0.45" @closed="closed">
    <div class="modal-content">
      <span class="activity-header">{{ categoryname }}</span>
      <div class="ynab-table-5-col ynab-table" :class="scrollbarClass">
        <div class="ynab-table-head">
          <div class="ynab-table-col user-data">Account</div>
          <div class="ynab-table-col user-data">Date</div>
          <div class="ynab-table-col user-data">Payee</div>
          <div class="ynab-table-col user-data">Memo</div>
          <div class="amount-column ynab-table-col user-data">Amount</div>
        </div>
        <div class="ynab-table-body">
          <modal-activity-row
            v-for="turnover in filteredTurnovers"
            :turnover="turnover"
            :key="turnover.id">
          </modal-activity-row>
        </div>
      </div>
      <div class="modal-actions">
      <button class="button button-primary" @click="close()">
          Close
          <i class="fa fa-check-circle-o"></i>
      </button>
      </div>
    </div>
  </modal>
</template>

<script>
import { mapGetters } from 'vuex';
import ModalActivityRow from './ModalActivityRow';

export default {
  components: {
    ModalActivityRow
  },
  props: [
    'name',
    'categoryid',
    'categoryname'
  ],
  computed: {
    ...mapGetters([
      'turnovers'
    ]),
    filteredTurnovers() {
      if (this.turnovers) {
        return this.turnovers.filter(t => t.category_id === Number(this.categoryid));
      }
    },
    scrollbarClass() {
      if (this.filteredTurnovers.length > 6) {
        return 'has-scrollbar';
      }
    }
  },
  methods: {
    closed() {
      this.$emit('closed');
    },
    close() {
      this.$modal.hide(this.name);
    }
  }
};
</script>

