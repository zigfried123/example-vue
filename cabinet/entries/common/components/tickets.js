import Vue from 'vue'
import TicketChat from '../../../src/common/components/tickets/Chat.vue'
import TicketChatMessage from '../../../src/common/components/tickets/Message.vue'
import axios from 'axios'

axios.defaults.headers.common['X-Pjax'] = 1;

window.Vue = Vue;
window.axios = axios;

Vue.component('ticket-chat', TicketChat);
Vue.component('ticket-chat-message', TicketChatMessage);

new Vue({
    el: '#chat-ticket',
});



