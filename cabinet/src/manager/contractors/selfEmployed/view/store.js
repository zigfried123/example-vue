import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import {
    urlSelfEmployed,
    urlActivateSelfEmployed,
    urlRemoveSelfEmployed,
    urlDeclineApiSelfEmployed,
    urlToModerateApiSelfEmployed,
    urlApiModerateHistory} from '../../../../common/contractors/selfEmployed/helpers/selfEmployedUrls';
import ResponseErrorHelper from '../../../../common/contractors/selfEmployed/helpers/ResponseErrorHelper';

Vue.use(Vuex);
const state = {
    selfEmployed: null,
    moderateHistory: null,
    isLoadProgress: false,
    isShowError: false,
    codeError: null,
    textError: null,
};
const getters = {
    GET_SHOW_ERROR: state => {
        return state.isShowError;
    },
};
const mutations = {
    SET_SELF_EMPLOYED: (state, value) => {
        state.selfEmployed = value;
    },
    SET_MODERATE_HISTORY: (state, value) => {
        state.moderateHistory = value;
    },
    SET_LOAD_PROGRESS: (state, progress) => {
        state.isLoadProgress = progress;
    },
    SET_SHOW_ERROR: (state, value) => {
        state.isShowError = value;
    },
    SET_CODE_ERROR: (state, value) => {
        state.codeError = value;
    },
    SET_TEXT_ERROR: (state, value) => {
        state.textError = value;
    }
};
const actions = {
    APPEND_SELF_EMPLOYED: (context, id) => {
        context.commit('SET_LOAD_PROGRESS', true);
        axios.get(urlSelfEmployed(id))
            .then(response => {
                context.commit('SET_LOAD_PROGRESS', false);
                context.commit('SET_SELF_EMPLOYED', response.data.data);
            })
            .catch(error => {
                errorHandler(context, error);
            });
    },
    ACTIVATE_SELF_EMPLOYED: (context, data) => {
        context.commit('SET_LOAD_PROGRESS', true);
        axios.post(urlActivateSelfEmployed(data.id), {comment: data.comment})
            .then(response => {
                context.commit('SET_LOAD_PROGRESS', false);
                context.dispatch('APPEND_SELF_EMPLOYED', data.id);
        })
        .catch(error => {
                errorHandler(context, error);
        });
    },
    DELETE_SELF_EMPLOYED: (context, data) => {
        context.commit('SET_LOAD_PROGRESS', true);
        axios.post(urlRemoveSelfEmployed(data.id), {comment: data.comment})
            .then(response => {
            context.commit('SET_LOAD_PROGRESS', false);
            context.dispatch('APPEND_SELF_EMPLOYED', data.id);
        })
        .catch(error => {
            errorHandler(context, error);
        });
    },
    DECLINE_SELF_EMPLOYED: (context, data) => {
        context.commit('SET_LOAD_PROGRESS', true);
        axios.post(urlDeclineApiSelfEmployed(data.id), {comment: data.comment})
            .then(response => {
                context.commit('SET_LOAD_PROGRESS', false);
                context.dispatch('APPEND_SELF_EMPLOYED', data.id);
            })
            .catch(error => {
                errorHandler(context, error);
            });
    },
    TO_MODERATE_SELF_EMPLOYED: (context, data) => {
        context.commit('SET_LOAD_PROGRESS', true);
        axios.post(urlToModerateApiSelfEmployed(data.id), {comment: data.comment})
            .then(response => {
                context.commit('SET_LOAD_PROGRESS', false);
                context.dispatch('APPEND_SELF_EMPLOYED', data.id);
            })
            .catch(error => {
                errorHandler(context, error);
            });
    },
    APPEND_MODERATE_HISTORY: (context, id) => {
        context.commit('SET_LOAD_PROGRESS', true);
        axios.get(urlApiModerateHistory(id))
            .then(response => {
                context.commit('SET_LOAD_PROGRESS', false);
                context.commit('SET_MODERATE_HISTORY', response.data.data.moderateHistory);
            })
            .catch(error => {
                errorHandler(context, error);
            });
    },
};

function errorHandler(context, error) {
    context.commit('SET_LOAD_PROGRESS', false);
    context.commit('SET_SHOW_ERROR', true);

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
    context.commit('SET_CODE_ERROR', error.response.status);
    context.commit('SET_TEXT_ERROR', resultMessages.join('<br>'));
}

export const store = new Vuex.Store({
    state,
    getters,
    mutations,
    actions
});