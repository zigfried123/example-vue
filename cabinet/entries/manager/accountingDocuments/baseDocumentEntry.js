import Vue from 'vue'
import axios from 'axios'
import russianLocal from '../../common/partials/russianLocale.js';

window.Vue = Vue;
window.axios = axios;

//vue material
import VueMaterial from 'vue-material';
import 'vue-material/dist/vue-material.css'
import 'vue-material/dist/theme/default.css'
import 'material-icons/iconfont/material-icons.css';

//validation with vuelidate
import Vuelidate from 'vuelidate'

//element ui tables
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import { DataTables, DataTablesServer } from 'vue-data-tables'

//styles
import '../../../src/manager/accountingDocuments/styles/docs.css';

// set language to RU
import lang from 'element-ui/lib/locale/lang/ru-RU';
import locale from 'element-ui/lib/locale';

locale.use(lang);
Vue.use(VueMaterial);
Vue.use(ElementUI);
Vue.use(DataTables);
Vue.use(DataTablesServer);
Vue.use(Vuelidate);

Vue.material.locale = russianLocal;

export default Vue;