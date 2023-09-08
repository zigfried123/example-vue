<template>
    <div>
        <breadcrumbs v-if="selfEmployed"
                     :breadcrumbs="[
            {url: '/', title: 'Главная'},
            {url: urlListSelfEmployed, title: 'Самозанятые'},
            {title: selfEmployed.lastName + ' ' + selfEmployed.firstName + ' ' + selfEmployed.middleName},
        ]"/>

        <md-progress-bar md-mode="indeterminate" v-if="isLoadProgress"></md-progress-bar>

        <div v-if="selfEmployed">
            <md-toolbar md-elevation="1">
                <h5 class="md-title" style="flex: 1">
                    {{ selfEmployed.lastName }}
                    {{ selfEmployed.firstName }}
                    {{ selfEmployed.middleName }}
                </h5>
                <md-button class="md-dense md-raised md-primary"
                           @click="onClickShowHistory">
                    История модерации
                </md-button>

                <md-button class="md-dense md-raised"
                           :href="urlEditSelfEmployed">
                    Изменить
                </md-button>
            </md-toolbar>

            <md-card>
                <md-card-content>
                    <md-table>

                        <md-table-row>
                            <md-table-cell><b>Дата создания</b></md-table-cell>
                            <md-table-cell>{{ selfEmployed.created }}</md-table-cell>
                        </md-table-row>

                        <md-table-row>
                            <md-table-cell><b>Статус</b></md-table-cell>
                            <md-table-cell>
                                <span class="md-body-2">
                                    <span v-bind:style="{color: statusColor}">
                                        ●
                                    </span>
                                    {{ selfEmployed.status }}
                                </span>
                            </md-table-cell>
                        </md-table-row>

                        <md-table-row>
                            <md-table-cell><b>ИНН</b></md-table-cell>
                            <md-table-cell>{{ selfEmployed.inn }}</md-table-cell>
                        </md-table-row>

                        <md-table-row>
                            <md-table-cell><b>Контакты</b></md-table-cell>
                            <md-table-cell>
                                <b>Телефон: </b>{{ selfEmployed.phone }}<br>
                                <b>Email: </b>{{ selfEmployed.email }}
                            </md-table-cell>
                        </md-table-row>

                        <md-table-row>
                            <md-table-cell><b>Паспорт</b></md-table-cell>
                            <md-table-cell>
                                <b>Серия: </b>{{ selfEmployed.passportSeries }}<br>
                                <b>Номер: </b>{{ selfEmployed.passportNumber }}
                            </md-table-cell>
                        </md-table-row>

                        <md-table-row>
                            <md-table-cell><b>Выдан</b></md-table-cell>
                            <md-table-cell>
                                <b>Кем: </b>{{ selfEmployed.passportIssuedBy }}<br>
                                <b>Дата: </b>{{ selfEmployed.passportIssuedDate }}<br>
                                <b>Код подразделения: </b>{{ selfEmployed.passportDepartmentCode }}
                            </md-table-cell>
                        </md-table-row>

                        <md-table-row>
                            <md-table-cell><b>Адрес регистрации</b></md-table-cell>
                            <md-table-cell>{{ selfEmployed.passportRegistration }}</md-table-cell>
                        </md-table-row>
                    </md-table>
                </md-card-content>
            </md-card>

            <br>

            <md-toolbar md-elevation="1">
                <h5 class="md-title" style="flex: 1">Банковские счета</h5>
                <md-button class="md-dense md-raised"
                           :href="urlBankAccountsView">
                    Изменить
                </md-button>
            </md-toolbar>
            <md-card>
                <md-card-content>
                    <md-table class="md-layout-item md-size-100 md-size-100 md-xsmall-size-100">
                        <md-table-row>
                            <md-table-head>Название</md-table-head>
                            <md-table-head>БИК</md-table-head>
                            <md-table-head>Корреспондентский счет</md-table-head>
                            <md-table-head>Рассчетный счет</md-table-head>
                        </md-table-row>

                        <md-table-row v-for="(item, index) in selfEmployed.bankAccounts" :key="index">
                            <md-table-cell>{{ item.name }}</md-table-cell>
                            <md-table-cell>{{ item.bik }}</md-table-cell>
                            <md-table-cell>{{ item.correspondentAccount }}</md-table-cell>
                            <md-table-cell>{{ item.checkingAccount }}</md-table-cell>
                        </md-table-row>
                    </md-table>
                </md-card-content>
            </md-card>
        </div>
        <div v-else>
            <error-handler
                    :code="codeError"
                    :message="textError">
            </error-handler>
        </div>

        <md-snackbar md-position="center" :md-duration="8000" :md-active.sync="isShowError" md-persistent>
            <div v-html="textError" class="wrap-errors"></div>
        </md-snackbar>

        <md-dialog :md-active.sync="dialogHistory" class="dialog-moderate-history">
            <md-dialog-title>История модерации</md-dialog-title>

            <md-progress-bar md-mode="indeterminate" v-if="isLoadProgress"></md-progress-bar>

            <md-table>
                <md-table-row>
                    <md-table-head>Дата</md-table-head>
                    <md-table-head>Статус</md-table-head>
                    <md-table-head>Комментарий</md-table-head>
                </md-table-row>

                <md-table-row v-for="(item, index) in moderateHistory" :key="index">
                    <md-table-cell>{{ item.date }}</md-table-cell>
                    <md-table-cell>
                        <span class="md-body-2">
                            <span v-bind:style="{color: getStatusColor(item.statusCode)}">
                                ●
                            </span>
                            {{ item.status }}
                        </span>
                    </md-table-cell>
                    <md-table-cell>{{ item.comment }}</md-table-cell>
                </md-table-row>
            </md-table>

            <md-dialog-actions>
                <md-button class="md-primary" @click="dialogHistory = false">Закрыть</md-button>
            </md-dialog-actions>
        </md-dialog>

    </div>
