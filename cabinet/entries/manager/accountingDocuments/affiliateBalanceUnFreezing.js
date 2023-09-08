import Vue from './baseDocumentEntry';

import {store} from '../../../src/manager/accountingDocuments/affiliateBalanceUnFreezing/store';
import AffiliateBalanceUnFreezing from '../../../src/manager/accountingDocuments/affiliateBalanceUnFreezing/affiliateBalanceUnFreezing.vue';

Vue.component('app-affiliate-balance-un-freezing', AffiliateBalanceUnFreezing);
new Vue({
    el: '#AppAffiliateBalanceUnFreezing',
    store,
});
