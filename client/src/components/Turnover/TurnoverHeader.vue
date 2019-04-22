<template>
  <header class="accounts-header">
      <div class="accounts-header-top">
        <div class="accounts-header-total">
          <div class="accounts-header-total-inner">
            <div class="accounts-header-total-inner-label right-section-headers-count-NaN">
                {{ accountName }}
            </div>
            <div class="arrow"></div>
          </div>
        </div>
        <div class="accounts-header-balances">
          <div class="accounts-header-balances-cleared">
            <div class="accounts-header-balances-label">Balance</div>
              <span class="currency"
                    :class="[accountBalance < 0 ? 'negative' : '']"
                >
                {{ accountBalance | currency }}
              </span>
          </div>
        </div>
      </div>
      <div class="accounts-toolbar">
        <div class="accounts-toolbar-left">
          <button @click="addRow()" class="add-transaction button">
            <i class="fa fa-plus-circle"></i>
            Add a turnover
          </button>
          <button @click="deleteTurnover()" class="accounts-toolbar-edit-transaction button">
            <i class="fa fa-trash-o"></i>
            Delete
          </button>
          <button @click="showCopyModal()" class="accounts-toolbar-edit-transaction button">
            <i class="fa fa-clone"></i>
            Copy
          </button>
          <!-- <button @click="showImportModal()" class="accounts-toolbar-file-import-transactions button">
            <i class="fa fa-upload"></i>
            Import
          </button> -->
        </div>
        <div class="accounts-toolbar-right">
          <div class="transaction-search">
            <div class="transaction-search-inner">
              <i class="transaction-search-magnifying-icon fa fa-search"
                 title="All dates ':' - separate keywords ';'"
              ></i>
              <input
                spellcheck="false"
                type="text"
                class="transaction-search-input"
                v-model="searchText"
                :placeholder="searchPlaceholder"
                @keyup.esc="clearSearch()"
                @keyup.enter="search()">
              <i v-if="searchText" class="fa fa-times transaction-search-cancel-icon" @click="clearSearch()"></i>
            </div>
          </div>
          <el-date-picker
            v-model="dateFilter"
            type="daterange"
            align="right"
            unlink-panels
            :picker-options="pickerOptions"
            @change="setDate()"
            @focus="initDate()">
          </el-date-picker>
          <button class="accounts-toolbar-all-dates button">
            {{ formattedStartdate }} - {{ formattedEnddate }}
            <i class="fa fa-caret-down"></i>
          </button>
        </div>
      </div>
      <modal-copy-turnover @saved="copyTurnover"></modal-copy-turnover>
      <modal-import-turnover @saved="onImportSaved"></modal-import-turnover>
  </header>
</template>

<script>
import { mapGetters } from 'vuex';
import { HTTP } from '@/common/utilities';
import moment from 'moment';
import ModalCopyTurnover from './ModalCopyTurnover';
import ModalImportTurnover from './ModalImportTurnover';

export default {
  components: {
    ModalCopyTurnover,
    ModalImportTurnover
  },
  props: [
    'accountid'
  ],
  data() {
    const self = this;
    return {
      searchText: '',
      dateFilter: [],
      pickerOptions: {
        shortcuts: [{
          text: 'This Month',
          onClick(picker) {
            const end = moment().endOf('month').toDate();
            const start = moment().startOf('month').toDate();
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: 'Last Month',
          onClick(picker) {
            const end = moment().subtract(1, 'month').endOf('month').toDate();
            const start = moment().subtract(1, 'month').startOf('month').toDate();
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: 'Last 3 months',
          onClick(picker) {
            const end = new Date();
            const start = moment().subtract(2, 'month').startOf('month').toDate();
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: 'Last 12 months',
          onClick(picker) {
            const end = new Date();
            const start = moment().subtract(11, 'month').startOf('month').toDate();
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: 'This Year',
          onClick(picker) {
            const end = moment(moment(new Date()).year().toString() + '1231').toDate();
            const start = moment(moment(new Date()).year().toString() + '0101').toDate();
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: 'Last Year',
          onClick(picker) {
            const end = moment(moment(new Date()).year().toString() + '1231').subtract(1, 'year').toDate();
            const start = moment(moment(new Date()).year().toString() + '0101').subtract(1, 'year').toDate();
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: 'All Dates',
          async onClick(picker) {
            const response = await HTTP.get(`/api/${self.budgetId}/turnovers/minmaxdate`);
            const end = moment(response.data.max).toDate();
            const start = moment(response.data.min).toDate();
            picker.$emit('pick', [start, end]);
          }
        }]
      }
    };
  },
  computed: {
    ...mapGetters([
      'budgetId',
      'accounts',
      'selectedTurnovers',
      'turnoverStartdate',
      'turnoverEnddate',
      'turnovers',
      'turnoverSearchstring'
    ]),
    accountName() {
      const obj = this.accounts.find(o => o.id === Number(this.accountid));
      return obj ? obj.name : 'All Accounts';
    },
    accountBalance() {
      const obj = this.accounts.find(o => o.id === Number(this.accountid));
      return obj ? obj.balance : this.accounts.reduce((a, b) => a + Number(b.balance), 0);
    },
    formattedStartdate() {
      return moment(this.turnoverStartdate).format('MMM YYYY');
    },
    formattedEnddate() {
      return moment(this.turnoverEnddate).format('MMM YYYY');
    },
    searchPlaceholder() {
      return `Search ${this.accountName}`;
    }
  },
  watch: {
    searchText: function () {
      this.search();
    },
    accountid: function () {
      this.searchText = null;
      this.search();
    }
  },
  methods: {
    initDate() {
      this.dateFilter = [
        moment(this.turnoverStartdate).toDate(),
        moment(this.turnoverEnddate).toDate(),
      ];
    },
    setDate() {
      const dates = [
        moment(this.dateFilter[0]).format('YYYYMMDD'),
        moment(this.dateFilter[1]).format('YYYYMMDD'),
      ];
      this.$store.dispatch('setTurnoverDate', dates);
      this.getTurnovers();
    },
    addRow() {
      this.$emit('add');
    },
    clearSearch() {
      this.searchText = '';
      this.search();
    },
    search() {
      this.$store.dispatch('setTurnoverSearchstring', this.searchText);
      this.getTurnovers();
    },
    showCopyModal() {
      if (this.selectedTurnovers.length === 0) {
        this.$toasted.show('No turnovers selected.');
      } else {
        this.$modal.show('modal-copy-turnover');
      }
    },
    showImportModal() {
      if (this.accountid) {
        this.$modal.show('modal-import-turnover');
      } else {
        this.$toasted.show('Import is only available for a single account.');
      }
    },
    async deleteTurnover() {
      if (this.selectedTurnovers.length === 0) {
        this.$toasted.show('No turnovers selected.');
      } else {
        await this.$store.dispatch('deleteTurnovers', this.selectedTurnovers);
        this.$store.dispatch('getAccounts');
        this.$emit('delete');
      }
    },
    async copyTurnover(data) {
      await HTTP.post('/api/turnovers/copy', data);
      this.$store.dispatch('getAccounts');
      this.$emit('copy');
    },
    onImportSaved() {
      this.$store.dispatch('getAccounts');
      this.getTurnovers();
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
  },
  created() {
    this.searchText = null;
    this.search();
  }
};
</script>

