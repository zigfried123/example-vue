<template>
    <div>
        <header-doc
                title="Взаимозачет между вебмастером и рекламодателем"
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
                                 @onTouchField="touchField"
                                 field="webmaster_id"
                                 :validationClass="getValidationClass('webmaster_id')"
                                 :value.sync="webmaster_id"
                                 is-load-data-on-init
                                 :searchingUrl="urlAffiliate()"
                                 title="Вебмастер"></select2>
                    </div>

                    <div class="md-layout-item md-size-50 md-small-size-100 md-xsmall-size-100">
                        <select2 :disabled="isViewMode"
                                 :form="$v"
                                 @onTouchField="touchField"
                                 field="advertiser_id"
                                 :validationClass="getValidationClass('advertiser_id')"
                                 :value.sync="advertiser_id"
                                 is-load-data-on-init
                                 :searchingUrl="urlAdvertiser()"
                                 title="Рекламодатель"></select2>
                    </div>


                    <div class="md-layout-item md-size-100 md-small-size-100 md-xsmall-size-100">
                        <span>Сумма</span>
                        <md-field :class="getValidationClass('amount')">
                            <md-input type="number"
                                      placeholder="Укажите сумму"
                                      required
                                      :disabled="isViewMode"
                                      v-model="amount"
                                      @keyup="onFieldChanged($event.target.value, 'amount')">
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
                    <div class="md-layout-item md-size-100  md-small-size-100 md-xsmall-size-100">
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

    import { validationMixin } from 'vuelidate';
    import {required, minValue, decimal} from 'vuelidate/lib/validators';
    import customValidationMixin from "../mixins/customValidationMixin";

    export default {
        name: "agentNdsRefund",
        mixins:[customValidationMixin, validationMixin, docDataMixin, docUrlsMixin, accessRulesMixin],
        components: {
            headerDoc: HeaderDoc,
            dateCreateAndManagement: DateCreateAndManagement,
            footerDoc: FooterDoc,
            select2: Select2,
        },
        data: () => ({
            webmaster_id: '',
            advertiser_id: '',
            saveParams: {
                formName: 'common_modules_accounting_documents_models_NettingAffiliateAdvertiserForm'
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

            amount: {
                get() {
                    return this.$store.getters.AMOUNT;
                },
                set(value) {
                    this.$store.commit('SET_AMOUNT', value);
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
        },
        validations: {
            amount: {
                required,
                decimal,
                minValue: minValue(1),
            },
            webmaster_id: {
                required,
            },
            advertiser_id: {
                required,
            },
        },
        created: function () {

            if (!!this.initAttributes) {
                let initAttributes = JSON.parse(this.initAttributes);
                let jsonDataField = JSON.parse(initAttributes.json_data);

                this.touchFieldsInJsonData(jsonDataField);

                this.$store.commit('SET_ID', initAttributes.id);
                this.$store.commit('SET_OPERATION_ID', initAttributes.operation_id);
                this.$store.commit('SET_AMOUNT', jsonDataField.amount);
                this.$store.commit('SET_CREATED_DATE', jsonDataField.created);
                this.$store.commit('SET_ACCOUNTING_DATE', jsonDataField.management_date);
                this.$store.commit('SET_COMMENT', jsonDataField.comment);
                this.$store.commit('SET_ADVERTISER', jsonDataField.advertiser_id);
                this.$store.commit('SET_AFFILIATE', jsonDataField.affiliate_id);

                this.webmaster_id = jsonDataField.affiliate_id;
                this.advertiser_id = jsonDataField.advertiser_id;
            }
        },
        methods: {
            save(event, saveAndExecute) {

                this.$store.commit('SET_PROCESSING', true);

                let formData = new FormData();
                formData.append(this.saveParams.formName + '[amount]', this.amount);
                formData.append(this.saveParams.formName + '[affiliate_id]', this.webmaster_id);
                formData.append(this.saveParams.formName + '[created]', this.created);
                formData.append(this.saveParams.formName + '[management_date]', this.accountingDate);
                formData.append(this.saveParams.formName + '[comment]', this.comment);
                formData.append(this.saveParams.formName + '[advertiser_id]', this.advertiser_id);

                this.saveFormData(this.urlSave(), formData, saveAndExecute);
            },
        }
    }
</script>

