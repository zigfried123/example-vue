import Vue from './baseDocumentEntry';

import {store} from '../../../src/manager/accountingDocuments/advertiserApproveCancellation/store';
import AppAdvertiserApproveCancellation from '../../../src/manager/accountingDocuments/advertiserApproveCancellation/advertiserApproveCancellation.vue'

Vue.component('app-advertiser-approve-cancellation', AppAdvertiserApproveCancellation);
new Vue({
    el: '#AppAdvertiserApproveCancellation',
    store,
});
