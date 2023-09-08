import Vue from 'vue'
import axios from 'axios'
window.Vue = Vue;
window.axios = axios;

//vue material
import VueMaterial from 'vue-material';
import 'vue-material/dist/vue-material.css'
import 'vue-material/dist/theme/default.css'
import 'material-icons/iconfont/material-icons.css';

Vue.use(VueMaterial);

import {store} from '../../../src/manager/trafficGenerator/store';
import AppClicksGenerator from '../../../src/manager/trafficGenerator/clicksGenerator.vue'

//styles
import '../../../src/manager/trafficGenerator/styles.css';

Vue.component('app-clicks-generator', AppClicksGenerator);

new Vue({
    el: '#AppClicksGenerator',
    store,
});

