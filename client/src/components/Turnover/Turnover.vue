<template>
  <div class="ynab-u content">
    <div class="register-flex-columns">
     <turnover-header @delete="onDelete()" @copy="onCopy()" @add="showAddRow()" :accountid="accountid"></turnover-header>
     <turnover-table ref="turnoverTable" :accountid="accountid" :turnovers="turnovers"></turnover-table>
   </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import TurnoverHeader from './TurnoverHeader';
import TurnoverTable from './TurnoverTable';

export default {
  components: {
    TurnoverHeader,
    TurnoverTable
  },
  props: [
    'accountid'
  ],
  computed: {
    ...mapGetters([
      'budgetId',
      'turnovers'
    ])
  },
  watch: {
    accountid: function () {
      this.$refs.turnoverTable.unselectAllRows();
      this.$refs.turnoverTable.hideAddRow();
      this.getTurnovers();
    }
  },
  methods: {
    showAddRow() {
      this.$refs.turnoverTable.showAddRow();
    },
    onDelete() {
      this.$refs.turnoverTable.uncheck();
      this.getTurnovers();
    },
    onCopy() {
      this.$refs.turnoverTable.unselectAllRows();
      this.$refs.turnoverTable.hideAddRow();
      this.getTurnovers();
    },
    getTurnovers() {
      try {
        this.$store.dispatch('initSelectedTurnovers');
        if (this.accountid) {
          this.$store.dispatch('getTurnovers', { accountid: this.accountid });
        } else {
          this.$store.dispatch('getTurnovers');
        }
      } catch (error) {
        this.$toasted.error('There was an error getting the turnovers.');
      }
    }
  },
  created() {
    this.$store.dispatch('getCategories');
    this.$store.dispatch('getCategoryGroups');
    this.$store.dispatch('getPayees');
    this.getTurnovers();
  },
};
</script>
