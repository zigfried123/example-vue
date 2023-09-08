<template>
    <li @mouseover="toggleOpen()" @mouseout="toggleOpen()" class="dropdown billing"
        :class="{'open' : states.open}">
        <a class="clearfix dropdown-toggle" data-toggle="dropdown" href="#">
            <i class="icon-credit-card clearfix"></i></a>
        <ul class="inbox dropdown-menu" style="margin-top: -0.5px;">
            <li style="padding: 0; text-transform: none;" class="nav-header">
                <p style="font-size: 16px">Баланс</p>
                <img v-if="states.loading" src="/assets/new/images/ajax-loader.gif" alt=""/>
            </li>
            <li v-if="items.length && item.visible" v-for="item in items" class="nav-header">
                <div class="row-fluid">
                    <div class="span6">{{item.title}}</div>
                    <div class="span6">
                        <div>
                            {{item.value}}
                            <img v-show="item.loading" src="/assets/new/images/ajax-loader.gif"/>
                            <span class="currency">{{item.currency}}</span>
                        </div>
                        <div class="helper">{{item.help}}</div>
                        <div class="helper helper-red" v-if="item.badge">{{item.badge}}</div>
                    </div>
                </div>
            </li>
            <li class="nav-header">
                <div class="row-fluid" style="padding-bottom: 15px; text-align: center;">
                    <div class="span12">
                        <a :href="url_history" class="btn gray">История</a>
                        <a @click="orderFinancePayout" class="btn green" style="margin-right: 10px;">Заказать выплату</a>
                    </div>
                </div>
            </li>
        </ul>
    </li>
</template>
<script>
    import axios from 'axios'
    import forEach from 'lodash/forEach';
    import Store from './store/Store';
    export default {
        name: 'finance-bar',
        props: {
            'url_history': {
                type: String,
                default: '/financeAccounting/history/index'
            },
            'url_get_items': {
                type: String,
                default: '/financeAccounting/default/getBalanceData'
            },
            url_get_get_available_balance_and_expected_payment: {
                type: String,
                default: '/financeAccounting/default/getAvailableBalanceAndExpectedPayment'
            },
        },
        data () {
            return {
                states: {
                    open: false,
                    loading: false,
                },
                counts: {},
                items: [],
                sharedState: Store.finance.state,
            }
        },
        watch: {
            'states.open': function () {
                let vm = this;
                forEach(vm.items, function (item, key) {
                    if (item.value.toString().indexOf('ajax://') !== -1 && !item.loading) {
                        if (vm.sharedState.requests.automatic.expected_payment) {
                            vm.items[key].value = vm.sharedState.requests.automatic.expected_payment;
                            return;
                        }
                        let url = item.value.substring(7);
                        vm.items[key].value = '';
                        vm.items[key].loading = true;
                        vm.states.loading = true;
                        axios.get(url)
                            .then(function (response) {
                                vm.items[key].value = response.data.value;
                                vm.items[key].loading = false;
                                vm.sharedState.requests.automatic.expected_payment = vm.items[key].value;
                            })
                            .catch(function (error) {
                                console.log(error);
                            })
                            .then(function () {
                                vm.states.loading = false;
                            });
                    }
                });
            },
        },
        methods: {
            toggleOpen() {
                this.states.open = !this.states.open;

                if (this.states.loading === false && this.items.length === 0) {
                    this.getItems();
                }
            },
            orderFinancePayout(){
                $('#finance-order-payout').modal('show');
            },
            appendAvailableBalanceAndExpectedPayment() {
                let vm = this;
                axios
                    .get(this.url_get_get_available_balance_and_expected_payment)
                    .then(function (response) {

                        for (let name in response.data) {
                            for (let key in vm.items) {
                                if (vm.items[key].name === name) {
                                    vm.items[key].value = response.data[name];
                                    vm.items[key].loading = false;
                                }
                            }
                        }

                        vm.sharedState.requests.on_request.expected_payment = response.data.availableBalance;
                    })
                    .catch(function (error) {
                        console.log(error);
                    })
                    .then(function () {
                        vm.states.loading = false;
                    });
            },
            getItems() {
                let vm = this;
                vm.states.loading = true;
                axios
                    .get(this.url_get_items)
                    .then(function (response) {
                        vm.items = response.data.items;

                        for (let key in vm.items) {
                            if (vm.items[key].afterLoading) {
                                vm.items[key].value = '';
                                vm.items[key].loading = true;
                            }
                        }

                        vm.sharedState.requests = response.data.requests;
                        vm.sharedState.currentPaymentData = response.data.currentPaymentData;

                        vm.appendAvailableBalanceAndExpectedPayment();
                    })
                    .catch(function (error) {
                        console.log(error);
                    })
                    .then(function () {
                        vm.states.loading = false;
                    });
                return [];
            }
        }
    }
</script>

<style>
    .helper-red {
        color: red !important;
    }
    .btn.green {
        color: white !important;
    }
    .btn.gray{
        color: #333333 !important;
    }
    .btn.mini {
        height: auto !important;
    }
    body {
        font-size: 13px !important;
        letter-spacing: inherit !important;
    }
</style>
