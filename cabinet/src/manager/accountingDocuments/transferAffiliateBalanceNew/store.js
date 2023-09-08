import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const today = new Date().toLocaleDateString('ru-RU');

const state = {
    id: null,
    operation_id: null,
    comment: '',
    processing: false,
    createdDate: today,
    accountingDate: today,
    status: 'draft',
    senderAffiliateId: null,
    recipientAffiliateId: null,
    amount: ''
};

const getters = {

    ID: state => {
        return state.id;
    },
    OPERATION_ID: state => {
        return state.operation_id;
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
    WEBMASTER_ID: state => {
        return state.webmasterId;
    },
    STATUS: state => {
        return state.status;
    },
    SENDER_AFFILIATE_ID: state => {
        return state.senderAffiliateId;
    },
    RECIPIENT_AFFILIATE_ID: state => {
        return state.recipientAffiliateId;
    },
    AMOUNT: state => {
        return state.amount;
    }
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
    SET_PROCESSING: (state, flag) => {
        state.processing = flag;
    },
    SET_CREATED_DATE: (state, createdDate) => {
        state.createdDate = createdDate;
    },
    SET_ACCOUNTING_DATE: (state, accountingDate) => {
        state.accountingDate = accountingDate;
    },
    SET_WEBMASTER_ID: (state, webmasterId) => {
        state.webmasterId = webmasterId;
    },
    SET_STATUS: (state, status) => {
        state.status = status;
    },
    SET_SENDER_AFFILIATE_ID: (state, senderAffiliateId) => {
        state.senderAffiliateId = senderAffiliateId;
    },
    SET_RECIPIENT_AFFILIATE_ID: (state, recipientAffiliateId) => {
        state.recipientAffiliateId = recipientAffiliateId;
    },
    SET_AMOUNT: (state, amount) => {
        state.amount = amount;
    }
};

const actions = {

};

export const store = new Vuex.Store({
    state,
    getters,
    mutations,
    actions
});
