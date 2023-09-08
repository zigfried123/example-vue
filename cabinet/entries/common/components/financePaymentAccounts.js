import Vue from 'vue';

/**
 * Common component
 */
import financePaymentAccountsCommon from '../../../src/common/components/financePaymentAccounts/common.vue';

/**
 * Common styles
 */
import '../../../src/common/components/financePaymentAccounts/css/style.css';

/**
 * Stores
 */
import {commonStore} from '../../../src/common/components/financePaymentAccounts/store/commonStore.js';
var _ = require('lodash');


/**
 * Directives
 */
import VueMaskDirective from 'vue-mask-directive'
Vue.use(VueMaskDirective)


/**
 * Vendors
 */
import VueMaterial from 'vue-material';
import 'vue-material/dist/vue-material.css'
import 'vue-material/dist/theme/default.css'
import '../../../src/common/components/financePaymentAccounts/css/md_adapter.css';
import '../../../src/common/components/financePaymentAccounts/css/multiselect_adapter.css';
import VueCarousel from 'vue-carousel';


let target = $('#finance-payment-accounts');
if (target.length) {
    Vue.use(VueMaterial);
    Vue.use(VueCarousel);
    try {
        window.financePaymentAccounts = new Vue({
            el: '#finance-payment-accounts',
            store: commonStore,
            render: h => h(financePaymentAccountsCommon),
        }).$children[0];

        window.financePaymentAccounts.setConfigData({
            baseUrl: document.URL + '/'
        });


        window.financePaymentAccounts.initData();
    } catch (e) {
        target.find('.pa__pre-loader-wrap').find('.pa__pre-loader').removeClass('spin');
        target.find('.pa__pre-loader-wrap').find('.pa__pre-loader').addClass('error');
        target.find('.pa__pre-loader-wrap').find('span').html('Ошибка загрузки... <br>Пожалуйста, попробуте поздне...');
        target.find('.pa__pre-loader-wrap').find('i').removeClass('fa-gear').addClass('fa-close');
        notify('Ошибка загрузки... Пожалуйста, попробуйте позднее...', 'error');
    }
}



