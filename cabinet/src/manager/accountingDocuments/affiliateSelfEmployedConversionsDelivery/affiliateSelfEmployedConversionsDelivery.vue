<template>
    <div>
        <header-doc
                title="Списание оприходованных конверсий самозанятого вебмастера"
                :status="status"
                :url-templates="urlTemplates(id)"
                :operation-id="operationId"
                :isViewMode="true"
                :isShowPrint="false"
                :isShowOperations="!!parseInt(operationId)"
                :isShowTransactions="!!parseInt(operationId)">
            <switch-buttons/>
        </header-doc>

        <md-card>
            <keep-alive>
                <router-view></router-view>
            </keep-alive>

            <footer-doc
                    :isViewMode="true"
                    :status="status"
                    :canEdit="false"
                    :canExecute="false"
                    :canUnexecute="false"
                    :urlEdit="urlEdit(id)"
                    :urlUnExecute="urlUnExecute(id)"
                    :urlDelete="urlDelete(id)"
                    :urlRestore="urlRestore(id)"
                    :disabled="isProgress"/>
        </md-card>
        <md-snackbar md-position="center" :md-duration="8000" :md-active.sync="isShowError" md-persistent>
            <div v-html="textError" class="wrap-errors"></div>
        </md-snackbar>
    </div>
</template>

<script>

    import switchButtons from '../components/documentWorkflow/switchButtons.vue';
    import docUrlsMixin from '../mixins/newDocUrlsMixin';
    import HeaderDoc from '../components/HeaderDoc.vue';
    import FooterDoc from '../components/FooterDoc.vue';
    import {mapActions, mapState, mapMutations} from 'vuex';

    export default {
        name: "app-affiliate-organization-conversions-delivery",
        mixins: [docUrlsMixin],
        components: {
            headerDoc: HeaderDoc,
            footerDoc: FooterDoc,
            switchButtons: switchButtons
        },
        computed: {
            ...mapState([
                'id',
                'status',
                'operationId',
                'processing',
                'isProgress',
                'textError',
            ]),
            isShowError: {
                get() { return this.$store.state.isShowError; },
                set(value) { this.setShowError(value); },
            }
        },
        created: function () {
            this.appendDocument(
                this.urlDocument(this.extractDocumentId())
            );
        },
        methods: {
            ...mapActions({
                appendDocument: 'APPEND_DOCUMENT',
            }),
            ...mapMutations({
                setShowError: 'SET_SHOW_ERROR',
            }),
            extractDocumentId: function () {
                return window.location.pathname.split("/")[4];
            }
        }
    }
</script>
<style lang="scss">
    .md-chip {
        border-radius: 32px !important;

        a {
            color: white !important;
        }
    }

    .payout-request-container {
        padding-top: 20px;
        padding-bottom: 30px;
    }
</style>
