import Vue from 'vue'
//import Navbar from './../components/navbar/Navbar.vue'
import Regata from '../../../src/common/components/navbar/regata.vue'
import InboxBar from '../../../src/common/components/navbar/InboxBar.vue'
import FinanceBar from '../../../src/common/components/navbar/FinanceBar/FinanceBar.vue'
import Profile from '../../../src/common/components/navbar/Profile.vue'
import SavedReports from '../../../src/common/components/navbar/SavedReports.vue'
import Action2019 from '../../../src/common/components/navbar/Action2019.vue'
import Action2019Detailed from '../../../src/common/components/navbar/Action2019Detailed.vue'
import Restrictions from '../../../src/common/components/navbar/Restrictions.vue'
import Manager from '../../../src/common/components/navbar/Manager.vue'
import FinancePayoutOrderModal from '../../../src/common/components/navbar/FinanceBar/FinancePayoutOrderModal.vue'
import IdWeb from '../../../src/common/components/navbar/IdWeb.vue'
import axios from 'axios'
import store from '../../../src/common/components/navbar/store/VuexStore'
axios.defaults.headers.common['X-Pjax'] = 1;
window.Vue = Vue;
window.axios = axios;
/*new Vue({
    el: '#navbar',
    render: h => h(Navbar)
});*/

if ($('#id_web').length) {
    new Vue({
        el: '#id_web',
        store,
        render: h => h(IdWeb)
    });
}


if ($('#inbox_bar').length) {
    new Vue({
        el: '#inbox_bar',
        render: h => h(InboxBar)
    });
}

if ($('#profile').length) {
    new Vue({
        el: '#profile',
        store,
        render: h => h(Profile)
    });
}

if ($('#savedReports').length) {
    new Vue({
        el: '#savedReports',
        render: h => h(SavedReports)
    });
}


if ($('#regata').length) {
    new Vue({
        el: '#regata',
        render: h => h(Regata)
    });
}

if ($('#restrictions').length) {
    new Vue({
        el: '#restrictions',
        render: h => h(Restrictions)
    });
}

if ($('#manager').length) {
    new Vue({
        el: '#manager',
        store,
        render: h => h(Manager)
    });
}

if ($('#finance_bar').length) {
    new Vue({
        el: '#finance_bar',
        render: h => h(FinanceBar)
    });

    new Vue({
        el: '#finance_order_payout',
        render: h => h(FinancePayoutOrderModal)
    });
}
