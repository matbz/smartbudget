import Vue from 'vue';
import Vuex from 'vuex';
import { HTTP } from '@/common/utilities';

Vue.use(Vuex);

const SET_CATEGORIES = 'SET_CATEGORIES';
const SET_CATEGORYGROUPS = 'SET_CATEGORYGROUPS';

const category = {
  namespaced: false,
  state: {
    categories: [],
    categoryGroups: []
  },
  mutations: {
    SET_CATEGORIES(state, data) {
      state.categories = data;
    },
    SET_CATEGORYGROUPS(state, data) {
      state.categoryGroups = data;
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
    }
  },
  getters: {
    categories(state) {
      return state.categories;
    },
    categoryGroups(state) {
      return state.categoryGroups;
    }
  }
};

export default category;
