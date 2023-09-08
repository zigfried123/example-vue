import Vue from 'vue';
import axios from 'axios';

window.Vue = Vue;
window.axios = axios;

//vue material
import VueMaterial from 'vue-material';
import 'vue-material/dist/vue-material.css';
import 'vue-material/dist/theme/default.css';
import 'material-icons/iconfont/material-icons.css';

//styles
import '../../../../src/common/contractors/selfEmployed/styles/styles.css';

Vue.use(VueMaterial);

import {store} from '../../../../src/webmaster/contractors/selfEmployed/view/store';
import AppSelfEmployedViewWebmaster from '../../../../src/webmaster/contractors/selfEmployed/view/selfEmployedView.vue';

Vue.component('app-self-employed-view-webmaster', AppSelfEmployedViewWebmaster);
new Vue({
    el: '#AppSelfEmployedViewWebmaster',
    store,
});