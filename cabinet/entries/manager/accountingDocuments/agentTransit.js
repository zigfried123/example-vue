import Vue from './baseDocumentEntry';

import {store} from '../../../src/manager/accountingDocuments/agentTransit/store';
import AppAgentTransit from '../../../src/manager/accountingDocuments/agentTransit/agentTransit.vue'

Vue.component('app-agent-transit', AppAgentTransit);
new Vue({
    el: '#AgentTransit',
    store,
});
