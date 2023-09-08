import Vue from './baseDocumentEntry';

import {store} from '../../../src/manager/accountingDocuments/agentBonus/store';
import AppAgentBonus from '../../../src/manager/accountingDocuments/agentBonus/agentBonus.vue'

Vue.component('app-agent-bonus', AppAgentBonus);
new Vue({
    el: '#AppAgentBonus',
    store,
});
