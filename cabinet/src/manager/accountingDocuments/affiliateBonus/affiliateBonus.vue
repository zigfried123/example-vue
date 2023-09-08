<template>
    <div>
        <header-doc
                title="Бонус вебмастеру"
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
                        :form="$v"
                        :validationClass="getValidationClass('accountingDate')"
                        :created-date="createdDate"
                        :accounting-date.sync="accountingDate"
                        :isViewMode="isViewMode"/>

                <div class="md-layout md-gutter">

                    <div class="md-layout-item md-size-50 md-small-size-100 md-xsmall-size-100">
                        <select2 :disabled="isViewMode"
                                 :form="$v"
                                 @onTouchField = "touchField"
                                 field="webmaster_id"
                                 :validationClass="getValidationClass('webmaster_id')"
                                 :value.sync="webmaster_id"
                                 :searchingUrl="urlAffiliate()"
                                 is-load-data-on-init
                                 title="Вебмастер"></select2>
                    </div>

                    <div class="md-layout-item md-size-50 md-small-size-100 md-xsmall-size-100">
                        <span>Статья учета</span>
                        <md-field>
                            <label for="balance_item">Статья учета</label>
                            <md-select v-model="balanceItemId" name="balanceItem" id="balance_item" :disabled="isViewMode">
                                <md-option v-for="(item, index) in availableBalanceItems" :key="index" :value="index">
                                    {{item}}
                                </md-option>
                            </md-select>

                        </md-field>
                    </div>

                    <div class="md-layout-item md-size-100 md-small-size-100 md-xsmall-size-100">
                        <select2 :disabled="isViewMode"
                                 :value.sync="offer_id"
                                 is-load-data-on-init
                                 :searchingUrl="urlOffer()"
                                 title="Оффер"></select2>
                    </div>

                    <div class="md-layout-item md-size-100 md-small-size-100 md-xsmall-size-100">
                        <md-field :class="getValidationClass('amount')">
                            <label>Сумма бонуса</label>
                            <md-input v-model="amount" type="number" :disabled="isViewMode"  @keyup="onFieldChanged($event.target.value, 'amount')"></md-input>
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
                </div>
                <div class="md-layout-item md-size-100 md-small-size-100 md-xsmall-size-100">
                    <md-field>
                        <label>Комментарий</label>
                        <md-textarea v-model="comment" :disabled="isViewMode"></md-textarea>
                    </md-field>
                </div>
                <md-card v-show="showProgressBar">
                    <md-progress-bar md-mode="query"></md-progress-bar>
                </md-card>
            </md-card-content>

            <footer-doc @clickOnSave="save"
                        :isViewMode="isViewMode"
                        :status="status"
                        :canEdit="true"
                        :canExecute="true"
                        :canUnexecute="true"
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
    import Datepicker from '../components/Datepicker.vue';
    import FooterDoc from '../components/FooterDoc.vue';
    import docDataMixin from '../mixins/docDataMixin';
    import docUrlsMixin from '../mixins/docUrlsMixin';

    import { validationMixin } from 'vuelidate';
    import {required, minValue, decimal} from 'vuelidate/lib/validators';
    import customValidationMixin from "../mixins/customValidationMixin";

    const moreCreatedDate = (value) => value >= new Date().toLocaleDateString('ru-RU');

    export default {
        name: "app-affiliate-bonus",
        mixins:[customValidationMixin, validationMixin, docDataMixin, docUrlsMixin],
        components: {
            headerDoc: HeaderDoc,
            dateCreateAndManagement: DateCreateAndManagement,
            datepicker: Datepicker,
            footerDoc: FooterDoc,
            select2: Select2,
        },
        props: {
            isViewMode: Boolean,
            isEditMode: Boolean,
            availableBalanceItemsJson: String,
            baseUrl: String,
            initAttributes: String,
            status: String,
        },
        data: () => ({
            offer_id: '',
            webmaster_id: '',
            balanceItemId: '',
            saveParams: {
                formName: 'common_modules_accounting_documents_models_AffiliateBonusForm',
            },

        }),
        computed : {
            id() {
                return this.$store.getters.ID;
            },
            operationId() {
                return this.$store.getters.OPERATION_ID;
            },
            createdDate: {
                get() {
                    return this.$store.getters.CREATED_DATE;
                },
                set(value) {
                    this.$store.commit('SET_CREATED_DATE', value)
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
            amount:{
                get() {
                    return this.$store.getters.AMOUNT;
                },
                set(value) {
                    this.$store.commit('SET_AMOUNT', value)
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
            availableBalanceItems() {
                return JSON.parse(this.availableBalanceItemsJson);
            },
            showProgressBar(){
                return this.$store.getters.GET_PROCESSING;
            },
        },
        created: function () {

            this.$v['accountingDate'].$touch();

            if (!!this.initAttributes) {
                let initAttributes = JSON.parse(this.initAttributes);
                let jsonDataField = JSON.parse(initAttributes.json_data);

                this.touchFieldsInJsonData(jsonDataField);

                this.$store.commit('SET_ID', initAttributes.id);
                this.$store.commit('SET_OPERATION_ID', initAttributes.operation_id);
                this.$store.commit('SET_CREATED_DATE', jsonDataField.created);
                this.$store.commit('SET_ACCOUNTING_DATE', jsonDataField.management_date);
                this.$store.commit('SET_AMOUNT', jsonDataField.amount);
                this.$store.commit('SET_COMMENT', jsonDataField.comment);

                this.balanceItemId = jsonDataField.balance_item_id;
                this.webmaster_id = jsonDataField.affiliate_id;
                this.offer_id = jsonDataField.offer_id;
            }
        },
        methods: {
            save(event, saveAndExecute) {
                this.$store.commit('SET_PROCESSING', true);
                let formData = new FormData();
                formData.append(this.saveParams.formName + '[management_date]', this.accountingDate);
                formData.append(this.saveParams.formName + '[affiliate_id]', this.webmaster_id);
                formData.append(this.saveParams.formName + '[balance_item_id]', this.balanceItemId);
                formData.append(this.saveParams.formName + '[amount]', this.amount);
                formData.append(this.saveParams.formName + '[offer_id]', this.offer_id);
                formData.append(this.saveParams.formName + '[comment]', this.comment);
                this.saveFormData(this.urlSave(this.id), formData, saveAndExecute);
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
            balanceItemId: {
                required
            },
            accountingDate: {
                required,
                moreCreatedDate
            }
        }
    }
</script>
