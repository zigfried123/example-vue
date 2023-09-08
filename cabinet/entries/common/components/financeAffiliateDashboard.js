import Vue from 'vue';
/**
 * Common component
 */
import common from '../../../src/common/components/financeAffiliateDashboard/common.vue';
/**
 * Common styles
 */
import '../../../src/common/components/financeAffiliateDashboard/css/style.css';
/**
 * Stores
 */
import {commonStore} from '../../../src/common/components/financeAffiliateDashboard/store/commonStore.js';
/**
 * Vendors
 */
import VueMaterial from 'vue-material';
import 'vue-material/dist/vue-material.css'
import 'vue-material/dist/theme/default.css'
import '../../../src/common/components/financePaymentAccounts/css/md_adapter.css';
import '../../../src/common/components/financePaymentAccounts/css/multiselect_adapter.css';
import VueCarousel from 'vue-carousel';
import russianLocale from "../../../src/common/components/financeAffiliateDashboard/partials/russianLocale";


var _ = require('lodash');




let target = $('#finance-affiliate-dashboard');
if (target.length) {
    Vue.use(VueMaterial);
    Vue.use(VueCarousel);

    Vue.material.locale = russianLocale;

    try {
        window.financeAffiliateDashboard = new Vue({
            el: '#finance-affiliate-dashboard',
            store: commonStore,
            render: h => h(common),
        }).$children[0];

    } catch (e) {
        target.find('.pa__pre-loader-wrap').find('.pa__pre-loader').removeClass('spin');
        target.find('.pa__pre-loader-wrap').find('.pa__pre-loader').addClass('error');
        target.find('.pa__pre-loader-wrap').find('span').html('Ошибка загрузки... <br>Пожалуйста, попробуте поздне...');
        target.find('.pa__pre-loader-wrap').find('i').removeClass('fa-gear').addClass('fa-close');
        notify('Ошибка загрузки... Пожалуйста, попробуйте позднее...', 'error');
    }
}



