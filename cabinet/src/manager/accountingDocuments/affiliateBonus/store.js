import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);
const today= new Date().toLocaleDateString('ru-RU');

const state = {
    id: null,
    operation_id: null,
    processing: false,
    createdDate: today,
    managementData: today,
    amount: null,
    status: null,
    comment: '',
};

const getters = {
    ID: state => {
        return state.id;
    },
    OPERATION_ID: state => {
        return state.operation_id;
    },
    STATUS: state => {
        return state.status;
    },
    GET_PROCESSING: state => {
        return state.processing;
    },
    CREATED_DATE: state => {
        return state.createdDate;
    },
    ACCOUNTING_DATE: state => {
        return state.managementData;
    },
    AMOUNT: state => {
        return state.amount;
    },
    COMMENT: state => {
        return state.comment;
    },

};
const mutations = {
    SET_ID: (state, id) => {
        state.id = id;
    },
    SET_CREATED_DATE: (state, createdDate) => {
        state.createdDate = createdDate;
    },
    SET_ACCOUNTING_DATE: (state, managementData) => {
        state.managementData = managementData;
    },
    SET_OPERATION_ID: (state, operation_id) => {
        state.operation_id = operation_id;
    },
    SET_AMOUNT: (state, amount) => {
        state.amount = amount;
    },
    SET_STATUS: (state, status) => {
        state.status = status;
    },
    SET_COMMENT: (state, comment) => {
        state.comment = comment;
    },
    SET_PROCESSING: (state, flag) => {
        state.processing = flag;
    },
};

const actions = {

};

export const store = new Vuex.Store({
    state,
    getters,
    mutations,
    actions
});
