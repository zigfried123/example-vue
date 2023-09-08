import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import {
    urlSelfEmployed,
    urlBankAccountsAdd,
    urlBankAccountsDelete,
} from '../../../../common/contractors/selfEmployed/helpers/selfEmployedUrls';
import ResponseErrorHelper from '../../../../common/contractors/selfEmployed/helpers/ResponseErrorHelper';


Vue.use(Vuex);

const state = {
    selfEmployed: null,
    selfEmployedId: null,
    bankAccounts: [],
    isLoadProgress: false,
    isAddProgress: false,
    isDeleteProgress: false,
    isShowError: false,
    textError: null,
};

const getters = {
    GET_SHOW_ERROR: state => {
        return state.isShowError;
    },
};

const mutations = {
    SET_SELF_EMPLOYED_ID: (state, id) => {
        state.selfEmployedId = id;
    },
    SET_LOAD_PROGRESS: (state, progress) => {
        state.isLoadProgress = progress;
    },
    SET_SELF_EMPLOYED: (state, selfEmployed) => {
        state.selfEmployed = selfEmployed;
    },
    SET_BANK_ACCOUNTS: (state, bankAccounts) => {
        state.bankAccounts = bankAccounts;
    },
    ADD_BANK_ACCOUNT: (state, bankAccount) => {
        state.bankAccounts.push(bankAccount);
    },
    DELETE_BANK_ACCOUNT: (state, id) => {
        let index = state.bankAccounts.findIndex((item) => {
            return parseInt(item.id) === parseInt(id);
        });
        if (index !== -1) {
            state.bankAccounts.splice(index, 1);
        }
    },
    SET_SHOW_ERROR: (state, value) => {
        state.isShowError = value;
    },
    SET_TEXT_ERROR: (state, value) => {
        state.textError = value;
    }
};

const actions = {
    APPEND_BANK_ACCOUNTS: (context) => {
        context.commit('SET_LOAD_PROGRESS', true);
        axios.get(urlSelfEmployed(state.selfEmployedId))
            .then(response => {
                context.commit('SET_LOAD_PROGRESS', false);
                context.commit('SET_SELF_EMPLOYED', response.data.data);
                context.commit('SET_BANK_ACCOUNTS', response.data.data.bankAccounts);
            })
            .catch(error => {
                errorHandler(context, error);
            });
    },
    ADD_BANK_ACCOUNT: (context, bankAccount) => {
        context.commit('SET_LOAD_PROGRESS', true);
        bankAccount.selfEmployedId = state.selfEmployedId;

        axios.post(urlBankAccountsAdd(), bankAccount)
            .then(response => {
                context.commit('SET_LOAD_PROGRESS', false);

                context.commit(
                    'ADD_BANK_ACCOUNT',
                    {
                        id: response.data.data.id,
                        name: bankAccount.name,
                        bik: bankAccount.bik,
                        correspondentAccount: bankAccount.correspondentAccount,
                        checkingAccount: bankAccount.checkingAccount,
                    }
                );
            })
            .catch(error => {
                errorHandler(context, error);
            });
    },

    DELETE_BANK_ACCOUNT: (context, id) => {
        context.commit('SET_LOAD_PROGRESS', true);
        axios.post(urlBankAccountsDelete(id))
            .then(response => {
                context.commit('SET_LOAD_PROGRESS', false);
                context.commit('DELETE_BANK_ACCOUNT', id);
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

    context.commit('SET_TEXT_ERROR', resultMessages.join('<br>'));
}

export const store = new Vuex.Store({
    state,
    getters,
    mutations,
    actions
});
