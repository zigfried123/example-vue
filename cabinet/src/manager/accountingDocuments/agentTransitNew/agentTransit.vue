<template>
    <div>
        <breadcrumbs :breadcrumbs="[
                {url: '/', title: 'Главная'},
                {url: '/accountingDocuments', title: 'Документы'},
                {url: '/financeAccountingDocuments/agentTransit/list', title: 'Транзит в рекламную систему'},
                {title: isViewMode ? 'Просмотр'
                    : isEditMode ? 'Редактирование' : 'Новый'}
            ]"/>
        <header-doc
                title="Транзит в рекламную систему"
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
                    </div>
                    <div class="md-layout-item md-size-50 md-size-50 md-small-size-100 md-xsmall-size-100">
                        <span>Рекламная система</span>
                        <md-field :class="getValidationClass('agentAccount')">
                            <md-select v-model="agentAccount"
                                       name="agentAccount"
                                       required
                                       :disabled="isViewMode"
                                       placeholder="Выберите кабинет">
                                <md-option v-for="(item, index) in agencyCabinetsAvailable" :key="index" :value="index">
                                    {{item}}
                                </md-option>
                            </md-select>
                            <span class="md-error" v-if="!$v.agentAccount.required">
                                Необходимо ввести Агентский кабинет
                             </span>
                        </md-field>
                    </div>

                    <div class="md-layout-item md-size-50 md-size-50 md-small-size-100 md-xsmall-size-100">
                        <span>Банк</span>
                        <md-field :class="getValidationClass('agentBank')">
                            <md-select v-model="agentBank"
                                       name="agentBank"
                                       required
                                       :disabled="isViewMode"
                                       placeholder="Выберите банк">
                                <md-option v-for="(item, index) in banksAvaliable" :key="index" :value="index">
                                    {{item}}
                                </md-option>
                            </md-select>
                            <span class="md-error" v-if="!$v.agentBank.required">
                                Необходимо ввести Банк
                             </span>
                        </md-field>
                    </div>

                    <div class="md-layout-item md-size-50 md-size-50 md-small-size-100 md-xsmall-size-100">
                        <span>Сумма транзита</span>
                        <md-field :class="getValidationClass('amount')">
                            <md-input type="number"
                                      placeholder="Укажите сумму транзита"
                                      required
                                      :disabled="isViewMode"
                                      v-model="amount"
                                      @keyup="onFieldChanged($event.target.value, 'amount')"
                            >
                            </md-input>
                            <span class="md-error" v-if="!$v.amount.required">
                                Необходимо ввести Сумма
                             </span>
                            <span class="md-error" v-if="!$v.amount.minValue">
                                Сумма может быть только положительным значением
                             </span>
                            <span class="md-error" v-else-if="!$v.amount.decimal">
                                Сумма может быть только числом
                            </span>
                        </md-field>
                    </div>
                    <div class="md-layout-item md-size-100 md-size-100 md-small-size-100 md-xsmall-size-100">
                        <span>Комментарий</span>
                        <md-field>
                            <md-textarea v-model="comment" :disabled="isViewMode"></md-textarea>
                        </md-field>
                    </div>

                </div>
            </md-card-content>
            <footer-doc @clickOnSave="onSave"
                        @unExecute="unExecute(id)"
                        :isViewMode="isViewMode"
                        :isExists="isViewMode || isEditMode"
                        :status="status"
                        :canEdit="canEdit"
                        :canExecute="canExecute"
                        :canUnexecute="canUnexecute"
                        :urlEdit="urlEdit(id)"
                        :urlUnExecute="urlUnExecute(id)"
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
    import {mapState} from 'vuex';
    import docStatusMixin from "../mixins/docStatusMixin";
    import newDocDataMixin from "../mixins/newDocDataMixin";
    import {validationMixin} from 'vuelidate';
    import {required, minValue, decimal} from 'vuelidate/lib/validators';
    import customValidationMixin from "../mixins/customValidationMixin";

    export default {
        name: "agentTransit",
        mixins: [customValidationMixin, validationMixin, newDocDataMixin, newDocUrlsMixin, accessRulesMixin, docStatusMixin],
        components: {
            breadcrumbs: breadcrumbs,
            headerDoc: HeaderDoc,
            dateCreateAndManagement: DateCreateAndManagement,
            footerDoc: newFooterDoc,
            select2: Select2,
        },
        data: () => ({
            saveParams: {
                status: 'draft',
                formName: 'common_modules_accounting_documents_models_AgentTransitForm'
            },
        }),
        props: {
            agencyCabinetAvailableJson: String,
            banksAvailableJson: String,
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
            agencyCabinetsAvailable() {
                return JSON.parse(this.agencyCabinetAvailableJson);
            },
            banksAvaliable() {
                return JSON.parse(this.banksAvailableJson);
            },
            amount: {
                get() {
                    return this.$store.getters.AMOUNT;
                },
                set(value) {
                    this.$store.commit('SET_AMOUNT', value);
                }
            },
            agentBank: {
                get() {
                    return this.$store.getters.AGENT_BANK;
                },
                set(value) {
                    this.$store.commit('SET_AGENT_BANK', value);
                }
            },
            agentAccount: {
                get() {
                    return this.$store.getters.AGENT_ACCOUNT;
                },
                set(value) {
                    this.$store.commit('SET_AGENT_ACCOUNT', value);
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
            }
        },
        validations: {
            webmasterId: {
                required
            },
            amount: {
                required,
                decimal,
                minValue: minValue(1),
            },
            agentAccount: {
                required
            },
            agentBank: {
                required
            }

        },
        created: function () {
            let isExists = this.isEditMode || this.isViewMode;
            if (isExists) {
                let url = decodeURI(window.location.pathname);
                url = url.split('/');
                let docId = url.pop().match(/\d+/);

                let fields = {
                    'id': 'id',
                    'agentBank': 'payoutSource',
                    'agentAccount': 'agentCabinetType',
                    'amount': 'amount',
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

                if (this.isValidData) {
                    this.saveFormData(this.urlSave(this.id), entity, saveAndExecute);
                }
            },
            unExecute(event) {
                this.unExecuteDocument(this.id);
            }
        }
    }
</script>
