<template>
    <div>
        <breadcrumbs :breadcrumbs="[
                {url: '/', title: 'Главная'},
                {url: '/accountingDocuments', title: 'Документы'},
                {title: 'Списание баланса системных вебмастеров'},
                {title: isViewMode ? 'Просмотр'
                    : isEditMode ? 'Редактирование' : 'Новый'}
            ]"/>
        <header-doc
                title="Списание баланса системных вебмастеров"
                :status="status"
                :url-templates="urlTemplates(id)"
                :operation-id="operationId"
                :isViewMode="isViewMode"
                :isShowPrint="false"
                :isShowOperations="!!parseInt(operationId)"
                :isShowTransactions="!!parseInt(operationId)">
        </header-doc>
        <md-card>
            <md-card-content>
                <date-create-and-management
                        :created-date="createdDate"
                        :accounting-date.sync="accountingDate"
                        :isViewMode="isViewMode"/>

                <div class="md-layout md-gutter">
                    <div class="md-layout-item md-size-50 md-small-size-100 md-xsmall-size-100">
                        <select2 :disabled="isViewMode"
                                 :form="$v"
                                 @onTouchField = "touchField"
                                 field="webmasterId"
                                 :validationClass="getValidationClass('webmasterId')"
                                 :value.sync="webmasterId"
                                 :searchingUrl="urlAffiliate()"
                                 is-load-data-on-init
                                 title="Вебмастер"></select2>

                        <md-table v-if="!isExecutedStatus(this.status)" class="md-layout-item md-size-25 md-small-size-50 md-xsmall-size-100">
                            <md-table-toolbar>
                                <h3 class="md-title">Информация по вебмастеру</h3>
                            </md-table-toolbar>

                            <md-table-row>
                                <md-table-cell><b>Группа</b></md-table-cell>
                                <md-table-cell v-html="affiliateInfo.group"></md-table-cell>
                            </md-table-row>
                            <md-table-row>
                                <md-table-cell><b>Заработок на утверждении(HOLD)</b></md-table-cell>
                                <md-table-cell v-html="affiliateInfo.hold"></md-table-cell>
                            </md-table-row>
                            <md-table-row>
                                <md-table-cell><b>Доступно к выплате</b></md-table-cell>
                                <md-table-cell v-html="affiliateInfo.payout"></md-table-cell>
                            </md-table-row>
                            <md-table-row>
                                <md-table-cell><b>Замороженный заработок</b></md-table-cell>
                                <md-table-cell v-html="affiliateInfo.frozen"></md-table-cell>
                            </md-table-row>
                            <md-table-row>
                                <md-table-cell><b>Заказано выплат</b></md-table-cell>
                                <md-table-cell v-html="affiliateInfo.onpay"></md-table-cell>
                            </md-table-row>
                        </md-table>
                    </div>


                    <div class="md-layout-item md-size-100 md-small-size-100 md-xsmall-size-100">
                        <md-checkbox v-model="resetHold" :disabled="isViewMode">
                            Сбросить HOLD
                        </md-checkbox>
                    </div>

                    <div class="md-layout-item md-size-100 md-small-size-100 md-xsmall-size-100">
                        <md-checkbox v-model="resetApproved" :disabled="isViewMode">
                            Сбросить "Доступно к выплате"
                        </md-checkbox>
                    </div>


                    <div class="md-layout-item md-size-100 md-size-100 md-small-size-100 md-xsmall-size-100">
                        <span>Комментарий</span>
                        <md-field>
                            <md-textarea v-model="comment" :disabled="isViewMode"></md-textarea>
                        </md-field>
                    </div>

                </div>
            </md-card-content>
            <footer-doc @clickOnSave="save"
                        :isViewMode="isViewMode"
                        :isExists="isViewMode || isEditMode"
                        :status="status"
                        :canEdit="canEdit"
                        :canExecute="canExecute"
                        :urlEdit="urlEdit(id)"
                        :urlDelete="urlDelete(id)"
                        :urlRestore="urlRestore(id)"
                        :urlView="urlView(id)"
                        :disabled="showProgressBar"
                        :isValidData="isValidData"
            />
        </md-card>
    </div>
</template>

