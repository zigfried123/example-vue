import Vue from './baseDocumentEntry';

import {store} from '../../../src/manager/accountingDocuments/affiliateBonus/store';
import AppAffiliateBonus from '../../../src/manager/accountingDocuments/affiliateBonus/affiliateBonus.vue'

Vue.component('app-affiliate-bonus', AppAffiliateBonus);
new Vue({
    el: '#AppAffiliateBonus',
    store,
});
