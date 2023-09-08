import Vue from 'vue'
import Vuex from 'vuex'
import {isDuplicateRow, updateRenderData} from "../helpers/RenderData";

Vue.use(Vuex);
const today = new Date().toLocaleDateString('ru-RU');

const state = {
    id: null,
    status: "draft",
    operationId: null,
    comment: '',
    advertiserId: '',
    affiliateId: '',
    offerId: '',
    urlRender: '',
    gridInstanceName: '',
    slices: [],
    processing: false,
    createdDate: today,
    accountingDate: today,
    periodStart: today,
    periodEnd: today,
    isShowError: false,
    textError: null,
};

const getters = {
    RENDER_DATA: state => {
        return state.slices;
    },
    SLICES: state => {
        return state.slices;
    },
    ID: state => {
        return state.id;
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
    PERIOD_START: state => {
        return state.periodStart;
    },
    PERIOD_END: state => {
        return state.periodEnd;
    },
    GRID_INSTANCE_NAME: state => {
        return state.gridInstanceName;
    },
    WEBMASTER_ID: state => {
        return state.affiliateId
    },
    ADVERTISER_ID: state => {
        return state.advertiserId
    },
    OFFER_ID: state => {
        return state.offerId
    },

};
const mutations = {
    SET_ID: (state, id) => {
        state.id = id;
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
    SET_PERIOD_START: (state, periodStart) => {
        state.periodStart = periodStart;
    },
    SET_PERIOD_END: (state, periodEnd) => {
        state.periodEnd = periodEnd;
    },
    SET_TEXT_ERROR: (state, value) => {
        state.textError = value;
    },
    SET_SHOW_ERROR: (state, value) => {
        state.isShowError = value;
    },
    SET_GRID_INSTANCE_NAME: (state, gridInstanceName) => {
        state.gridInstanceName = gridInstanceName;
    },
    SET_WEBMASTER_ID: (state, id) =>{
        state.affiliateId = id;
    },
    SET_ADVERTISER_ID: (state, id) =>{
        state.advertiserId = id;
    },
    SET_OFFER_ID: (state, id) =>{
        state.offerId = id;
    },

    SET_DOCUMENT: (state, document) => {
        state.id = document.id;
        state.status = document.status;
        state.processing = document.processing;
        state.created = document.created;
        state.managementDate = document.managementDate;
        state.comment = document.comment;
        state.advertiserId = document.advertiserId;
        state.affiliateId = document.affiliateId;
        state.offerId = document.offerId;
        state.periodStart = document.periodStartDate;
        state.periodEnd = document.periodEndDate;
        state.operationId = document.operationId;
        if(document.status === 'executed'){

            state.slices = document.slices;
        }
    },
};

const actions = {
    APPEND_DOCUMENT: (context, data) => {

        let form = data.form;

        context.commit('SET_PROCESSING', true);
        axios.get(data.url)
            .then(response => {

                for(let field in response.data.data){
                    switch(field){
                        case 'affiliateId':
                            field = 'webmasterId';
                            break;
                    }

                    if(form[field] != undefined){
                        form[field].$touch();
                    }
                }

                context.commit('SET_DOCUMENT', response.data.data);
                context.commit('SET_PROCESSING', false);
            })
            .catch(error => {
                console.error(error);
            });
    },
};

export const store = new Vuex.Store({
    state,
    getters,
    mutations,
    actions
});
