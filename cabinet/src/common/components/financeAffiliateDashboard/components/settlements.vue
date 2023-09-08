<template>
    <div>
        <div class="md-layout md-alignment-center-right">
            <md-button v-on:click="showSettings = !showSettings">
                {{ dateFrom }} - {{ dateTo }}
                <md-icon>{{ showSettings ? 'arrow_drop_up' : 'arrow_drop_down' }}</md-icon>
            </md-button>
            <md-button class="md-icon-button md-primary" v-on:click="loadData">
                <md-icon>
                    {{ state === states.stateFiltersChanged ? 'play_arrow' : 'refresh' }}
                </md-icon>
            </md-button>
        </div>

        <div v-if="showSettings">
            <div class="md-layout md-gutter md-alignment-center-center">
                <div class="md-layout-item">
                    <md-datepicker
                            v-model="dateFrom"
                            :md-disabled-dates="disabledDatesFrom"
                            md-immediately
                    />
                </div>
                <div class="md-layout-item">
                    <md-datepicker
                            v-model="dateTo"
                            md-immediately
                            :md-disabled-dates="disabledDatesTo"
                    />
                </div>
            </div>
        </div>
        <md-table v-model="settlementData"
                  md-card md-fixed-header
        >
            <md-table-toolbar>
                <div class="md-layout md-alignment-center-center">
                    <span class="md-title" style="flex: 1">Заработок</span>
                    <md-progress-spinner
                            v-if="(state === 'loading')"
                            class="md-primary"
                            :md-diameter="30"
                            md-mode="indeterminate"
                    />
                </div>
            </md-table-toolbar>

            <template v-for="(settings, code) in accounts" v-if="settlementData[code]">
                <settlements_row
                        :item="settlementData[code].data"
                        :formatter="formatter"
                        :icon="settings.icon"
                        :showCount="settings.showCount"
                        v-on:click.native="loadDetails(code)"
                ></settlements_row>

                <settlements_row
                        v-if="settlementData[code].details && showDetails[code]"
                        v-for="(details, key) in settlementData[code].details"
                        :key="code + '_details_' + key"
                        :showCount="settings.showCount"
                        :item="details"
                        :level="1"
                        :formatter="formatter"
                        :icon="settings.icon"
                ></settlements_row>
            </template>


            <md-empty-state
                    v-if="(settlementData.length === 0) && !(state === 'loading')"
                    md-icon="layers_clear"
                    md-label="Нет данных"
                    md-description="Попробуйте изменить параметры отбора">
            </md-empty-state>

        </md-table>
    </div>
</template>

<script>

    import {UrlHelper} from "../helpers/UrlHelper";
    import Settlements_row from "./settlements/settlements_row.vue";
    import {DateHelper} from "../helpers/DateHelper";
    import axios from 'axios';

    export default {
        name: "settlements",
        components: {Settlements_row},
        data() {
            return {
                states: {
                    stateFiltersChanged: 'filters_changed',
                    stateLoading: 'loading',
                },
                accounts: {
                    hold: {
                        icon: 'timer',
                        showCount: true,
                    },
                    approved: {
                        icon: 'done',
                        showCount: false,
                    },
                    for_pay: {
                        icon: 'payment',
                        showCount: false,
                    },
                    other_settlements: {
                        icon: 'payment',
                        showCount: false,
                    },
                    money_for_payment_system: {
                        icon: 'payment',
                        showCount: false,
                    },
                },
                showDetails: {},
                showSettings: false,
                rows: [],
                state: null,
            }
        },
        computed: {
            settlementData: {
                // settlementData getter :
                get: function () {
                    return this.$store.getters.getSettlementData
                },
                // settlementData setter:
                set: function (data) {
                    return this.$store.commit('setSettlementData', data);
                }
            },
            dateFrom: {
                // dateFrom getter :
                get: function () {
                    return this.$store.getters.getDateFrom
                },
                // dateFrom setter:
                set: function (data) {
                    return this.$store.commit('setDateFrom', data);
                }
            },
            dateTo: {
                // dateFrom getter :
                get: function () {
                    return this.$store.getters.getDateTo
                },
                // dateFrom setter:
                set: function (data) {
                    return this.$store.commit('setDateTo', data);
                }
            },
            disabledDatesFrom: date => {
                return  function (compared) {
                    return DateHelper.parseRus(date.dateTo) < compared;
                };
            },
            disabledDatesTo: date => {
                return  function (compared) {
                    return DateHelper.parseRus(date.dateFrom) > compared;
                };
            },
            formatter() {
                return new Intl.NumberFormat('ru-RU', {
                    style: 'decimal',
                    minimumFractionDigits: 2,
                })
            },
        },
        created() {
            this.loadData();
            this.rows = this.settlementData;
        },
        methods: {
            loadData() {
                this.startLoading();

                axios.get(
                    UrlHelper.url(
                        '/financeAccounting/dashboard/settlements/summary',
                        {
                            dateFrom: this.dateFrom,
                            dateTo: this.dateTo,
                        }
                    )
                )
                    .then((response) => {
                        let data = response.data;
                        this.$store.commit('setSettlementData', data);
                        this.breakState();
                        this.rows = this.settlementData;
                        this.$set(this, 'showDetails', {});
                    })
                    .catch((e) => {
                        notify('Что-то пошло не так...', 'error');
                    })
                    .finally(() => {
                        this.$set(this, 'state', null);
                    });
            },
            startLoading() {
                this.$set(this, 'state', this.states.stateLoading);
            },
            breakState() {
                this.$set(this, 'state', null);
            },
            switchDetails(code) {
                this.$set(this.showDetails, code, !this.showDetails[code]);
            },
            loadDetails(code) {
                if (this.settlementData[code].data === undefined) {
                    this.breakState();
                    notify('Неизвестное измерение!', 'error');
                }

                let accountId = this.settlementData[code].data.accountId;

                if (this.settlementData[code].details) {
                    this.switchDetails(code);
                    return;
                }

                this.startLoading();
                axios.get(
                    UrlHelper.url(
                        '/financeAccounting/dashboard/settlements/details',
                        {
                            dateFrom: this.$store.getters.getDateFrom,
                            dateTo: this.$store.getters.getDateTo,
                            account: accountId
                        }
                    )
                )
                    .then((response) => {
                        this.$set(this.settlementData[code], 'details', response.data);
                        this.switchDetails(code);
                    })
                    .catch((e) => {
                        notify('Что-то пошло не так...', 'error');
                    })
                    .finally(() => {
                        this.breakState();
                    });
            }
        },
        watch: {
            dateFrom: function (oldValue, newValue) {
                this.$set(this, 'state', this.states.stateFiltersChanged);
            },
            dateTo: function (oldValue, newValue) {
                this.$set(this, 'state', this.states.stateFiltersChanged);
            }
        }
    }
</script>

<style scoped>

</style>