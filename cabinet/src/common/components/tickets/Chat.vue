<template>
    <div class="ticket-dialog">
        <div class="container-ticket-messages" v-bind:style="styleObject">
            <ticket-chat-message
                    v-for="(item, index) in messages"
                    :date="formatDate(item.created)"
                    :author="item.account_type == leftUser ? leftAuthor : rightAuthor"
                    :text="item.message"
                    :position="item.account_type == leftUser ? 'left' : 'right'"
                    :key="index">
            </ticket-chat-message>
        </div>
        <hr>
        <div class="field-comment">
            <textarea v-model="newMessage"
                      :name="nameFieldInput"
                      :id="idFieldInput"
                      v-on:keyup.ctrl.enter="sendMessage"
                      placeholder="Введите сообщение..."></textarea>
            <button class="btn default" type="submit" @click.prevent="sendMessage">
                <i class="icon-arrow-right"></i>
            </button>
        </div>
    </div>
</template>
<script>
    import axios from 'axios'

    export default {
        name: 'ticket-chat',
        data () {
            return {
                styleObject: {
                    height: '400px',
                },
                messages: [],
                tokenName: 'nonce_token',
                newMessage: '',
            }
        },
        props: {
            nameFieldInput: String,
            idFieldInput: String,
            base64JsonMessages: String,
            url: String,
            urlForGetNewMessages: String,
            token: String,
            leftAuthor: String,
            rightAuthor: String,
            leftUser: String,
            rightUser: String,
            ticketId: String,
        },
        mounted() {
            this.messages = JSON.parse(atob(this.base64JsonMessages));
            this.resizeContainer();
        },
        updated() {
            this.scrollBottom();
        },
        created() {
            window.addEventListener("resize", this.resizeContainer);

            var $this = this;
            setInterval(function() {
                $this.getNewMessages();
            }, 5000 )
        },
        destroyed() {
            window.removeEventListener("resize", this.resizeContainer);
        },
        methods: {
            resizeContainer() {
                var elementTicketDialog = document.getElementsByClassName('ticket-dialog');
                var rect = elementTicketDialog[0].getBoundingClientRect();
                var height = Math.max(150,  window.innerHeight - rect.top - 250);

                this.styleObject.height = height + 'px';
            },
            getNewMessages() {
                var params = Array();
                params[this.tokenName] = this.token;
                params['ticket_id'] = this.ticketId;
                params['beginning_with_message_id'] = this.getLastIdMessage();

                var queryString = this.arrayToQueryParams(params);
                var $this = this;

                axios
                    .post(this.urlForGetNewMessages, queryString)
                    .then(function(response) {
                        response.data.forEach(function(message) {
                            $this.addMessage(message);
                        });
                        $this.scrollBottom();
                    });
            },
            getLastIdMessage() {
                var id = 0;

                this.messages.forEach(function (message) {
                    var currentMessageId = parseInt(message.id);
                    id = currentMessageId > id ? currentMessageId : id;
                });

                return id;
            },
            addMessage(message) {
                for (var i = 0; i < this.messages.length; i++) {
                    if (parseInt(this.messages[i].id) == parseInt(message.id)) {
                        return false;
                    }
                }

                this.messages.push(message);

                return true;
            },
            sendMessage() {
                if (this.newMessage.trim() == '') {
                    return;
                }

                var params = Array();
                params[this.tokenName] = this.token;
                params[this.nameFieldInput] = this.newMessage;

                var queryString = this.arrayToQueryParams(params);
                var $this = this;

                $this.newMessage = '';
                axios
                    .post(this.url, queryString)
                    .then(function(response) {
                        $this.addMessage(response.data);
                        $this.scrollBottom();
                    });
            },
            scrollBottom() {
                var container = this.$el.querySelector('.container-ticket-messages');
                container.scrollTop = container.scrollHeight;
            },
            arrayToQueryParams (params) {
                return Object.keys(params).map((key) => {
                    return encodeURIComponent(key) + '=' + encodeURIComponent(params[key])
                }).join('&');
            },
            formatDate(date) {
                var formatDate = new Date(date);
                return ("0" + formatDate.getDate()).slice(-2) + '.' +
                       ("0" + (formatDate.getMonth() + 1)).slice(-2) + '.' +
                       formatDate.getFullYear() + ' ' +
                       formatDate.getHours() + ':' +
                       ("0" + formatDate.getMinutes()).slice(-2);
            }
        }
    }
</script>