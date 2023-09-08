<template>
    <div class="header-doc">
        <md-toolbar md-elevation="1">
            <h4 class="md-title" style="flex: 1">{{ title }}</h4>
            <md-badge class="md-square doc-status" v-bind:class="statusClass" :md-content="statusTitle "/>
            <div class="wrap-action-buttons" v-if="isViewMode">
                <slot></slot>
                <md-button class="md-raised"
                           v-if="isShowPrint"
                           @click="showOperations($event, urlTemplates)"
                           :disabled="processing">
                    <md-icon>print</md-icon>
                    Печать
                </md-button>
                <md-button class="md-raised"
                           v-if="isShowOperations"
                           @click="showOperations($event, urlOperations + operationId)"
                           :disabled="processing">
                    <md-icon>format_list_numbered</md-icon>
                    Операции
                </md-button>
                <md-button class="md-raised" v-if="isShowTransactions" :href="urlTransactions + operationId"
                           target="_blank">
                    <md-icon>developer_mode</md-icon>
                    Проводки
                </md-button>
            </div>
        </md-toolbar>

        <md-dialog-alert
                class="operations-dialog"
                :md-active.sync="activeDialogOperations"
                :md-content="operationHtml"
                md-confirm-text="Закрыть"/>
    </div>
</template>

<script>
    import docStatusMixin from '../mixins/docStatusMixin';


    export default {
        name: "header-doc",
        mixins: [docStatusMixin],
        props: {
            title: String,
            isShowPrint: Boolean,
            isShowOperations: Boolean,
            isShowTransactions: Boolean,
            urlTemplates: String,
            operationId: Number,
            isViewMode: Boolean,
            status: {
                type: String,
                default: 'draft',
            }
        },
        data: () => ({
            activeDialogOperations: false,
            urlTransactions: '/financeAccounting/registers/transactions?operation_id=',
            urlOperations: '/financeAccounting/registers/operations/viewAjax/',
            operationHtml: '',
        }),
        computed: {
            processing() {
                return this.$store.getters.GET_PROCESSING;
            },
            statusTitle() {
                return this.getStatusTitle(this.status);
            },
            statusClass() {
                return this.getStatusCssLabel(this.status);
            },
        },
        methods: {
            showOperations: function (event, url) {
                this.$store.commit('SET_PROCESSING', true);
                axios.get(url)
                    .then((response) => {
                        this.$store.commit('SET_PROCESSING', false);
                        this.operationHtml = response.data;
                        this.activeDialogOperations = true;
                    })
                    .catch(function (e) {
                        notify('Внутренняя ошибка сервера');
                        this.$store.commit('SET_PROCESSING', false);
                    });
            },
        }
    }
</script>

<style>
    .header-doc .md-badge {
        left: 0px;
        right: auto;
        top: 0px;
        font-size: 14px;
    }

    .header-doc .md-badge.default {
        background-color: #1d96dc;
    }

    .header-doc .md-badge.success {
        background-color: #3cc050;
    }

    .header-doc .md-badge.delete {
        background-color: #ff5252;
    }
    .operations-dialog, .operations-dialog .md-dialog-container{
        width: 100%;
    }
</style>
