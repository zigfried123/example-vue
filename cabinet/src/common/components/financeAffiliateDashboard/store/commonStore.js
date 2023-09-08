import Vue from 'vue'
import Vuex from 'vuex';

Vue.use(Vuex);

/**
 *
 * @type {Store<{config: {baseUrl: string}, settlementData: *[]}>}
 */
export const commonStore = new Vuex.Store({
    state: {
        config: {
            baseUrl: ''
        },
        settlementData : [

        ],
        state: null,
        dateFrom: null,
        dateTo: null,
    },
    getters: {
        getSettlementData: state => state.settlementData,
        getState: state => state.state,
        getDateFrom: state => state.dateFrom ? state.dateFrom : (new Date()).toLocaleDateString(),
        getDateTo: state => state.dateTo ? state.dateTo : (new Date()).toLocaleDateString(),
    },
    mutations: {
        setSettlementData: (state, data) => {
            Vue.set(state, 'settlementData', data)
        },
        setState: (state, data) => {
            Vue.set(state, 'state', data)
        },
        setDateFrom: (state, data) => {
            Vue.set(state, 'dateFrom', data)
        },
        setDateTo: (state, data) => {
            Vue.set(state, 'dateTo', data)
        },
    },
});


