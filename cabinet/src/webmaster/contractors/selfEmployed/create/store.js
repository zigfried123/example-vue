import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import {
    urlCreateApiSelfEmployed,
    urlListSelfEmployed,
    urlSelfEmployedForEdit,
    urlUpdateApiSelfEmployed
} from '../../../../common/contractors/selfEmployed/helpers/selfEmployedUrls';
import ResponseErrorHelper from '../../../../common/contractors/selfEmployed/helpers/ResponseErrorHelper';

Vue.use(Vuex);

const state = {
    id: null,

    firstName: null,
    lastName: null,
    middleName: null,
    passportNumber: null,
    passportSeries: null,
    passportIssuedBy: null,
    passportDepartmentCode: null,
    passportIssuedDate: new Date().toLocaleDateString('ru-RU'),
    passportRegistration: null,
    inn: null,
    phone: null,
    email: null,

    isLoadProgress: false,
    isShowError: false,
    textError: null,
};

const getters = {
};

const mutations = {
    SET_LOAD_PROGRESS: (state, progress) => {
        state.isLoadProgress = progress;
    },
    SET_ID: (state, id) => {
        state.id = id;
    },
    SET_SHOW_ERROR: (state, value) => {
        state.isShowError = value;
    },
    SET_FIRST_NAME: (state, firstName) => {
        state.firstName = firstName;
    },
    SET_LAST_NAME: (state, lastName) => {
        state.lastName = lastName;
    },
    SET_MIDDLE_NAME: (state, middleName) => {
        state.middleName = middleName;
    },
    SET_PASSPORT_NUMBER: (state, passportNumber) => {
        state.passportNumber = passportNumber;
    },
    SET_PASSPORT_SERIES: (state, passportSeries) => {
        state.passportSeries = passportSeries;
    },
    SET_PASSPORT_ISSUED_BY: (state, passportIssuedBy) => {
        state.passportIssuedBy = passportIssuedBy;
    },
    SET_PASSPORT_DEPARTMENT_CODE: (state, passportDepartmentCode) => {
        state.passportDepartmentCode = passportDepartmentCode;
    },
    SET_PASSPORT_ISSUED_DATE: (state, passportIssuedDate) => {
        state.passportIssuedDate = passportIssuedDate;
    },
    SET_PASSPORT_REGISTRATION: (state, passportRegistration) => {
        state.passportRegistration = passportRegistration;
    },
    SET_INN: (state, inn) => {
        state.inn = inn;
    },
    SET_PHONE: (state, phone) => {
        state.phone = phone;
    },
    SET_EMAIL: (state, email) => {
        state.email = email;
    },
    SET_TEXT_ERROR: (state, value) => {
        state.textError = value;
    }
};

const actions = {
    APPEND_SELF_EMPLOYED: (context, id) => {
        context.commit('SET_LOAD_PROGRESS', true);
        axios.get(urlSelfEmployedForEdit(id))
            .then(response => {
                context.commit('SET_LOAD_PROGRESS', false);

                context.commit('SET_ID', id);
                context.commit('SET_FIRST_NAME', response.data.data.firstName);
                context.commit('SET_LAST_NAME', response.data.data.lastName);
                context.commit('SET_MIDDLE_NAME', response.data.data.middleName);
                context.commit('SET_PASSPORT_NUMBER', response.data.data.passportNumber);
                context.commit('SET_PASSPORT_SERIES', response.data.data.passportSeries);
                context.commit('SET_PASSPORT_ISSUED_BY', response.data.data.passportIssuedBy);
                context.commit('SET_PASSPORT_DEPARTMENT_CODE', response.data.data.passportDepartmentCode);
                context.commit('SET_PASSPORT_ISSUED_DATE', response.data.data.passportIssuedDate);
                context.commit('SET_PASSPORT_REGISTRATION', response.data.data.passportRegistration);
                context.commit('SET_INN', response.data.data.inn);
                context.commit('SET_PHONE', response.data.data.phone);
                context.commit('SET_EMAIL', response.data.data.email);
            })
            .catch(error => {
                errorHandler(context, error);
            });
    },
    CREATE_SELF_EMPLOYED: (context, selfEmployed) => {
        context.commit('SET_LOAD_PROGRESS', true);

        axios.post(urlCreateApiSelfEmployed(), selfEmployed)
            .then(response => {
                context.commit('SET_LOAD_PROGRESS', false);
                window.location.href = urlListSelfEmployed();
            })
            .catch(error => {
                errorHandler(context, error);
            });
    },
    UPDATE_SELF_EMPLOYED: (context, selfEmployed) => {
        context.commit('SET_LOAD_PROGRESS', true);

        axios.post(urlUpdateApiSelfEmployed(state.id), selfEmployed)
            .then(response => {
                context.commit('SET_LOAD_PROGRESS', false);
                window.location.href = urlListSelfEmployed();
            })
            .catch(error => {
                errorHandler(context, error);
            });
    },
};

function errorHandler(context, error) {
    context.commit('SET_LOAD_PROGRESS', false);


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