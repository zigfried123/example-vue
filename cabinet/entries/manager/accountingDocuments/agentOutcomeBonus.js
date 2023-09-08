import Vue from './baseDocumentEntry';

import {store} from '../../../src/manager/accountingDocuments/agentOutcomeBonus/store';
import AppAgentOutcomeBonus from '../../../src/manager/accountingDocuments/agentOutcomeBonus/agentOutcomeBonus.vue'

Vue.component('app-agent-outcome-bonus', AppAgentOutcomeBonus);
new Vue({
    el: '#AppAgentOutcomeBonus',
    store,
});
