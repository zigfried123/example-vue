<template>
    <transition name="fade">
        <div v-if="paymentAccount" class="pa__flex v-items-center h-space-between pa__account-wrap"
             v-bind:class="{'__unactive' : !paymentAccount.isActive()}">
            <div class="pa__flex v-items-center pa__pseudo-btn" v-on:click="fullDescription.state = true">
                <i class="fa"
                   v-bind:class="{
                            'fa-credit-card' : !paymentAccount.isLoading,
                            'fa-refresh fa-spin md-primary': paymentAccount.isLoading
                        }"
                ></i>&nbsp;
                <span>{{ paymentAccount.title ? paymentAccount.title : '#' + paymentAccount.id }}</span>
            </div>

            <div v-if="paymentAccount.details">
                <md-dialog :md-active.sync="fullDescription.state">
                    <md-dialog-title>{{ paymentAccount.title ? paymentAccount.title : '#' + paymentAccount.id }}</md-dialog-title>

                    <md-table>
                        <md-table-row v-for="(value, key) in paymentAccount.details" :key="key + '_' + paymentAccount.id">
                            <md-table-cell>{{ key }}</md-table-cell>
                            <md-table-cell>{{ value }}</md-table-cell>
                        </md-table-row>
                    </md-table>

                    <md-dialog-actions>
                        <md-button class="md-primary" v-on:click="fullDescription.state = false">OK</md-button>
                    </md-dialog-actions>
                </md-dialog>
            </div>

            <div class="control-wrap pull-right" v-if="!paymentAccount.isLoading">

                <i v-if="isDefault()">
                    Используется по-умолчанию
                </i>

                <div
                        class="pa__btn-wrap"
                        v-if="paymentAccount.isActive() && !isDefault() && isAvailableAsDefault()"
                        data-md-tooltip="Сделать основным"
                        v-on:click="actionMakeDefault()"
                >
                    <i class="fa fa-star pa__btn-icon">

                    </i>
                </div>


                <div class="pa__btn-wrap" v-on:click="actionToggleActive()"
                     v-bind:data-md-tooltip="paymentAccount.isActive() ? 'Отключить' : 'Активировать'"
                     v-if="!isDefault()"
                >
                    <i class="fa pa__btn-icon"
                       v-bind:class="{
                            'fa-trash' : paymentAccount.isActive(),
                            'fa-history' : !paymentAccount.isActive()
                        }">

                    </i>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
    import PaymentAccount from '../../classes/PaymentAccount';
    import Loader from "../../classes/Loader";

    export default {
        name: "pa_account",
        data: () => ({
            fullDescription: {
                state: false
            }
        }),
        props: {
            /**
             * @property {PaymentAccount}
             */
            paymentAccount: {}
        },
        methods: {
            /**
             * @return {bool}
             */
            isDefault() {
                let defAcc = this.$store.getters.getDefaultPaymentAccount;
                return defAcc && defAcc.id === this.paymentAccount.id;
            },
            isAvailableAsDefault() {
                let activePaymentType = this.$store.getters.getActivePaymentType;
                return activePaymentType.canBeDefault;
            },
            showFullDescription(){
                this.fullDescription.state = true;
            },
            actionToggleActive() {

                let paymentAccount = this.paymentAccount;
                let needleStatus = paymentAccount.state === PaymentAccount.STATE_ACTIVE
                    ? PaymentAccount.STATE_DISABLED
                    : PaymentAccount.STATE_ACTIVE;

                paymentAccount.isLoading = true;
                new Loader()
                    .setData({
                        id: paymentAccount.id,
                        status: needleStatus
                    })
                    .setUrl(this.$store.getters.getConfig.baseUrl + 'changeStatus')
                    .setMethod('POST')
                    .run()
                    .then(function (response) {
                        if (response.data === undefined) {
                            notify('Ошибка сервера...', 'error');
                            return;
                        }

                        if (response.data.success === true) {
                            paymentAccount.setState(needleStatus);
                        } else {
                            notify('Не удалось обновить статус...', 'error');
                        }
                    })
                    .finally(function () {
                        paymentAccount.isLoading = false;
                    });
            },

            /**
             * Сделать основным
             */
            actionMakeDefault() {
                let _paymentAccount = this.paymentAccount;
                let _store = this.$store;
                _paymentAccount.isLoading = true;
                new Loader()
                    .setUrl(this.$store.getters.getBaseUrl + 'makeDefault')
                    .setMethod('POST')
                    .setData({
                        id: _paymentAccount.id
                    })
                    .run()
                    .then(function (response) {
                        if (response.data.success === true) {
                            _store.getters.getDefaultPaymentAccount.setNeedReload(true);
                        } else {
                            notify('Не удалось сделать основным...', 'error');
                        }
                    })
                    .finally(function () {
                        _paymentAccount.isLoading = false;
                    });
            }
        }
    }
</script>

<style scoped>
    .pa__account-wrap {
        min-height: 46px;
        margin: 10px 10px 10px -15px;
        padding: 0px 0 0 15px;
        transition: 1s;
    }

    .pa__account-wrap.__unactive {
        color: gray !important;
    }

    .pa__account-wrap:hover {
        background: var(--pa-accent-light);
    }

    .pa__account-wrap > div > i {
        margin: 10px 10px 10px 0;
    }

    .pa__account-wrap > .control-wrap {
        float: left;
    }

</style>