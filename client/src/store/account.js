import Vue from 'vue';
import Vuex from 'vuex';
import { HTTP } from '@/common/utilities';

Vue.use(Vuex);

const SET_ACCOUNTS = 'SET_ACCOUNTS';

const account = {
  namespaced: false,
  state: {
    accounts: []
  },
  mutations: {
    SET_ACCOUNTS(state, data) {
      state.accounts = data;
    }
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
    }
  },
  getters: {
    accounts(state) {
      return state.accounts;
    }
  }
};

export default account;
