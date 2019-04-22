import Vue from 'vue';
import Vuex from 'vuex';
import { HTTP } from '@/common/utilities';
import moment from 'moment';

Vue.use(Vuex);

const SET_TURNOVERS = 'SET_TURNOVERS';
const SET_PAYEES = 'SET_PAYEES';
const SELECT_TURNOVER = 'SELECT_TURNOVER';
const UNSELECT_TURNOVER = 'UNSELECT_TURNOVER';
const INIT_SELECTED_TURNOVERS = 'INIT_SELECTED_TURNOVERS';
const SET_TURNOVER_DATE = 'SET_TURNOVER_DATE';
const SET_TURNOVER_SEARCHSTRING = 'SET_TURNOVER_SEARCHSTRING';
const SET_TURNOVER_ORDER = 'SET_TURNOVER_ORDER';
const SET_SHOW_ONLY_IMPORTED_TURNOVERS = 'SET_SHOW_ONLY_IMPORTED_TURNOVERS';
const SET_TURNOVER_IMPORT_DATE = 'SET_TURNOVER_IMPORT_DATE';

const turnover = {
  namespaced: false,
  state: {
    turnovers: [],
    selectedTurnovers: [],
    payees: [],
    turnoverStartdate: moment().subtract(2, 'month').startOf('month').format('YYYYMMDD'),
    turnoverEnddate: moment(new Date()).format('YYYYMMDD'),
    turnoverSearchstring: '',
    turnoverOrderName: 'date',
    turnoverOrderDirection: 'desc',
    showOnlyImportedTurnovers: false,
    turnoverImportDate: null
  },
  mutations: {
    SET_TURNOVERS(state, data) {
      state.turnovers = data;
    },
    SET_PAYEES(state, data) {
      state.payees = data;
    },
    SELECT_TURNOVER(state, id) {
      state.selectedTurnovers.push(id);
    },
    UNSELECT_TURNOVER(state, id) {
      state.selectedTurnovers = state.selectedTurnovers.filter(e => e !== id);
    },
    INIT_SELECTED_TURNOVERS(state) {
      state.selectedTurnovers = [];
    },
    SET_TURNOVER_DATE(state, data) {
      state.turnoverStartdate = data[0];
      state.turnoverEnddate = data[1];
    },
    SET_TURNOVER_SEARCHSTRING(state, data) {
      state.turnoverSearchstring = data;
    },
    SET_TURNOVER_ORDER(state, data) {
      state.turnoverOrderName = data.name;
      state.turnoverOrderDirection = data.direction;
    },
    SET_SHOW_ONLY_IMPORTED_TURNOVERS(state, data) {
      state.showOnlyImportedTurnovers = data;
    },
    SET_TURNOVER_IMPORT_DATE(state, data) {
      state.turnoverImportDate = data;
    }
  },
  actions: {
    async getTurnovers({ commit, getters }, filter) {
      try {
        let route = `/api/${getters.budgetId}/turnovers`;

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

        if (route.indexOf('?') === -1) {
          route += '?';
        } else {
          route += '&';
        }
        const searchStringOriginal = getters.turnoverSearchstring;

        if ((!filter || !filter.start)) {
          if (getters.turnoverSearchstring && getters.turnoverSearchstring.charAt(0) === ':') {
            if (getters.turnoverSearchstring.length > 1) {
              commit(SET_TURNOVER_SEARCHSTRING, getters.turnoverSearchstring.substring(1, getters.turnoverSearchstring.length));
            }
          } else {
            route += `start=${getters.turnoverStartdate}&end=${getters.turnoverEnddate}`;
          }
        }

        if (getters.turnoverSearchstring) {
          route += `&q=${getters.turnoverSearchstring}`;
        }

        if (getters.showOnlyImportedTurnovers) {
          route += '&showimported=true';
        }

        // if (getters.turnoverImportDate) {
        //   route += `&importdate=${getters.turnoverImportDate}`;
        // }

        route += `&orderby=${getters.turnoverOrderName};${getters.turnoverOrderDirection};`;

        const response = await HTTP.get(route);
        commit(SET_TURNOVERS, response.data);
        commit(SET_TURNOVER_SEARCHSTRING, searchStringOriginal);
      } catch (error) {
        throw new Error(error);
      }
    },
    async getPayees({ commit, getters }) {
      try {
        const response = await HTTP.get(`/api/${getters.budgetId}/turnovers/payees`);
        commit(SET_PAYEES, response.data);
      } catch (error) {
        throw new Error(error);
      }
    },
    async createTurnovers({ getters }, data) {
      try {
        await HTTP.post('/api/turnovers', data);
      } catch (error) {
        throw new Error(error);
      }
    },
    async updateTurnover({ getters }, data) {
      try {
        await HTTP.put(`/api/turnovers/${data.id}`, data);
      } catch (error) {
        throw new Error(error);
      }
    },
    async deleteTurnovers({ getters }, data) {
      try {
        let ids = '';

        data.forEach((id, index, array) => {
          ids += `id=${id}`;
          if (index < array.length - 1) {
            ids += '&';
          }
        });

        await HTTP.delete(`/api/turnovers/?${ids}`);
      } catch (error) {
        throw new Error(error);
      }
    },
    addToSelectedTurnovers({ commit }, id) {
      commit(SELECT_TURNOVER, id);
    },
    removeFromSelectedTurnovers({ commit }, id) {
      commit(UNSELECT_TURNOVER, id);
    },
    initSelectedTurnovers({ commit }) {
      commit(INIT_SELECTED_TURNOVERS);
    },
    setTurnoverDate({ commit }, data) {
      commit(SET_TURNOVER_DATE, data);
    },
    setTurnoverSearchstring({ commit }, data) {
      commit(SET_TURNOVER_SEARCHSTRING, data);
    },
    setTurnoverOrder({ commit }, data) {
      commit(SET_TURNOVER_ORDER, data);
    },
    setShowOnlyImportedTurnovers({ commit }, data) {
      commit(SET_SHOW_ONLY_IMPORTED_TURNOVERS, data);
    },
    setTurnoverImportDate({ commit }, data) {
      commit(SET_TURNOVER_IMPORT_DATE, data);
    }
  },
  getters: {
    turnovers(state) {
      return state.turnovers;
    },
    payees(state) {
      return state.payees;
    },
    selectedTurnovers(state) {
      return state.selectedTurnovers;
    },
    turnoverStartdate(state) {
      return state.turnoverStartdate;
    },
    turnoverEnddate(state) {
      return state.turnoverEnddate;
    },
    turnoverSearchstring(state) {
      return state.turnoverSearchstring;
    },
    turnoverOrderName(state) {
      return state.turnoverOrderName;
    },
    turnoverOrderDirection(state) {
      return state.turnoverOrderDirection;
    },
    showOnlyImportedTurnovers(state) {
      return state.showOnlyImportedTurnovers;
    },
    turnoverImportDate(state) {
      return state.turnoverImportDate;
    }
  }
};

export default turnover;
