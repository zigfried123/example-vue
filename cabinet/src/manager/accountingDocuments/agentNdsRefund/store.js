import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const state = {
    id: null,
    operation_id: null,
    comment: '',
    agentBank: '',
    agentAccount: '',
    amount: '',
    processing: false,
    createdDate: new Date().toLocaleDateString('ru-RU'),
    accountingDate: new Date().toLocaleDateString('ru-RU'),
};

const getters = {

    ID: state => {
        return state.id;
    },
    OPERATION_ID: state => {
        return state.operation_id;
    },
    AMOUNT: state => {
        return state.amount;
    },
    AGENT_BANK: state => {
        return state.agentBank
    },
    AGENT_ACCOUNT: state => {
        return state.agentAccount;
    },
    COMMENT: state => {
        return state.comment;
    },
    CREATED_DATE: state => {
        return state.createdDate;
    },
    ACCOUNTING_DATE: state => {
        return state.accountingDate;
    },
    GET_PROCESSING: state => {
        return state.processing;
    },
};
const mutations = {
    SET_ID: (state, id) => {
        state.id = id;
    },
    SET_OPERATION_ID: (state, operation_id) => {
        state.operation_id = operation_id;
    },
    SET_COMMENT: (state, comment) => {
        state.comment = comment;
    },
    SET_AGENT_BANK: (state, agentBank) => {
        state.agentBank = agentBank;
    },
    SET_AGENT_ACCOUNT: (state, agenctAccount) => {
        state.agentAccount = agenctAccount;
    },
    SET_AMOUNT: (state, amount) => {
        state.amount = amount;
    },
    SET_PROCESSING: (state, flag) => {
        state.processing = flag;
    },
    SET_CREATED_DATE: (state, createdDate) => {
        state.createdDate = createdDate;
    },
    SET_ACCOUNTING_DATE: (state, accountingDate) => {
        state.accountingDate = accountingDate;
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