</template>

<script>
    import {mapActions, mapState} from 'vuex';
    import errorHandler from '../../../../common/components/errorHandler/errorHandler.vue';
    import breadcrumbs from '../../../../common/components/breadcrumbs/breadcrumbs.vue';
    import {urlBankAccountsView, urlEditSelfEmployed, urlListSelfEmployed} from '../../../../common/contractors/selfEmployed/helpers/selfEmployedUrls';
    import StatusHelper from "../../../../common/contractors/selfEmployed/helpers/StatusHelper";

    export default {
        name: "app-self-employed-view",
        components: {
            errorHandler: errorHandler,
            breadcrumbs: breadcrumbs,
        },
        data: () => ({
            selfEmployedId: null,
            dialogHistory: false,
        }),
        created: function () {
            this.selfEmployedId = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);

            this.appendSelfEmployed(this.selfEmployedId);
        },
        computed: {
            ...mapState([
                'selfEmployed',
                'moderateHistory',
                'isLoadProgress',
                'textError',
                'codeError',
            ]),
            urlListSelfEmployed() {
                return urlListSelfEmployed();
            },
            urlEditSelfEmployed() {
                return this.selfEmployedId ? urlEditSelfEmployed(this.selfEmployedId) : '';
            },
            urlBankAccountsView() {
                return this.selfEmployedId ? urlBankAccountsView(this.selfEmployedId) : '';
            },
            isShowError: {
                get() {
                    return this.$store.getters.GET_SHOW_ERROR;
                },
                set(value) {
                    this.$store.commit('SET_SHOW_ERROR', value)

                },
            },
            statusColor() {
                return this.selfEmployed ? StatusHelper.getColor(this.selfEmployed.statusCode) : null;
            },
        },
        methods: {
            ...mapActions({
                appendSelfEmployed: 'APPEND_SELF_EMPLOYED',
                appendModerateHistory: 'APPEND_MODERATE_HISTORY',
            }),
            getStatusColor(statusCode) {
                return StatusHelper.getColor(statusCode);
            },
            onClickShowHistory() {
                this.appendModerateHistory(this.selfEmployedId);
                this.dialogHistory = true;
            },

        }
    }
</script>

<style>
    .md-table-cell-container,
    .md-table-head-label {
        font-size: 14px;
    }
</style>