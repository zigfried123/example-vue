import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);
const state = {
    row: null,
    isLoadProgress: false,
};
const mutations = {
    SET_ROW: (state, row) => {
        state.row = row;
    },
    SET_LOAD_PROGRESS: (state, progress) => {
        state.isLoadProgress = progress;
    }
};
const actions = {
    APPEND_CALENDAR: (context) => {
        context.commit('SET_LOAD_PROGRESS', true);
        axios.get('/financeAccounting/calendar/holdApi/info')
            .then(response => {
                context.commit('SET_LOAD_PROGRESS', false);
                context.commit('SET_ROW', response.data.data[0]);
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