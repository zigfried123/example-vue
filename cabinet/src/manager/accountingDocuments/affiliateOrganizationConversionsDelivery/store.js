import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import ResponseErrorHelper from '../../../common/contractors/selfEmployed/helpers/ResponseErrorHelper';


Vue.use(Vuex);
const today= new Date().toLocaleDateString('ru-RU');

const state = {
    id: null,
    status: null,
    operationId: null,
    processing: false,
    created: today,
    managementDate: today,
    ourOrganizationId: null,
    affiliateOrganizationId: null,
    payoutRequestIds: [],
    conversions: [],
    comment: '',
    isProgress: false,
    printForms: [],
    isShowError: false,
    textError: null,

};

const getters = {
    RENDER_DATA: state => {
        return state.conversions;
    },
    SUM_TOTAL_AMOUNT: state => {
        let total = 0;

        state.conversions.forEach(item => {
            total += parseFloat(item.amount);
        });

        return total.toFixed(2);
    },
};

const mutations = {
    SET_DOCUMENT: (state, document) => {
        state.id = document.id;
        state.status = document.status;
        state.operationId = document.operationId;
        state.processing = document.processing;
        state.created = document.created;
        state.managementDate = document.managementDate;
        state.ourOrganizationId = document.ourOrganizationId.toString();
        state.affiliateOrganizationId = document.affiliateOrganizationId.toString();
        state.payoutRequestIds = document.payoutRequestIds;
        state.conversions = document.conversions;
        state.comment = document.comment;
        state.printForms = document.printForms.data;
    },
    SET_MANAGEMENT_DATE: (state, managementDate) => {
        state.managementDate = managementDate;
    },
    SET_COMMENT: (state, comment) => {
        state.comment = comment;
    },
    SET_PROCESSING: (state, progress) => {
        state.isProgress = progress;
    },
    SET_TEXT_ERROR: (state, value) => {
        state.textError = value;
    },
    SET_SHOW_ERROR: (state, value) => {
        state.isShowError = value;
    },
};

const actions = {
    APPEND_DOCUMENT: (context, url) => {
        context.commit('SET_PROCESSING', true);
        axios.get(url)
            .then(response => {
                context.commit('SET_DOCUMENT', response.data.data);
                context.commit('SET_PROCESSING', false);
            })
            .catch(error => {
                console.error(error);
            });
    },
    ADD_ATTACH: (context, attachInfo) => {
        context.commit('SET_PROCESSING', true);
        let attachDocUrl = attachInfo.docUrl;
        let formData = new FormData();
        formData.append('id', attachInfo.printFormId);
        formData.append('name', attachInfo.name);
        formData.append('file', attachInfo.file);
        axios({
            method: 'post',
            url: attachInfo.url,
            data: formData,
        })
            .then(response => {
                context.dispatch('APPEND_DOCUMENT', attachDocUrl)
                context.commit('SET_PROCESSING', false);
            })
            .catch(error => {
                errorHandler(context, error);
            });
    },
    REMOVE_ATTACH: (context, attachInfo) => {
        context.commit('SET_PROCESSING', true);
        let attachDocUrl = attachInfo.docUrl;
        axios({
            method: 'post',
            url: attachInfo.attachRemoveUrl,
            data: {id: attachInfo.id},
        })
            .then(response => {
                context.dispatch('APPEND_DOCUMENT', attachDocUrl)
                context.commit('SET_PROCESSING', false);
            })
            .catch(error => {
                errorHandler(context, error);
            });
    },
};
function errorHandler(context, error) {
    context.commit('SET_PROCESSING', false);

    let responseErrorHelper = new ResponseErrorHelper();
    let message = responseErrorHelper.getMessage(error.response.data);
    let messages = responseErrorHelper.errorsToMessages(error.response.data);

    let resultMessages = [];
    if (message) {
        resultMessages.push(message);
    }

    if (messages) {
        resultMessages.push(...messages);
    }

    context.commit('SET_SHOW_ERROR', true);
    context.commit('SET_TEXT_ERROR', resultMessages.join('<br>'));
}

export const store = new Vuex.Store({
    state,
    getters,
    mutations,
    actions
});
