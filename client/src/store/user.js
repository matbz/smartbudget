import Vue from 'vue';
import Vuex from 'vuex';

import jwtDecode from 'jwt-decode';
import { HTTP } from '@/common/utilities';

Vue.use(Vuex);

const SET_USER = 'SET_USER';
const STORE_TOKEN = 'STORE_TOKEN';
const LOGOUT_USER = 'LOGOUT_USER';

const user = {
  namespaced: false,
  state: {
    user: null,
    token: null,
  },
  mutations: {
    SET_USER(state, data) {
      state.user = {
        id: data.id,
        username: data.username
      };
    },
    STORE_TOKEN(state, token) {
      state.token = token;
      localStorage.setItem('token', token);
    },
    LOGOUT_USER(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
    }
  },
  actions: {
    async setUserAndToken({ commit }, data) {
      try {
        const decoded = jwtDecode(data.token);
        commit(SET_USER, decoded);
        commit(STORE_TOKEN, data.token);
      } catch (error) {
        throw new Error(error);
      }
    },
    async login({ dispatch }, credentials) {
      try {
        const response = await HTTP.post('/api/users/login', {
          username: credentials.username,
          password: credentials.password
        });
        return await dispatch('setUserAndToken', { token: response.data.token });
      } catch (error) {
        throw new Error(error);
      }
    },
    async logout({ commit }) {
      try {
        commit(LOGOUT_USER);
      } catch (error) {
        throw new Error(error);
      }
    }
  },
  getters: {
    user(state) {
      return state.user;
    },
    token(state) {
      return state.token;
    }
  }
};

export default user;
