<template>
<div class="add-row">
  <div class="ynab-grid-body-row is-editing is-checked ynab-grid-body-row is-checked is-editing is-adding">
    <div class="ynab-grid-cell ynab-grid-cell-checkbox">
      <div class="ynab-checkbox">
          <button role="checkbox" class="ynab-checkbox-button is-checked">
            <div class="flaticon stroke ynab-checkbox-button-square is-checked"></div>
          </button>
      </div>
    </div>
    <div class="ynab-grid-cell ynab-grid-cell-notification"></div>
    <div class="ynab-grid-cell ynab-grid-cell-accountName">
      <el-select class="turnover-row-select" placeholder="Account" v-model="turnover.accountId" filterable clearable>
        <el-option
          v-for="item in selectDataAccounts"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </div>
    <div class="ynab-grid-cell ynab-grid-cell-date">
      <el-date-picker
        v-model="turnover.turnoverDate"
        type="date"
        placeholder="Date"
        format="dd.MM.yyyy"
        :clearable="true"
        class="ynab-datepicker">
      </el-date-picker>
    </div>
    <div class="ynab-grid-cell ynab-grid-cell-payeeName">
      <el-select class="turnover-row-select" placeholder="Payee" v-model="turnover.payee" filterable clearable allow-create>
        <el-option
          v-for="item in selectDataPayees"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </div>
    <div class="ynab-grid-cell ynab-grid-cell-subCategoryName">
      <el-select class="turnover-row-select" placeholder="Category" v-model="turnover.categoryId" filterable clearable>
        <el-option-group
          v-for="group in selectDataCategories"
          :key="group.label"
          :label="group.label">
          <el-option
            v-for="item in group.categories"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-option-group>
      </el-select>
    </div>
    <div class="ynab-grid-cell ynab-grid-cell-memo" @keyup.esc="hide()" @keyup.enter="save()">
      <input v-model="turnover.note" placeholder="Note" class="accounts-text-field accounts-text-field">
    </div>
    <div class="ynab-grid-cell ynab-grid-cell-inflow">
      <div class="currency-input is-editing" @keyup.esc="hide()" @keyup.enter="save()">
        <vue-numeric
          class="accounts-text-field"
          currency="€"
          currency-symbol-position="suffix"
          separator="."
          v-model="turnover.amount"
          :minus="true"
          :precision="2"
          ></vue-numeric>
      </div>
    </div>
    <div class="ynab-grid-cell ynab-grid-cell-cleared">
      <i
        style="color: white; margin-left: -5px"
        class="fa"
        :class="[turnover.source === 'M' ? 'fa-pencil-square-o': 'fa-cloud-upload']"
        :title="[turnover.source === 'M' ? 'Manual': 'Import']"
      ></i>
    </div>
  </div>
  <div class="ynab-grid-actions ynab-grid-body-row is-add-row">
    <div class="ynab-grid-cell ynab-grid-cell-checkbox">&nbsp;</div>
    <div class="ynab-grid-cell ynab-grid-cell-notification">&nbsp;</div>
    <div class="ynab-grid-cell ynab-grid-cell-accountName">&nbsp;</div>
    <div class="ynab-grid-cell ynab-grid-cell-date">&nbsp;</div>
    <div class="ynab-grid-cell ynab-grid-cell-payeeName">&nbsp;</div>
    <div class="ynab-grid-cell ynab-grid-cell-subCategoryName">&nbsp;</div>
    <div class="ynab-grid-cell ynab-grid-cell-memo">&nbsp;</div>
    <div class="ynab-grid-cell ynab-grid-cell-inflow buttons-container">
      <div class="ynab-grid-actions-buttons">
        <button @click="hide()" class="button button-cancel">
          Cancel
        </button>
        <button @click="save()" class="button button-primary ">
            Save
        </button>
          <button v-if="!propTurnover" @click="saveAndAddAnother()" class="button button-primary button-another">
            Save and add another
          </button>
      </div>
    </div>
    <div class="ynab-grid-cell ynab-grid-cell-cleared">&nbsp;</div>
  </div>
</div>
</template>

<script>
import { mapGetters } from 'vuex';
import { HTTP } from '@/common/utilities';
import moment from 'moment';

