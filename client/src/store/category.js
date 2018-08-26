import Vue from 'vue';
import Vuex from 'vuex';
import { HTTP } from '@/common/utilities';

Vue.use(Vuex);

const SET_CATEGORIES = 'SET_CATEGORIES';
const SET_CATEGORYGROUPS = 'SET_CATEGORYGROUPS';
const SET_TBBID = 'SET_TBBID';

const category = {
  namespaced: false,
  state: {
    categories: [],
    categoryGroups: [],
    tbbId: null
  },
  mutations: {
    SET_CATEGORIES(state, data) {
      state.categories = data;
    },
    SET_CATEGORYGROUPS(state, data) {
      state.categoryGroups = data;
    },
    SET_TBBID(state) {
      const toBeBudgetedCategory = state.categories.filter(e => e.position === -1);
      state.tbbId = toBeBudgetedCategory[0].id;
    }
  },
  actions: {
    async createCategory({ getters }, data) {
      try {
        await HTTP.post('/api/categories', data);
      } catch (error) {
        throw new Error(error);
      }
    },
    async createCategoryGroup({ getters }, data) {
      try {
        await HTTP.post(`/api/${getters.budgetId}/categorygroups`, data);
      } catch (error) {
        throw new Error(error);
      }
    },
    async getCategories({ commit, getters }) {
      try {
        const response = await HTTP.get(`/api/${getters.budgetId}/categories`);
        commit(SET_CATEGORIES, response.data);
      } catch (error) {
        throw new Error(error);
      }
    },
    async getCategoryGroups({ commit, getters }) {
      try {
        const response = await HTTP.get(`/api/${getters.budgetId}/categorygroups`);
        commit(SET_CATEGORYGROUPS, response.data);
      } catch (error) {
        throw new Error(error);
      }
    },
    async updateCategory({ }, data) {
      try {
        await HTTP.put(`/api/categories/${data.id}`, data);
      } catch (error) {
        throw new Error(error);
      }
    },
    async updateCategoryGroup({ }, data) {
      try {
        await HTTP.put(`/api/categorygroups/${data.id}`, data);
      } catch (error) {
        throw new Error(error);
      }
    },
    async updateBudgeted({ }, data) {
      try {
        return await HTTP.put(`/api/categoriesbudgeted/${data.categoryId}/${data.budgetedDate}`, data);
      } catch (error) {
        throw new Error(error);
      }
    },
    async setBudgetedLastMonth({ getters }) {
      try {
        return await HTTP.post(`/api/${getters.budgetId}/categoriesbudgeted/lastmonth/${getters.budgetDate}`);
      } catch (error) {
        throw new Error(error);
      }
    },
    setTBBID({ commit }) {
      commit(SET_TBBID);
    }
  },
  getters: {
    categories(state) {
      return state.categories;
    },
    categoryGroups(state) {
      return state.categoryGroups;
    },
    tbbId(state) {
      return state.tbbId;
    }
  }
};

export default category;
