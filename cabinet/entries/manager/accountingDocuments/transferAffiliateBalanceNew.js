import Vue from './baseDocumentEntry';

import {store} from '../../../src/manager/accountingDocuments/transferAffiliateBalanceNew/store';
import AppTransferAffiliateBalance from '../../../src/manager/accountingDocuments/transferAffiliateBalanceNew/transferAffiliateBalanceNew.vue'

Vue.component('app-transfer-affiliate-balance', AppTransferAffiliateBalance);
new Vue({
    el: '#AppTransferAffiliateBalance',
    store,
});
