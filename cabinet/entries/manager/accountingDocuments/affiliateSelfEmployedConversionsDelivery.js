import Vue from './baseDocumentEntry';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

import {store} from '../../../src/manager/accountingDocuments/affiliateSelfEmployedConversionsDelivery/store';

import layout from '../../../src/manager/accountingDocuments/affiliateSelfEmployedConversionsDelivery/affiliateSelfEmployedConversionsDelivery.vue'
import documentsWorkflow from '../../../src/manager/accountingDocuments/components/documentWorkflow/documentsWorkflow.vue';
import docView from '../../../src/manager/accountingDocuments/affiliateSelfEmployedConversionsDelivery/components/docView.vue';

const baseUrl = '/financeAccountingDocuments/affiliateSelfEmployedConversionsDelivery';

const routes = [
    {
        path: '',
        name: 'layout',
        component: layout,
        props: {
            baseUrl: baseUrl
        },
        children: [
            {
                path: '',
                name: 'view',
                component: docView,
                props: {
                    baseUrl: baseUrl
                }
            },
            {
                path: 'workflow',
                name: 'workflow',
                component: documentsWorkflow,
                props: {
                    baseUrl: baseUrl
                }
            }
        ]
    },
];

const router = new VueRouter({
    routes
});

new Vue({
    el: '#AppAffiliateSelfEmployedConversionsDelivery',
    store,
    router
});
