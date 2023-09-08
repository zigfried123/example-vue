import Vue from 'vue'
import axios from 'axios'
import VueMask from 'v-mask'


window.Vue = Vue;
window.axios = axios;

//vue material
import VueMaterial from 'vue-material';
import 'vue-material/dist/vue-material.css'
import 'vue-material/dist/theme/default.css'
import 'material-icons/iconfont/material-icons.css';

//validation with vuelidate
import Vuelidate from 'vuelidate'

//styles
import '../../../../src/common/contractors/selfEmployed/styles/styles.css';

Vue.use(VueMaterial);
Vue.use(Vuelidate);
Vue.use(VueMask);


import {store} from '../../../../src/common/contractors/selfEmployed/bankAccounts/store';
import AppBankAccounts from '../../../../src/common/contractors/selfEmployed/bankAccounts/bankAccounts.vue';

Vue.component('app-bank-accounts', AppBankAccounts);
new Vue({
    el: '#AppBankAccounts',
    store,
});