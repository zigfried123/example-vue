<template>
    <div>
        <breadcrumbs v-if="selfEmployed"
                     :breadcrumbs="[
            {url: '/', title: 'Главная'},
            {url: urlListSelfEmployed, title: 'Самозанятые'},
            {url: urlViewSelfEmployed, title: selfEmployed.lastName + ' ' + selfEmployed.firstName + ' ' + selfEmployed.middleName},
            {title: 'Банковские счета'},
        ]"/>

        <md-toolbar md-elevation="1">
            <h4 class="md-title" style="flex: 1">Банковские счета</h4>
            <md-button
                    class="md-raised"
                    id="addBankBtn"
                    @click="activeAddBankAccount = true">
                Добавить
            </md-button>
        </md-toolbar>

        <md-card>
            <md-card-content>
                <md-progress-bar md-mode="indeterminate" v-if="isLoadProgress"></md-progress-bar>
                <md-table class="md-layout-item md-size-100 md-size-100 md-xsmall-size-100">

                    <md-table-row>
                        <md-table-head>Название</md-table-head>
                        <md-table-head>БИК</md-table-head>
                        <md-table-head>Корреспондентский счет</md-table-head>
                        <md-table-head>Рассчетный счет</md-table-head>
                        <md-table-head>Действие</md-table-head>
                    </md-table-row>

                    <md-table-row v-for="(item, index) in bankAccounts" :key="index">
                        <md-table-cell>{{ item.name }} </md-table-cell>
                        <md-table-cell>{{ item.bik }} </md-table-cell>
                        <md-table-cell>{{ item.correspondentAccount }} </md-table-cell>
                        <md-table-cell>{{ item.checkingAccount }} </md-table-cell>
                        <md-table-cell>
                            <md-button class="md-raised md-accent remove-btn"
                                       title="Удалить"
                                       @click="onClickRemove($event, item.id)">
                                <i class="icon-trash" aria-hidden="true"></i> Удалить
                            </md-button>
                        </md-table-cell>
                    </md-table-row>
                </md-table>

                <md-dialog-confirm
                        :md-active.sync="activeConfirmRemove"
                        md-title="Вы действительно хотите удалить банковский счет?"
                        md-confirm-text="Да, удалить"
                        md-cancel-text="Отмена"
                        id="removeBankBtn"
                        @md-confirm="onConfirmRemove"/>

                <md-dialog :md-active.sync="activeAddBankAccount">
                    <dialog-add-bank
                            @close="activeAddBankAccount = false"
                            @onClickAddBankAccount="onClickAddBankAccount"/>
                </md-dialog>

                <md-snackbar md-position="center" :md-duration="8000" :md-active.sync="isShowError" md-persistent>
                    <div v-html="textError" class="wrap-errors"></div>
                </md-snackbar>
            </md-card-content>
        </md-card>
    </div>
</template>

<script>

    import { mapActions, mapState, mapMutations } from 'vuex';
    import dialogAddBank from './components/dialogAddBank.vue';
    import breadcrumbs from '../../../components/breadcrumbs/breadcrumbs.vue';
    import {urlListSelfEmployed, urlViewSelfEmployed} from '../../../../common/contractors/selfEmployed/helpers/selfEmployedUrls';

    export default {
        name: "app-bank-accounts",
        components: {
            dialogAddBank: dialogAddBank,
            breadcrumbs: breadcrumbs,
        },
        data: () => ({
            bankAccountIdForRemove: null,
            activeConfirmRemove: false,
            activeAddBankAccount: false,
            selfEmployedId: null
        }),
        computed : {
            ...mapState([
                'selfEmployed',
                'bankAccounts',
                'isLoadProgress',
                'textError',
            ]),
            urlListSelfEmployed() {
                return urlListSelfEmployed();
            },
            urlViewSelfEmployed() {
                return this.selfEmployedId ? urlViewSelfEmployed(this.selfEmployedId) : '';
            },
            isShowError: {
                get() {
                    return this.$store.getters.GET_SHOW_ERROR;
                },
                set(value) {
                    this.$store.commit('SET_SHOW_ERROR', value)

                },
            }
        },
        created: function() {
            this.selfEmployedId = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
            this.setSelfEmployedId(this.selfEmployedId);
            this.appendBankAccounts();
        },
        methods: {
            ...mapActions({
                appendBankAccounts: 'APPEND_BANK_ACCOUNTS',
                deleteBankAccount: 'DELETE_BANK_ACCOUNT',
                addBankAccount: 'ADD_BANK_ACCOUNT',
            }),
            ...mapMutations({
                setSelfEmployedId: 'SET_SELF_EMPLOYED_ID'
            }),
            onClickRemove($event, id) {
                this.bankAccountIdForRemove = id;
                this.activeConfirmRemove = true;
            },
            onConfirmRemove () {
                if (this.bankAccountIdForRemove) {
                    this.deleteBankAccount(this.bankAccountIdForRemove);
                }
            },
            onClickAddBankAccount(bankAccount) {
                this.addBankAccount(bankAccount);
            },
        }
    }
</script>


<style>
    input, textarea{
        box-shadow: none !important;
    }

    .md-table-cell-container,
    .md-table-head-label {
        font-size: 14px;
    }

    .md-snackbar.md-theme-default {
        background-color: #ff5252;
    }

    .wrap-errors {
        margin: 10px;
    }
</style>