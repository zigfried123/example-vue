import Vue from 'vue';
import axios from 'axios';
import russianLocal from '../../../common/partials/russianLocale.js';
import VueMask from 'v-mask'

window.Vue = Vue;
window.axios = axios;

//vue material
import VueMaterial from 'vue-material';
import 'vue-material/dist/vue-material.css'
import 'vue-material/dist/theme/default.css'
import 'material-icons/iconfont/material-icons.css';

//validation with vuelidate
import Vuelidate from 'vuelidate';

//styles
import '../../../../src/common/contractors/selfEmployed/styles/styles.css';

Vue.use(VueMaterial);
Vue.use(Vuelidate);
Vue.use(VueMask);

Vue.material.locale = russianLocal;
Vue.material.locale.dateFormat = 'yyyy-MM-dd';


import {store} from '../../../../src/manager/contractors/selfEmployed/create/store';
import AppManagerSelfEmployedCreate from '../../../../src/manager/contractors/selfEmployed/create/selfEmployedCreate.vue'

Vue.component('app-manager-self-employed-create', AppManagerSelfEmployedCreate);
new Vue({
    el: '#AppManagerSelfEmployedCreate',
    store
});
