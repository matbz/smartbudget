import Vue from 'vue';
import Vuex from 'vuex';
import { HTTP } from '@/common/utilities';
import moment from 'moment';

Vue.use(Vuex);

const SET_BUDGET_LIST = 'SET_BUDGET_LIST';
const SET_BUDGET_ID = 'SET_BUDGET_ID';
const SET_BUDGET_DATE = 'SET_BUDGET_DATE';
const SET_TOBEBUDGETED = 'SET_TOBEBUDGETED';
const SET_BUDGETEDLASTMONTH = 'SET_BUDGETEDLASTMONTH';
const SET_AVGSPENT = 'SET_AVGSPENT';
const SET_HIDDEN = 'SET_HIDDEN';
const ADD_SELECTEDCATEGORY = 'ADD_SELECTEDCATEGORY';
const REMOVE_SELECTEDCATEGORY = 'REMOVE_SELECTEDCATEGORY';
const REMOVE_ALLSELECTEDCATEGORIES = 'REMOVE_ALLSELECTEDCATEGORIES';

const budget = {
  namespaced: false,
  state: {
    budgetList: [],
    budgetId: null,
    budgetDate: moment(new Date()).format('YYYYMM01'),
    toBeBudgeted: 0,
    budgetedLastMonth: 0,
    avgSpent: 0,
    isHidden: false,
    selectedCategories: []
  },
  mutations: {
    SET_BUDGET_LIST(state, budgetList) {
      state.budgetList = budgetList;
    },
    SET_BUDGET_ID(state, id) {
      state.budgetId = id;
    },
    SET_BUDGET_DATE(state, date) {
      state.budgetDate = date;
    },
    SET_TOBEBUDGETED(state, amount) {
      state.toBeBudgeted = amount;
    },
    SET_BUDGETEDLASTMONTH(state, amount) {
      state.budgetedLastMonth = amount;
    },
    SET_AVGSPENT(state, amount) {
      state.avgSpent = amount;
    },
    SET_HIDDEN(state, isHidden) {
      state.isHidden = isHidden;
    },
    ADD_SELECTEDCATEGORY(state, category) {
      state.selectedCategories.push(category);
    },
    REMOVE_SELECTEDCATEGORY(state, category) {
      state.selectedCategories = state.selectedCategories.filter(c => c.category_id !== category.category_id);
    },
    REMOVE_ALLSELECTEDCATEGORIES(state) {
      state.selectedCategories = [];
    }
  },
  actions: {
    async getBudgetList({ commit, getters }, budgetDate) {
      try {
        const catresponse = await HTTP.get(`/api/${getters.budgetId}/categories`);
        const cats = catresponse.data.filter(e => e.name !== 'To be Budgeted');

        const budresponse = await HTTP.get(`/api/${getters.budgetId}/allcategoriesbudgeted/${budgetDate}`);
        const buds = budresponse.data;

        if (buds.length > 0) {
          cats.forEach(c => {
            const found = buds.some(el => el.category_id === c.id);
            if (!found) {
              const cdata = {
                categoryId: Number(c.id),
                budgetedDate: budgetDate,
                amount: 0
              };

              HTTP.put(`/api/categoriesbudgeted/${c.id}/${budgetDate}`, cdata);
            }
          });
        }

        const response = await HTTP.get(`/api/${getters.budgetId}/budgets/list/${budgetDate}`);
        commit(SET_BUDGET_LIST, response.data);
        const isHidden = await HTTP.get(`/api/${getters.budgetId}/budgets/hidden`);
        if (Number(isHidden.data.count) === 0) {
          commit(SET_HIDDEN, false);
        } else {
          commit(SET_HIDDEN, true);
        }
      } catch (error) {
        throw new Error(error);
      }
    },
    async getBudgetId({ commit }, data) {
      try {
        const response = await HTTP.get(`/api/budgets/active?userid=${data.id}`);
        commit(SET_BUDGET_ID, response.data.id);
      } catch (error) {
        throw new Error(error);
      }
    },
    async setBudgetDate({ commit }, date) {
      commit(SET_BUDGET_DATE, date);
    },
    async getToBeBudgeted({ commit, getters }, budgetDate) {
      try {
        const response = await HTTP.get(`/api/${getters.budgetId}/budgets/tobebudgeted/${budgetDate}`);
        commit(SET_TOBEBUDGETED, response.data.tobebudgeted);
      } catch (error) {
        throw new Error(error);
      }
    },
    async getBudgetedLastMonth({ commit, getters }, budgetDate) {
      try {
        const response = await HTTP.get(`/api/${getters.budgetId}/budgets/budgetedlastmonth/${budgetDate}`);
        commit(SET_BUDGETEDLASTMONTH, response.data.budgetedlastmonth);
      } catch (error) {
        throw new Error(error);
      }
    },
    async getAvgSpent({ commit, getters }, budgetDate) {
      try {
        const startdate = moment(budgetDate).subtract(12, 'month').format('YYYYMMDD');
        const response = await HTTP.get(`/api/${getters.budgetId}/budgets/avgspenttotal/${startdate}/${budgetDate}`);
        let avg = 0;
        if (response.data.avgspent < 0) {
          avg = response.data.avgspent * -1;
        } else {
          avg = response.data.avgspent;
        }
        avg = avg.toFixed(2);
        commit(SET_AVGSPENT, avg);
      } catch (error) {
        throw new Error(error);
      }
    },
    backupBudget({ getters }, user) {
      window.open(process.env.API_URL + `/api/${getters.budgetId}/budgets/backup?userid=${user.id}&username=${user.username}`);
    },
    addSelectedCategory({ commit }, category) {
      commit(ADD_SELECTEDCATEGORY, category);
    },
    removeSelectedCategory({ commit }, category) {
      commit(REMOVE_SELECTEDCATEGORY, category);
    },
    removeAllSelectedCategories({ commit }) {
      commit(REMOVE_ALLSELECTEDCATEGORIES);
    }
  },
  getters: {
    budgetList(state) {
      return state.budgetList;
    },
    budgetId(state) {
      return state.budgetId;
    },
    budgetDate(state) {
      return state.budgetDate;
    },
    toBeBudgeted(state) {
      return state.toBeBudgeted;
    },
    budgetedLastMonth(state) {
      return state.budgetedLastMonth;
    },
    avgSpent(state) {
      return state.avgSpent;
    },
    isHidden(state) {
      return state.isHidden;
    },
    selectedCategories(state) {
      return state.selectedCategories;
    }
  }
};

export default budget;
