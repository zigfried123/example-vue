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
import AppConversionsGenerator from '../../../src/manager/trafficGenerator/ConversionsGenerator.vue'

//styles
import '../../../src/manager/trafficGenerator/styles.css';

import russianLocal from '../../common/partials/russianLocale.js';

Vue.material.locale = russianLocal;

Vue.component('app-conversions-generator', AppConversionsGenerator);

new Vue({
    el: '#AppConversionsGenerator',
    store,
});

