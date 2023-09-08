<template>
    <div>
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
                    <div class="md-layout-item md-size-100 md-small-size-100 md-xsmall-size-100">
                        <select2 :disabled="isViewMode"
                                 :form="$v"
                                 @onTouchField = "touchField"
                                 field="affiliateId"
                                 :validationClass="getValidationClass('affiliateId')"
                                 :value.sync="affiliateId"
                                 :searchingUrl="urlSystemAffiliate()"
                                 is-load-data-on-init
                                 title="Системный вебмастер"/>

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
                        :status="status"
                        :canEdit="canEdit"
                        :canExecute="canExecute"
                        :canUnexecute="canUnexecute"
                        :urlEdit="urlEdit(id)"
                        :urlUnExecute="urlUnExecute(id)"
                        :urlDelete="urlDelete(id)"
                        :urlRestore="urlRestore(id)"
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
    import FooterDoc from '../components/FooterDoc.vue';
    import docDataMixin from '../mixins/docDataMixin';
    import docUrlsMixin from '../mixins/docUrlsMixin';
    import accessRulesMixin from '../mixins/accessRulesMixin';
    import docStatusMixin from "../mixins/docStatusMixin";

    import { validationMixin } from 'vuelidate';
    import {required} from 'vuelidate/lib/validators';
    import customValidationMixin from "../mixins/customValidationMixin";

    export default {
        name: "resetSystemBalance",
        mixins:[customValidationMixin, validationMixin, docDataMixin, docUrlsMixin, accessRulesMixin, docStatusMixin],
        components: {
            headerDoc: HeaderDoc,
            dateCreateAndManagement: DateCreateAndManagement,
            footerDoc: FooterDoc,
            select2: Select2,
        },
        data: () => ({
            affiliateId: '',
            affiliateInfo: {
                group: '-',
                balance: '-',
                frozen: '-',
                payout: '-',
                hold: '-',
                onpay: '-',
            },
            saveParams: {
                formName: 'common_modules_accounting_documents_models_ResetSystemBalanceForm'
            },
        }),
        props: {
            baseUrl: String,
            isViewMode: Boolean,
            isEditMode: Boolean,
            initAttributes: String,
            status: String,
        },
        computed: {
            id() {
                return this.$store.getters.ID;
            },
            operationId() {
                return this.$store.getters.OPERATION_ID;
            },
            createdDate() {
                return this.$store.getters.CREATED_DATE;
            },
            showProgressBar() {
                return this.$store.getters.GET_PROCESSING;
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
            },
        },
        watch: {
            affiliateId: function (val) {
                this.updateInfoWebmaster(val);
            },
        },
        created: function () {
            if (!!this.initAttributes) {
                let initAttributes = JSON.parse(this.initAttributes);
                let jsonDataField = JSON.parse(initAttributes.json_data);

                this.touchFieldsInJsonData(jsonDataField);

                this.$store.commit('SET_ID', initAttributes.id);
                this.$store.commit('SET_OPERATION_ID', initAttributes.operation_id);
                this.$store.commit('SET_CREATED_DATE', jsonDataField.created);
                this.$store.commit('SET_ACCOUNTING_DATE', jsonDataField.management_date);
                this.$store.commit('SET_COMMENT', jsonDataField.comment);

                this.resetHold = !!jsonDataField.reset_hold;
                this.resetApproved = !!jsonDataField.reset_approved;

                this.affiliateId = jsonDataField.affiliate_id;
            }
        },
        methods: {
            updateInfoWebmaster(affiliateId) {
                let formData = new FormData();
                formData.append('affiliate_id', affiliateId);

                axios.post(this.urlAffiliateBalance(), formData)
                    .then((response) => {
                        this.affiliateInfo.group = response.data.group;
                        this.affiliateInfo.balance = response.data.balance;
                        this.affiliateInfo.frozen = response.data.frozen;
                        this.affiliateInfo.payout = response.data.payout;
                        this.affiliateInfo.hold = response.data.hold;
                        this.affiliateInfo.onpay = response.data.onpay;
                    });
            },
            save(event, saveAndExecute) {
                this.$store.commit('SET_PROCESSING', true);

                let formData = new FormData();
                formData.append(this.saveParams.formName + '[management_date]', this.accountingDate);
                formData.append(this.saveParams.formName + '[comment]', this.comment);
                formData.append(this.saveParams.formName + '[affiliate_id]', this.affiliateId);
                formData.append(this.saveParams.formName + '[reset_hold]', +this.resetHold);
                formData.append(this.saveParams.formName + '[reset_approved]', +this.resetApproved);

                this.saveFormData(this.urlSave(this.id), formData, saveAndExecute);
            },
        },
        validations: {
            affiliateId: {
                required,
            },
        }
    }
</script>
