import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);
const today= new Date().toLocaleDateString('ru-RU');

const state = {
    id: null,
    operation_id: null,
    processing: false,
    createdDate: today,
    accountingDate: today,
    balance: '',
    bonusSum: null,
    comment: '',
};

const getters = {
    ID: state => {
        return state.id;
    },
    OPERATION_ID: state => {
        return state.operation_id;
    },
    GET_PROCESSING: state => {
        return state.processing;
    },
    CREATED_DATE: state => {
        return state.createdDate;
    },
    ACCOUNTING_DATE: state => {
        return state.accountingDate;
    },
    BALANCE: state => {
        return state.balance;
    },
    BONUS_SUM: state => {
        return state.bonusSum;
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
    SET_ACCOUNTING_DATE: (state, accountingDate) => {
        state.accountingDate = accountingDate;
    },
    SET_OPERATION_ID: (state, operation_id) => {
        state.operation_id = operation_id;
    },
    SET_BALANCE: (state, balance) => {
        state.balance = balance;
    },
    SET_BONUS_SUM: (state, bonusSum) => {
        state.bonusSum = bonusSum;
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