<script>
    import HeaderDoc from '../components/HeaderDoc.vue';
    import Select2 from '../../../common/components/select2/select2.vue';
    import DateCreateAndManagement from '../components/DateCreateAndManagement.vue';
    import accessRulesMixin from '../mixins/accessRulesMixin';
    import newDocUrlsMixin from "../mixins/newDocUrlsMixin";
    import breadcrumbs from './../../../common/components/breadcrumbs/breadcrumbs.vue';
    import newFooterDoc from "../components/newFooterDoc.vue";
    import docStatusMixin from "../mixins/docStatusMixin";
    import newDocDataMixin from "../mixins/newDocDataMixin";
    import {validationMixin} from 'vuelidate';
    import {required} from 'vuelidate/lib/validators';
    import customValidationMixin from "../mixins/customValidationMixin";

    export default {
        name: "resetAffiliateBalance",
        mixins: [customValidationMixin, validationMixin, newDocDataMixin, newDocUrlsMixin, accessRulesMixin, docStatusMixin],
        components: {
            breadcrumbs: breadcrumbs,
            headerDoc: HeaderDoc,
            dateCreateAndManagement: DateCreateAndManagement,
            footerDoc: newFooterDoc,
            select2: Select2,
        },
        data: () => ({
            affiliateInfo: {
                group: '-',
                balance: '-',
                frozen: '-',
                payout: '-',
                hold: '-',
                onpay: '-',
            },
            saveParams: {
                status: 'draft',
            },
        }),
        props: {
            baseUrl: String,
            isViewMode: Boolean,
            isEditMode: Boolean,
            initAttributes: String,
        },
        computed: {
            id: {
                get() {
                    return this.$store.getters.ID
                },
                set(value) {
                    this.$store.commit('SET_ID', value);
                }
            },
            operationId: {
                get(){
                    return this.$store.getters.OPERATION_ID;
                },
                set(value){
                    this.$store.commit('SET_OPERATION_ID', value);
                }
            },
            createdDate() {
                return this.$store.getters.CREATED_DATE;
            },
            showProgressBar: {
                get() {
                    return this.$store.getters.GET_PROCESSING;
                },
                set(value) {
                    this.$store.commit('SET_PROCESSING', value);
                }
            },
            comment: {
                get() {
                    return this.$store.getters.COMMENT;
                },
                set(value) {
                    this.$store.commit('SET_COMMENT', value)
                }
            },
            accountingDate: {
                get() {
                    return this.$store.getters.ACCOUNTING_DATE;
                },
                set(value) {
                    this.$store.commit('SET_ACCOUNTING_DATE', value)
                }
            },
            webmasterId: {
                get() {
                    return this.$store.getters.WEBMASTER_ID;
                },
                set(value) {
                    this.$store.commit('SET_WEBMASTER_ID', value)
                }
            },
            status: {
                get() {
                    return this.$store.getters.STATUS;
                },
                set(value) {
                    this.$store.commit('SET_STATUS', value)
                }
            },
            resetHold: {
                get() {
                    return this.$store.getters.RESET_HOLD;
                },
                set(value) {
                    this.$store.commit('SET_RESET_HOLD', value)
                }
            },
            resetApproved: {
                get() {
                    return this.$store.getters.RESET_APPROVED;
                },
                set(value) {
                    this.$store.commit('SET_RESET_APPROVED', value)
                }
            }
        },
        validations: {
            webmasterId: {
                required
            },
        },
        created: function () {
            let isExists = this.isEditMode || this.isViewMode;
            if (isExists) {
                let url = decodeURI(window.location.pathname);
                url = url.split('/');
                let docId = url.pop().match(/\d+/);

                let fields = {
                    'id': 'id',
                    'resetHold': 'resetHold',
                    'resetApproved': 'resetApproved',
                    'comment': 'comment',
                    'webmasterId': 'affiliateId',
                    'status': 'status',
                    'operationId': 'operationId'
                };

                this.getDocumentData(this.baseUrl + '/getDocument?id=' + docId, fields, this.$v);
            }
        },
        methods: {
            save(event, saveAndExecute) {

                let entity = {};

                if (this.id) {
                    entity.id = this.id;
                }

                entity.amount = this.amount;
                entity.affiliate_id = this.webmasterId;
                entity.management_date = this.accountingDate;
                entity.comment = this.comment;
                entity.payout_source = this.agentBank;
                entity.agent_cabinet_type = this.agentAccount;
                entity.reset_hold = +this.resetHold;
                entity.reset_approved = +this.resetApproved;

                if(this.isValidData) {
                    this.saveFormData(this.urlSave(this.id), entity, saveAndExecute);
                }
            },
        }
    }
</script>
