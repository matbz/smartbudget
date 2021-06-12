<template>
  <modal class="modal-popup modal-budget-activity" :name="name" :width="512" height="auto" :pivot-y="0.2" :pivot-x="0.45" @closed="closed" @opened="opened">
    <div class="modal-content">
      <span class="activity-header">{{ categoryname }}</span>
      <div class="ynab-table-5-col ynab-table" :class="scrollbarClass">
        <div class="ynab-table-head">
          <!-- <div class="ynab-table-col user-data">Account</div> -->
          <div class="ynab-table-col user-data" style="width:30%">Date</div>
          <!-- <div class="ynab-table-col user-data">Payee</div> -->
          <div class="ynab-table-col user-data" style="width:45%">Note</div>
          <div class="amount-column ynab-table-col user-data" style="width:25%">Amount</div>
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
      </button>
      </div>
    </div>
  </modal>
</template>

<script>
import { mapGetters } from 'vuex';
import moment from 'moment';
import ModalActivityRow from './ModalActivityRow';

export default {
  components: {
    ModalActivityRow
  },
  props: [
    'name',
    'categoryid',
    'categoryname',
    'tdate'
  ],
  computed: {
    ...mapGetters([
      'turnovers'
    ]),
    scrollbarClass() {
      if (this.filteredTurnovers.length > 6) {
        return 'has-scrollbar';
      }
    },
    filteredTurnovers() {
      return this.turnovers.filter(t => t.category_id === Number(this.categoryid));
    }
  },
  methods: {
    async opened() {
      await this.getTurnovers();
    },
    closed() {
      this.$emit('closed');
    },
    close() {
      this.$modal.hide(this.name);
    },
    getTurnovers() {
      const startdate = moment(new Date(Number(this.tdate.substring(3, 7)), Number(this.tdate.substring(0, 2)) - 1, 1)).format('YYYYMMDD').toString();
      const enddate = moment(new Date(Number(this.tdate.substring(3, 7)), Number(this.tdate.substring(0, 2)) - 1, 1)).endOf('month').format('YYYYMMDD').toString();
      this.$store.dispatch('getTurnovers', {
        start: startdate,
        end: enddate
      });
    }
  }
};
</script>

