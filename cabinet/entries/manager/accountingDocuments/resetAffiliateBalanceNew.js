import Vue from './baseDocumentEntry';

import {store} from '../../../src/manager/accountingDocuments/resetAffiliateBalanceNew/store';
import AppResetAffiliateBalance from '../../../src/manager/accountingDocuments/resetAffiliateBalanceNew/resetAffiliateBalanceNew.vue'

Vue.component('app-reset-affiliate-balance', AppResetAffiliateBalance);
new Vue({
    el: '#ResetAffiliateBalance',
    store,
});
