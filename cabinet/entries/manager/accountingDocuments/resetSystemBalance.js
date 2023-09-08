import Vue from './baseDocumentEntry';

import {store} from '../../../src/manager/accountingDocuments/resetSystemBalance/store';
import AppResetSystemBalance from '../../../src/manager/accountingDocuments/resetSystemBalance/resetSystemBalance.vue'

Vue.component('app-reset-system-balance', AppResetSystemBalance);
new Vue({
    el: '#AppResetSystemBalance',
    store,
});
