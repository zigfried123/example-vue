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

Vue.use(VueMaterial);

import {store} from '../../../../src/manager/calendar/hold/store';
import AppHoldCalendar from '../../../../src/manager/calendar/hold/calendar.vue'

Vue.component('app-hold-calendar', AppHoldCalendar);
new Vue({
    el: '#AppHoldCalendar',
    store
});
