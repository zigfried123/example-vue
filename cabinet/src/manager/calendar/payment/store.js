import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);
const state = {
    rows: null,
    isLoadProgress: false,
};
const mutations = {
    SET_ROWS: (state, rows) => {
        state.rows = rows;
    },
    SET_LOAD_PROGRESS: (state, progress) => {
        state.isLoadProgress = progress;
    }
};
const actions = {
    APPEND_CALENDAR: (context) => {
        context.commit('SET_LOAD_PROGRESS', true);
        axios.get('/financeAccounting/calendar/paymentApi/info')
            .then(response => {
                context.commit('SET_LOAD_PROGRESS', false);
                context.commit('SET_ROWS', response.data.data);
            })
            .catch(error => {
                context.commit('SET_LOAD_PROGRESS', false);
                console.error(error);
            });
    },
};

export const store = new Vuex.Store({
    state,
    mutations,
    actions
});