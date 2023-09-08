import Vue from './baseDocumentEntry';

import {store} from '../../../src/manager/accountingDocuments/advertiserInvoice/store';
import AppAdvertiserInvoice from '../../../src/manager/accountingDocuments/advertiserInvoice/advertiserInvoice.vue';

Vue.component('app-advertiser-invoice', AppAdvertiserInvoice);
new Vue({
    el: '#AppAdvertiserInvoice',
    store,
});
