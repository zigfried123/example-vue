import Vue from './baseDocumentEntry';

import {store} from '../../../src/manager/accountingDocuments/affiliateApproveCancellation/store';
import AppAffiliateApproveCancellation from '../../../src/manager/accountingDocuments/affiliateApproveCancellation/affiliateApproveCancellation.vue'

Vue.component('app-affiliate-approve-cancellation', AppAffiliateApproveCancellation);
new Vue({
    el: '#AppAffiliateApproveCancellation',
    store,
});
