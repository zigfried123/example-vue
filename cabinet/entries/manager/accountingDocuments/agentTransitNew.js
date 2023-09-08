import Vue from './baseDocumentEntry';

import {store} from '../../../src/manager/accountingDocuments/agentTransitNew/store';
import AppAgentTransit from '../../../src/manager/accountingDocuments/agentTransitNew/agentTransit.vue'

Vue.component('app-agent-transit', AppAgentTransit);
new Vue({
    el: '#AgentTransitNew',
    store,
});
