import Vue from './baseDocumentEntry';

import {store} from '../../../src/manager/accountingDocuments/resolveConversionsSettlements/store';
import AppResolveConversionsSettlements from '../../../src/manager/accountingDocuments/resolveConversionsSettlements/resolveConversionsSettlements.vue'

Vue.component('app-resolve-conversions-settlements', AppResolveConversionsSettlements);
new Vue({
    el: '#AppResolveConversionsSettlements',
    store,
});
