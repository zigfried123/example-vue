import Vue from './baseDocumentEntry';

import {store} from '../../../src/manager/accountingDocuments/affiliateBalanceFreezing/store';
import AffiliateBalanceFreezing from '../../../src/manager/accountingDocuments/affiliateBalanceFreezing/affiliateBalanceFreezing.vue';

Vue.component('app-affiliate-balance-freezing', AffiliateBalanceFreezing);
new Vue({
    el: '#AppAffiliateBalanceFreezing',
    store,
});
