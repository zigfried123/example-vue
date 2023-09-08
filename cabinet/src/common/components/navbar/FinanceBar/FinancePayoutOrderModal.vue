<template>
    <modal id="finance-order-payout" @show="modalShow">
        <template slot="header">
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
            <h3>Запрос на вывод средств</h3>
            <p>Подробнее об условиях выплат можно узнать <a href="/tools/groups" target="_blank">тут</a></p>
        </template>
        <template slot="body">
            <div class="bubble-list">

                <div v-if="sharedState.currentPaymentData" class="bubble clearfix text-center">
                    <b>Ваш метод запроса выплаты:</b>
                    <p>
                        <a href="/financeAccounting/default/update">
                            {{ sharedState.currentPaymentData.title }} <i class="icon-edit"></i>
                        </a>
                    </p>
                </div>
                <div v-if="sharedState.requests.automatic" class="bubble clearfix">
                    <img src="/images/payout/schedule.png" alt="Lida">
                    <div class="bubble-content">
                        <div class="point"></div>
                        <h4>Автоматическая</h4>
                        <p>
                            <b>Периодичность: </b> {{sharedState.requests.automatic.period}}<br>
                            <b>Ближайшая дата: </b> {{sharedState.requests.automatic.next_payment_day}}<br>
                            <b>Будет выплачено: </b> {{sharedState.requests.automatic.expected_payment}} <img
                                v-show="!sharedState.requests.automatic.expected_payment.length"
                                src="/assets/new/images/ajax-loader.gif"/><br>
                            <b>Срок исполнения: </b> <span
                                v-html="sharedState.requests.automatic.period_of_execution"></span><br>
                            см. <a href="/financeAccounting/default/index" target="_blank">Способы выплат</a>
                        </p>
                        <template v-for="restriction in sharedState.requests.automatic.restrictions">
                            <a :href="restriction.url" class="btn mini red">{{restriction.name}}</a>
                        </template>
                    </div>
                </div>
                <div v-if="sharedState.requests.on_request" class="bubble clearfix">
                    <img src="/images/payout/request.png" alt="Lida">
                    <div class="bubble-content">
                        <div class="point"></div>
                        <h4>По запросу</h4>
                        <p>
                            <b>Доступно для: </b> {{sharedState.requests.on_request.available_for_groups | join}}<br>
                            <b>Доступно для вывода: </b> {{sharedState.requests.on_request.expected_payment}}<br>
                            <b>Срок исполнения: </b> <span
                                v-html="sharedState.requests.on_request.period_of_execution"></span><br>
                            см. <a href="/financeAccounting/default/index" target="_blank">Способы выплат</a>
                        </p>
                        <a v-if="sharedState.requests.on_request.enable" href="/financeAccounting/payoutRequests/create"
                           class="btn mini green">Заказать</a>

                        <div v-for="error in sharedState.requests.on_request.errors" class="alert alert-danger">
                            {{ error }}
                        </div>

                    </div>
                </div>
                <div v-if="sharedState.requests.on_request_with_hold" class="bubble clearfix">
                    <img src="/images/payout/fast.png" alt="Lida">
                    <div class="bubble-content">
                        <div class="point"></div>
                        <h4>По запросу (c использованием HOLD)</h4>
                        <p>
                            <b>Комиссия: </b> {{sharedState.requests.on_request_with_hold.commission}}%<br>
                            <b>Доступно для: </b>
                            {{sharedState.requests.on_request_with_hold.available_for_groups | join}}
                            <br>
                            <b>Доступно для вывода: </b>
                            {{sharedState.requests.on_request_with_hold.expected_payment}}<br>
                            <b>Срок исполнения: </b> <span
                                v-html="sharedState.requests.on_request_with_hold.period_of_execution"></span><br>
                            см. <a href="/financeAccounting/default/index" target="_blank">Способы выплат</a>
                        </p>
                        <a v-if="sharedState.requests.on_request_with_hold.enable"
                           href="/financeAccounting/payoutRequests/createFastPrepayment" class="btn mini green">Заказать</a>

                        <div v-for="error in sharedState.requests.on_request_with_hold.errors"
                             class="alert alert-danger">
                            {{ error }}
                        </div>
                    </div>
                </div>
                <div v-if="sharedState.requests.in_agent" class="bubble clearfix last">
                    <img src="/images/payout/agent_cabinet.png" alt="Lida">
                    <div class="bubble-content">
                        <div class="point"></div>
                        <h4>Hold и баланс в рекламную систему</h4>
                        <p>
                            <b>Доступно для: </b> {{sharedState.requests.in_agent.available_for_groups | join}}<br>
                            см. <a href="/financeAccounting/default/index" target="_blank">Способы выплат</a>
                        </p>
                        <a href="/financeAccounting/payoutRequests/createAgentPayoutRequest" class="btn mini green">
                            Заказать
                        </a>
                    </div>
                </div>
            </div>
        </template>
    </modal>
</template>
<script>
    import axios from 'axios';
    import Modal from '../../modals/Modal.vue';
    import Store from './store/Store';

    export default {
        name: 'finance-bar',
        components: {
            'modal': Modal,
        },
        props: {
            'url': {
                type: String,
                default: '/financeAccounting/payout/getExpectedPayment'
            }
        },
        data() {
            return {
                sharedState: Store.finance.state,
            }
        },
        filters: {
            'join': function (value) {
                return value.join(', ');
            },
        },
        watch: {},
        methods: {
            modalShow() {
                let vm = this;
                if (!vm.sharedState.requests.automatic.expected_payment) {
                    // console.log(vm.url);
                    //vm.states.loading = true;
                    axios.get(this.url)
                        .then(function (response) {
                            vm.sharedState.requests.automatic.expected_payment = response.data.value;
                        })
                        .catch(function (error) {
                            console.log(error);
                        })
                        .then(function () {
                            //vm.states.loading = false;
                        });

                }
            }
        },
    }
</script>
<style scoped>
    .btn {
        float: right;
        margin: 5px 1px;
    }

    h4 {
        margin-bottom: 2px;
        padding-bottom: 0px;
    }

    .clearfix:after {
        visibility: hidden;
        display: block;
        font-size: 0;
        content: " ";
        clear: both;
        height: 0;
    }

    .clearfix {
        display: inline-block;
    }

    * html .clearfix {
        height: 1%;
    }

    .clearfix {
        display: block;
    }

    .bubble-list .bubble {
        margin-bottom: 20px;
    }

    .bubble-list .bubble.last {
        margin-bottom: 0;
    }

    .bubble-list .bubble > img {
        float: left;
        width: 135px;
        margin-top: 0px;
        /*border: 3px solid #fff;
        border-radius: 10px;*/
    }

    .bubble-list .bubble .bubble-content {
        position: relative;
        float: left;
        margin-left: 20px;
        width: 63%;
        min-height: 155px;
        padding: 0px 20px;
        border-radius: 10px;
        background: #fff;
        box-shadow: 1px 1px 5px rgba(0, 0, 0, .2);
    }

    .bubble-list .bubble .bubble-content .point {
        width: 0;
        height: 0;
        border-top: 10px solid transparent;
        border-bottom: 10px solid transparent;
        border-right: 12px solid #fff;
        position: absolute;
        left: -12px;
        top: 65px;
    }

</style>