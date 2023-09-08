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
    agentCabinet: '',
    bank: '',
    bonusSum: null,
    periodStart: today,
    periodEnd: today,
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
    AGENT_CABINET: state=>{
        return state.agentCabinet;
    },
    BANK: state => {
        return state.bank;
    },
    BONUS_SUM: state => {
        return state.bonusSum;
    },
    PERIOD_START: state => {
        return state.periodStart;
    },
    PERIOD_END: state => {
        return state.periodEnd;
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
    SET_AGENT_CABINET: (state, agentCabinet) =>{
        state.agentCabinet = agentCabinet;
    },
    SET_OPERATION_ID: (state, operation_id) => {
        state.operation_id = operation_id;
    },
    SET_BANK: (state, bank) => {
        state.bank = bank;
    },
    SET_BONUS_SUM: (state, bonusSum) => {
        state.bonusSum = bonusSum;
    },
    SET_PERIOD_START: (state, periodStart) => {
        state.periodStart = periodStart;
    },
    SET_PERIOD_END: (state, periodEnd) => {
        state.periodEnd = periodEnd;
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
