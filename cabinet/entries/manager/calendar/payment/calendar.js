import Vue from 'vue'
import axios from 'axios'

window.Vue = Vue;
window.axios = axios;

//vue material
import VueMaterial from 'vue-material';
import 'vue-material/dist/vue-material.css'
import 'vue-material/dist/theme/default.css'
import 'material-icons/iconfont/material-icons.css';

import '../../../../src/manager/calendar/styles/calendar.scss';
import '../../../../src/manager/calendar/styles/cell.scss';

Vue.use(VueMaterial);

import {store} from '../../../../src/manager/calendar/payment/store';
import AppPaymentCalendar from '../../../../src/manager/calendar/payment/calendar.vue'

Vue.component('app-payment-calendar', AppPaymentCalendar);
new Vue({
    el: '#AppPaymentCalendar',
    store
});
