import Vue from 'vue';
import Vuex from 'vuex';
import moment from 'moment';
import { HTTP } from '@/common/utilities';

Vue.use(Vuex);

const SET_ACCOUNTS = 'SET_ACCOUNTS';
const SET_CHART_DATE = 'SET_CHART_DATE';

const account = {
  namespaced: false,
  state: {
    accounts: [],
    chartStartdate: moment(new Date()).subtract(11, 'month').format('YYYYMMDD'),
    chartEnddate: moment(moment(new Date())).format('YYYYMMDD')
  },
  mutations: {
    SET_ACCOUNTS(state, data) {
      state.accounts = data;
    },
    SET_CHART_DATE(state, data) {
      state.chartStartdate = data[0];
      state.chartEnddate = data[1];
    },
  },
  actions: {
    async getAccounts({ commit, getters }) {
      try {
        const response = await HTTP.get(`/api/${getters.budgetId}/accounts`);
        commit(SET_ACCOUNTS, response.data);
      } catch (error) {
        throw new Error(error);
      }
    },
    async createAccount({ getters }, data) {
      try {
        await HTTP.post(`/api/${getters.budgetId}/accounts`, data);
      } catch (error) {
        throw new Error(error);
      }
    },
    async updateAccount({ getters }, data) {
      try {
        await HTTP.put(`/api/accounts/${data.id}`, data);
      } catch (error) {
        throw new Error(error);
      }
    },
    setChartDate({ commit }, data) {
      commit(SET_CHART_DATE, data);
    }
  },
  getters: {
    accounts(state) {
      return state.accounts;
    },
    chartStartdate(state) {
      return state.chartStartdate;
    },
    chartEnddate(state) {
      return state.chartEnddate;
    }
  }
};

export default account;
