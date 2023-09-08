import Vue from 'vue'
import Vuex from 'vuex';
import PaymentType from "../classes/PaymentType";
import PaymentGroup from "../classes/PaymentGroup";
import PaymentAccount from "../classes/PaymentAccount";
import PaymentTypeForm from "../classes/PaymentTypeForm";

Vue.use(Vuex);

/**
 *
 * @type {Store<{paymentAccounts: {}, groups: number[], paymentTypes: {}, config: {baseUrl: string}}>}
 */
export const commonStore = new Vuex.Store({
    state: {
        config: {
            baseUrl: ''
        },
        /**
         * @property {PaymentGroup[]}
         */
        groups: [],
        paymentTypes: {},
        paymentAccounts: {},
        formModel : {},
        forms: {},
        /**
         * @property {PaymentAccount}
         */
        defaultPaymentAccount: null
    },
    getters: {
        getGroups: state => state.groups,
        getActiveGroup : state => state.groups.find(group => group.collapsed),
        /**
         *
         * @param state
         * @returns {function(*)}
         */
        getPaymentTypesByGroup: state => group => {
            let result = {};
            for(let paymentTypeCode of group.paymentTypeCodes) {
                result[paymentTypeCode] = state.paymentTypes[paymentTypeCode];
            }
            return result;
        },

        getPaymentTypes: state => state.paymentTypes,
        getPaymentType: state => code => {
            return state.paymentTypes[code];
        },

        /**
         *
         * @param state
         * @return {PaymentType}
         */
        getActivePaymentType: function(state) {
            for (let paymentTypeKey in state.paymentTypes) {
                if(!state.paymentTypes.hasOwnProperty(paymentTypeKey)) {
                    continue;
                }
                let paymentType = state.paymentTypes[paymentTypeKey];
                if (paymentType === undefined) {
                    return null;
                }

                if (paymentType.state === PaymentType.STATE_EDIT) {
                    return paymentType;
                }
            }
            return null;
        },
        getRecommendedPaymentTypes : function(state) {
            let set = {};
            for (let paymentTypeKey in state.paymentTypes) {
                if(!state.paymentTypes.hasOwnProperty(paymentTypeKey)) {
                    continue;
                }
                let paymentType = state.paymentTypes[paymentTypeKey];
                if (paymentType === undefined) {
                    return null;
                }

                if (paymentType.isRecommended) {
                    set[paymentTypeKey] = paymentType;
                }
            }
            return set;
        },
        getPaymentAccounts: state => state.paymentAccounts,
        getConfig : state => state.config,
        getConfigValue: function (key) {
            return this.getConfig()[key];
        },
        getForm: state => code => {
            return state.forms[code];
        },
        getBaseUrl : state => state.config.baseUrl,
        getFormModel: state => state.formModel,


        getDefaultPaymentAccount: state => state.defaultPaymentAccount
    },
    mutations: {
        setConfig: (state, data) => {
            Vue.set(state, 'config', data)
        },
        setGroups: (state, data) => {
            Vue.set(state, 'groups', data)
        },
        setPaymentTypes: (state, data) => {
            Vue.set(state, 'paymentTypes', data)
        },

        /**
         *
         * @param state
         * @param {PaymentType} paymentType
         */
        initForm : (state, paymentType) => {
            Vue.set(state.forms, paymentType.code, paymentType.getForm());
        },
        setFormValue : (state, data) => {
            for(let key in data) {
                if(!data.hasOwnProperty(key)) {
                    continue;
                }
                Vue.set(state.formModel, key, data[key]);
            }
        },
        setEmptyForm: (state, data) => {
            Vue.set(state, 'formModel', {});
        },
        setDefaultPaymentAccount: (state, data) => {
            Vue.set(state, 'defaultPaymentAccount', data);
        }
    },
});


