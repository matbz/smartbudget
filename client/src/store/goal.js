import Vue from 'vue';
import Vuex from 'vuex';
import { HTTP } from '@/common/utilities';

Vue.use(Vuex);

const SET_GOALS = 'SET_GOALS';

const goal = {
  namespaced: false,
  state: {
    goals: {},
    selectedTurnovers: [],
    payees: []
  },
  mutations: {
    SET_GOALS(state, data) {
      state.goals = data;
    }
  },
  actions: {
    async getGoals({ commit, getters }, filter) {
      try {
        let route = `/api/${getters.budgetId}/goals`;

        if (filter) {
          Object.keys(filter).forEach((key, index) => {
            if (index === 0) {
              route += '?';
            } else {
              route += '&';
            }
            route += `${key}=${filter[key]}`;
          });
        }

        const response = await HTTP.get(route);
        commit(SET_GOALS, response.data);
      } catch (error) {
        throw new Error(error);
      }
    }
  },
  getters: {
    goals(state) {
      return state.goals;
    }
  }
};

export default goal;
