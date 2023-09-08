<template>
    <div>
        <breadcrumbs :breadcrumbs="[
                {url: '/', title: 'Главная'},
                {url: '/accountingDocuments', title: 'Документы'},
                {url: '/financeAccountingDocuments/transferAffiliateBalance/list', title: this.title},
                {title: isViewMode ? 'Просмотр'
                    : isEditMode ? 'Редактирование' : 'Новый'}
            ]"/>
        <header-doc
                :title="title"
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
                <date-create-and-management :class="getValidationClass('accountingDate')"
                                            :created-date="createdDate"
                                            :accounting-date.sync="accountingDate"
                                            :isViewMode="isViewMode"/>

                <div class="md-layout md-gutter">
                    <div class="md-layout-item md-size-50 md-small-size-100 md-xsmall-size-100">
                        <select2 :disabled="isViewMode"
                                 :form="$v"
                                 @onTouchField = "touchField"
                                 field="senderAffiliateId"
                                 :validationClass="getValidationClass('senderAffiliateId')"
                                 :value.sync="senderAffiliateId"
                                 :searchingUrl="urlAffiliate()"
                                 is-load-data-on-init
                                 title="Отправитель"></select2>
                    </div>
                    <div class="md-layout-item md-size-50 md-small-size-100 md-xsmall-size-100">
                        <select2 :disabled="isViewMode"
                                 :form="$v"
                                 @onTouchField = "touchField"
                                 :validationClass="getValidationClass('recipientAffiliateId')"
                                 required
                                 :value.sync="recipientAffiliateId"
                                 field="recipientAffiliateId"
                                 :searchingUrl="urlAffiliate()"
                                 is-load-data-on-init
                                 title="Получатель"></select2>
                    </div>
                    <div class="md-layout-item md-size-50 md-size-50 md-small-size-100 md-xsmall-size-100">
                        <span>Сумма трансфера</span>
                        <md-field :class="getValidationClass('amount')">
                            <md-input type="number"
                                      v-model="amount"
                                      required
                                      is-load-data-on-init
                                      placeholder="Укажите сумму трансфера"
                                      :disabled="isViewMode"
                                      @keyup="onFieldChanged($event.target.value, 'amount')">
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
    import docStatusMixin from "../mixins/docStatusMixin";
    import newDocDataMixin from "../mixins/newDocDataMixin";
    import {validationMixin} from 'vuelidate';
    import {required, minValue, decimal} from 'vuelidate/lib/validators';
    import customValidationMixin from "../mixins/customValidationMixin";

    export default {
        name: "transferAffiliateBalance",
        mixins: [customValidationMixin, validationMixin, newDocDataMixin, newDocUrlsMixin, accessRulesMixin, docStatusMixin],
        components: {
            breadcrumbs: breadcrumbs,
            headerDoc: HeaderDoc,
            dateCreateAndManagement: DateCreateAndManagement,
            footerDoc: newFooterDoc,
            select2: Select2,
        },
        data: () => ({
            title: 'Трансфер баланса между вебмастерами связанной группы аккаунтов',
            saveParams: {
                status: 'draft',
            },
        }),
        props: {
            baseUrl: String,
            isViewMode: Boolean,
            isEditMode: Boolean,
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
                get() {
                    return this.$store.getters.OPERATION_ID;
                },
                set(value) {
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
            senderAffiliateId: {
                get() {
                    return this.$store.getters.SENDER_AFFILIATE_ID;
                },
                set(value) {
                    this.$store.commit('SET_SENDER_AFFILIATE_ID', value)
                }
            },
            recipientAffiliateId: {
                get() {
                    return this.$store.getters.RECIPIENT_AFFILIATE_ID;
                },
                set(value) {
                    this.$store.commit('SET_RECIPIENT_AFFILIATE_ID', value)
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
            amount: {
                get() {
                    return this.$store.getters.AMOUNT;
                },
                set(value) {
                    this.$store.commit('SET_AMOUNT', value)
                }
            },
        },
        validations: {
            amount: {
                required,
                decimal,
                minValue: minValue(1),
            },
            senderAffiliateId: {
                required
            },
            recipientAffiliateId: {
                required
            },
            accountingDate: {
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
                    'comment': 'comment',
                    'senderAffiliateId': 'senderAffiliateId',
                    'recipientAffiliateId': 'recipientAffiliateId',
                    'amount': 'amount',
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
                entity.sender_affiliate_id = +this.senderAffiliateId;
                entity.recipient_affiliate_id = +this.recipientAffiliateId;
                entity.management_date = this.accountingDate;
                entity.comment = this.comment;

                if (this.isValidData) {
                    this.saveFormData(this.urlSave(this.id), entity, saveAndExecute);
                }
            },
            unExecute(event) {
                this.unExecuteDocument(this.id);
            },
        },

    }
</script>