export default {
  props: [
    'accountid',
    'propTurnover'
  ],
  data() {
    return {
      turnover: {
        id: this.propTurnover ? this.propTurnover.id : '',
        accountId: this.getAccountId(),
        categoryId: this.getCategoryId(),
        payee: this.propTurnover ? this.propTurnover.payee : '',
        amount: this.propTurnover ? Number(this.propTurnover.amount) : 0,
        turnoverDate: this.propTurnover ? moment(this.propTurnover.turnover_date, 'DD.MM.YYYY').toDate() : new Date(),
        note: this.propTurnover ? this.propTurnover.note : '',
        source: this.propTurnover ? this.propTurnover.source : 'M'
      }
    };
  },
  computed: {
    ...mapGetters([
      'categories',
      'categoryGroups',
      'accounts',
      'payees'
    ]),
    selectDataAccounts() {
      const data = [];
      this.accounts.forEach(e => {
        data.push({
          value: e.id,
          label: e.name
        });
      });
      return data;
    },
    selectDataPayees() {
      const data = [];
      this.payees.forEach(e => {
        data.push({
          value: e.payee,
          label: e.payee
        });
      });
      return data;
    },
    categoriesFiltered() {
      return this.categories.filter(c => !c.is_hidden);
    },
    categoryGroupsFiltered() {
      return this.categoryGroups.filter(cg => !cg.is_hidden);
    },
    selectDataCategories() {
      const data = [];

      this.categoryGroupsFiltered.forEach(cg => {
        const categories = this.categoriesFiltered.filter(c => cg.id === c.categorygroup_id).map(c => {
          return {
            label: c.name,
            value: c.id
          };
        });

        data.push({
          categories: categories,
          label: cg.name
        });
      });
      return data;
    }
  },
  methods: {
    hide() {
      this.resetTurnover(true);
      this.$emit('cancel');
    },
    getAccountId() {
      if (this.accountid) {
        return Number(this.accountid);
      } else if (this.propTurnover) {
        return Number(this.propTurnover.account_id);
      }

      if (this.accounts) {
        return this.accounts[0].id;
      }

      return '';
    },
    getCategoryId() {
      if (this.propTurnover) {
        if (Number(this.propTurnover.category_id) !== 0) {
          return Number(this.propTurnover.category_id);
        }
      }
      return '';
    },
    async save(addAnother) {
      if (this.turnover.accountId && this.turnover.turnoverDate) {
        const date = this.turnover.turnoverDate;
        this.turnover.turnoverDate = moment(this.turnover.turnoverDate).format('YYYYMMDD');

        if (this.propTurnover) {
          await this.$store.dispatch('updateTurnover', this.turnover);
        } else {
          await this.$store.dispatch('createTurnovers', this.turnover);
        }

        if (this.turnover.categoryId !== '' && this.turnover.categoryId !== 0) {
          await this.checkCategoryBudgeted();
        }

        this.$store.dispatch('getAccounts');
        this.$store.dispatch('getPayees');

        if (this.accountid) {
          await this.$store.dispatch('getTurnovers', { accountid: this.accountid });
        } else {
          await this.$store.dispatch('getTurnovers');
        }

        if (!addAnother) {
          this.hide();
        } else {
          this.turnover.turnoverDate = date;
          this.resetTurnover(false);
        }
      } else {
        this.$toasted.error('Account and date is required.');
      }
    },
    async checkCategoryBudgeted() {
      const categoriesBudgeted = await HTTP.get(`/api/categoriesbudgeted?categoryid=${this.turnover.categoryId}&date=${moment(this.turnover.turnoverDate).format('YYYYMM01')}`);
      if (!categoriesBudgeted.data.id) {
        await HTTP.put(`/api/categoriesbudgeted/${this.turnover.categoryId}/${moment(this.turnover.turnoverDate).format('YYYYMM01')}`, { amount: 0 });
      }
    },
    saveAndAddAnother() {
      this.save(true);
    },
    resetTurnover(initDate) {
      Object.keys(this.turnover).forEach(key => {
        if (key !== 'turnoverDate') {
          this.turnover[key] = '';
        }
      });
      if (initDate) {
        this.turnover.turnoverDate = new Date();
      }
      this.turnover.source = 'M';
      this.turnover.amount = 0;
      this.turnover.accountId = this.getAccountId();
    }
  },
  created() {
    this.turnover.accountId = this.getAccountId();
  }
};
</script>
