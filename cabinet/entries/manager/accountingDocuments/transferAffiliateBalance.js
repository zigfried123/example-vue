import Vue from './baseDocumentEntry';

import {store} from '../../../src/manager/accountingDocuments/transferAffiliateBalance/store';
import AppTransferAffiliateBalance from '../../../src/manager/accountingDocuments/transferAffiliateBalance/transferAffiliateBalance.vue'

Vue.component('app-transfer-affiliate-balance', AppTransferAffiliateBalance);
new Vue({
    el: '#AppTransferAffiliateBalance',
    store,
});
