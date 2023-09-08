import Vue from './baseDocumentEntry';

import {store} from '../../../src/manager/accountingDocuments/agentNdsRefund/store';
import AppAgentNdsRefund from '../../../src/manager/accountingDocuments/agentNdsRefund/agentNdsRefund.vue'

Vue.component('app-agent-nds-refund', AppAgentNdsRefund );
new Vue({
    el: '#AgentNdsRefund',
    store,
});
