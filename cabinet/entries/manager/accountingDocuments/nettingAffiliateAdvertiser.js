import Vue from './baseDocumentEntry';

import {store} from '../../../src/manager/accountingDocuments/agentOutcomeBonus/store';
import AppNettingAffiliateAdvertiser from '../../../src/manager/accountingDocuments/nettingAffiliateAdvertiser/nettingAffiliateAdvertiser.vue'

Vue.component('app-netting-affiliate-advertiser', AppNettingAffiliateAdvertiser);
new Vue({
    el: '#AppNettingAffiliateAdvertiser',
    store,
});
