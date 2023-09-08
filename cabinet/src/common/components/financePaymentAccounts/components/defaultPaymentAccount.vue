<template>
    <div>
        <h5>Автоматические выплаты</h5>
        <div id="groupsPanel" class="md-card md-theme-default pa__panel_wrap">
            <div class="pa__default-wrap pa__flex v-items-center">
                <div v-if="isNeedReload" class="pa__default-wrap__loading-state">
                    <h4 class="md-primary">Обновление</h4>
                </div>

                <div v-else-if="defaultPaymentAccount" class="h-stretch">
                    <div class="pa__account-row-wrap pa__pseudo-btn" v-on:click="fullDescription.state = true">
                        <small>Счет</small>
                        <div class="pa__flex v-items-center">
                            <i class="fa fa-credit-card"></i>&nbsp;
                            <span>{{ defaultPaymentAccount.title ? defaultPaymentAccount.title : '#' + defaultPaymentAccount.id }}</span>

                        </div>
                    </div>

                    <div v-if="defaultPaymentAccount.details">
                        <md-dialog :md-active.sync="fullDescription.state">
                            <md-dialog-title>{{ defaultPaymentAccount.title ? defaultPaymentAccount.title : '#' + defaultPaymentAccount.id }}</md-dialog-title>

                            <md-table>
                                <md-table-row v-for="(value, key) in defaultPaymentAccount.details" :key="key + '_' + defaultPaymentAccount.id">
                                    <md-table-cell>{{ key }}</md-table-cell>
                                    <md-table-cell>{{ value }}</md-table-cell>
                                </md-table-row>
                            </md-table>

                            <md-dialog-actions>
                                <md-button class="md-primary" v-on:click="fullDescription.state = false">OK</md-button>
                            </md-dialog-actions>
                        </md-dialog>
                    </div>

                    <div>
                    <span v-if="!defaultPeriodModel" class="md-accent">
                        Не выбрана периодичность выплат
                    </span>
                        <md-field :class="periodFieldClass">
                            <label>Периодичность</label>
                            <md-select
                                    v-model="defaultPeriodModel"
                                    :disabled="periodState === 'loading'"
                            >
                                <md-option
                                        v-for="(availablePeriodTitle, availablePeriodCode)  in availablePeriods"
                                        :key="availablePeriodCode"
                                        :value="availablePeriodCode"
                                >
                                    {{ availablePeriodTitle }}
                                </md-option>
                            </md-select>
                            <md-icon class="md-primary"
                                     v-if="periodState !== 'loading' && periodFieldSuccess && !periodFieldError">
                                check
                                <md-tooltip>Успешно обновлено</md-tooltip>
                            </md-icon>

                            <div v-if="periodState === 'loading'">
                                <md-progress-spinner
                                        class="md-primary"
                                        :md-diameter="30"
                                        md-mode="indeterminate"
                                ></md-progress-spinner>
                            </div>

                            <span class="md-error">{{ periodFieldError }}</span>
                        </md-field>
                    </div>
                </div>

                <div v-else>
                    Не выбран счет по-умолчанию.<br>
                    Автоматические выплаты не будут сформированы
                </div>
            </div>
            <div class="pa__loader-bar-container">
                <md-progress-bar v-if="isNeedReload" md-mode="query">

                </md-progress-bar>
            </div>
        </div>
    </div>
</template>

