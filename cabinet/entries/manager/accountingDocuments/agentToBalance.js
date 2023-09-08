import Vue from './baseDocumentEntry';

import {store} from '../../../src/manager/accountingDocuments/agentToBalance/store';
import AppAgentToBalance from '../../../src/manager/accountingDocuments/agentToBalance/agentToBalance.vue'

Vue.component('app-agent-to-blance', AppAgentToBalance);
new Vue({
    el: '#AgentToBalance',
    store,
});
