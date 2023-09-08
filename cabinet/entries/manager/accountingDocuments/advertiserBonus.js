import Vue from './baseDocumentEntry';

import {store} from '../../../src/manager/accountingDocuments/advertiserBonus/store';
import AppAdvertiserBonus from '../../../src/manager/accountingDocuments/advertiserBonus/advertiserBonus.vue'

Vue.component('app-advertiser-bonus', AppAdvertiserBonus);
new Vue({
    el: '#AppAdvertiserBonus',
    store,
});