<script>

    import Loader from "../classes/Loader";
    import PaymentAccount from "../classes/PaymentAccount";

    export default {
        name: "defaultPaymentAccount",
        data() {
            return {
                availablePeriods: {},
                defaultPeriodModel: null,
                defaultPeriodModelCandidate: null,
                periodFieldDisabled: false,
                periodFieldError: '',
                periodFieldSuccess: false,
                periodState: 'enabled',
                periodSave: false,
                fullDescription: {
                    state: false
                }
            }
        },
        computed: {
            defaultPaymentAccount() {
                let defaultPaymentAccount = this.$store.getters.getDefaultPaymentAccount;

                if (!defaultPaymentAccount) {
                    this.loadDefaultPaymentAccount();
                }

                return defaultPaymentAccount;
            },
            periodFieldClass() {
                return {
                    'md-invalid': !!this.periodFieldError
                }
            },
            isLoading() {
                return this.periodState === 'loading';
            },
            isNeedReload() {
                let defaultPaymentAccount = this.$store.getters.getDefaultPaymentAccount;
                if (!defaultPaymentAccount) {
                    return false;
                }
                return this.$store.getters.getDefaultPaymentAccount.needReload;
            }
        },
        methods: {
            loadDefaultPaymentAccount() {
                let store = this.$store;
                let _setAvailablePeriods = this.setAvailablePeriods;
                let _setPeriod = this.setPeriod;
                let _setPeriodFieldError = this.setPeriodFieldError;

                new Loader()
                    .setUrl(this.$store.getters.getBaseUrl + 'getDefaultAccount')
                    .setMethod('GET')
                    .run()
                    .then(function (response) {
                        let item = response.data.data.paymentType;
                        if (item !== undefined && Object.keys(item).length !== 0) {
                            let defaultPaymentAccount = new PaymentAccount()
                                .setId(item.id)
                                .setState(item.state)
                                .setTitle(item.title)
                                .setIsDefault(item.is_default)
                                .setDetails(item.details);
                            store.commit('setDefaultPaymentAccount', defaultPaymentAccount);

                            let availablePeriods = response.data.data.paymentType.available_periods;
                            let currentPeriod = response.data.data.paymentPeriod;
                            _setAvailablePeriods(availablePeriods);
                            _setPeriod(currentPeriod);
                        }
                    })
            },
            setAvailablePeriods(list) {
                this.$set(this, 'availablePeriods', list);
            },
            setPeriod(value) {
                this.$set(this, 'defaultPeriodModel', value);
            },
            actionSavePeriod(defaultPeriodModelCandidate) {
                let _setPeriodFieldDisabled = this.setPeriodFieldDisabled;
                let _setPeriodFieldLoading = this.setPeriodFieldLoading;
                let _setPeriodFieldEnabled = this.setPeriodFieldEnabled;
                let _setPeriodFieldError = this.setPeriodFieldError;
                let _setPeriodFieldSuccess = this.setPeriodFieldSuccess;
                _setPeriodFieldDisabled(true);
                _setPeriodFieldLoading();
                _setPeriodFieldError(null);
                _setPeriodFieldSuccess(false);
                return new Loader()
                    .setUrl(this.$store.getters.getBaseUrl + 'savePaymentPeriod')
                    .setData({
                        period: this.defaultPeriodModel
                    })
                    .setMethod('POST')
                    .setOnCatch(function (error) {
                        _setPeriodFieldError('Не удалось обновить период автоматических выплат');
                    })
                    .run()
                    .then(function (response) {
                        _setPeriodFieldEnabled();
                        _setPeriodFieldSuccess(true);
                    })

                    .finally(function () {
                        _setPeriodFieldDisabled(false);
                    });

            },
            setPeriodFieldDisabled(value) {
                this.$set(this, 'periodFieldDisabled', !!value);
            },
            setPeriodFieldLoading() {
                this.$set(this, 'periodState', 'loading');
            },
            setPeriodFieldEnabled() {
                this.$set(this, 'periodState', 'enabled');
            },
            setPeriodFieldError(value) {
                this.$set(this, 'periodFieldError', value);
            },
            setPeriodFieldSuccess(value) {
                this.$set(this, 'periodFieldSuccess', !!value);
            }
        },
        components: {},
        watch: {
            defaultPeriodModel: function (newValue, oldValue) {
                if (!this.availablePeriods || !this.availablePeriods.hasOwnProperty(this.defaultPeriodModel)) {
                    this.setPeriodFieldError('Выбранный период выплат недоступен. Пожалуйста, выберите другой');
                }

                if (!oldValue || (oldValue === newValue)) {
                    return;
                }

                this.actionSavePeriod();
            },
            isNeedReload: function (is) {
                if (is) {
                    this.loadDefaultPaymentAccount();
                }
            }
        },
    }
</script>

<style scoped>
    .pa__default-wrap {
        margin: 10px 0 10px 0;
        padding: 0px 20px 0px 20px;
        min-height: 140px;
        transition: 1s filter linear;
        -webkit-transition: 0.3s -webkit-filter linear;
        -moz-transition: 0.3s -moz-filter linear;
        -ms-transition: 0.3s -ms-filter linear;
        -o-transition: 0.3s -o-filter linear;
    }

    .pa__default-wrap._reload {
        filter: blur(7px) !important;
    }

    .pa__default-wrap__loading-state {
        text-align: center;
    }

    .pa__loader-bar-container {
        min-height: 15px;
    }

    .pa__account-row-wrap {
        margin: 10px 0 10px 0;
    }
</style>