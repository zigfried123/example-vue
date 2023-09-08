<template>
    <div>
        <header-doc
                title="Бонус вебмастеру за работу в рекламной системе"
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
                                 field="webmaster_id"
                                 :validationClass="getValidationClass('webmaster_id')"
                                 :value.sync="webmaster_id"
                                 :searchingUrl="urlAffiliate()"
                                 is-load-data-on-init
                                 title="Вебмастер"></select2>
                    </div>

                    <div class="md-layout-item md-size-50 md-small-size-100 md-xsmall-size-100">
                        <span>Рекламная система</span>
                        <md-field>
                            <md-select v-model="agentAccount"
                                       name="agentCabinet"
                                       id="agentAccount"
                                       :disabled="isViewMode"
                                       placeholder="Выберите кабинет">
                                <md-option v-for="(item, index) in agencyCabinetsAvailable"
                                           :key="index"
                                           :value="index">
                                    {{item}}
                                </md-option>

                            </md-select>
                        </md-field>
                    </div>

                </div>

                <div class="md-layout md-gutter">
                    <div class="md-layout-item md-size-50 md-small-size-100 md-xsmall-size-100">
                        <md-field>
                            <label for="agentBank">Банк</label>
                            <md-select v-model="agentBank" name="agentBank" id="agentBank" :disabled="isViewMode">
                                <md-option v-for="(item, index) in banksAvaliable" :key="index" :value="index">
                                    {{item}}
                                </md-option>
                            </md-select>
                        </md-field>
                    </div>

                    <div class="md-layout-item md-size-50 md-size-50 md-small-size-100 md-xsmall-size-100">
                        <md-field :class="getValidationClass('amount')">
                            <label for="amount">Сумма бонуса</label>
                            <md-input id="amount"
                                      type="number"
                                      placeholder="Укажите сумму бонуса"
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
                </div>

                <div class="md-layout md-gutter">
                    <div class="md-layout-item md-size-50 md-small-size-100 md-xsmall-size-100">
                        <span>Период "с"</span>
                        <datepicker :modelDate.sync="periodStart"
                                    :disabled="isViewMode"
                                    :disabledDates="disabledDatesPeriodStart"/>
                    </div>
                    <div class="md-layout-item md-size-50 md-small-size-100 md-xsmall-size-100">
                        <span>Период "по"</span>
                        <datepicker :modelDate.sync="periodEnd"
                                    :disabled="isViewMode"
                                    :disabledDates="disabledDatesPeriodEnd"/>
                    </div>
                </div>
                <div class="md-layout md-gutter">
                    <div class="md-layout-item md-size-100 md-small-size-100 md-xsmall-size-100">
                        <md-field>
                            <label>Комментарий</label>
                            <md-textarea v-model="comment" :disabled="isViewMode"></md-textarea>
                        </md-field>
                    </div>

                    <md-card v-show="showProgressBar">
                        <md-progress-bar md-mode="query"></md-progress-bar>
                    </md-card>
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
    import Datepicker from '../components/Datepicker.vue';
    import DateCreateAndManagement from '../components/DateCreateAndManagement.vue';
    import FooterDoc from '../components/FooterDoc.vue';
    import docDataMixin from '../mixins/docDataMixin';
    import docUrlsMixin from '../mixins/docUrlsMixin';
    import accessRulesMixin from '../mixins/accessRulesMixin';

    import { validationMixin } from 'vuelidate';
    import {required, minValue, decimal} from 'vuelidate/lib/validators';
    import customValidationMixin from "../mixins/customValidationMixin";

    export default {
        name: "agentOutcomeBonus",
        mixins:[customValidationMixin, validationMixin, docDataMixin, docUrlsMixin, accessRulesMixin],
        components: {
            headerDoc: HeaderDoc,
            datepicker: Datepicker,
            dateCreateAndManagement: DateCreateAndManagement,
            footerDoc: FooterDoc,
            select2: Select2,
        },
        props: {
            agencyCabinetAvailableJson: String,
            banksAvailableJson: String,
            baseUrl: String,
            isViewMode: Boolean,
            isEditMode: Boolean,
            initAttributes: String,
            status: String,
        },
        data: () => ({
            webmaster_id: '',
            saveParams: {
                formName: 'common_modules_accounting_documents_models_AgentOutcomeBonusForm'
            },


        }),
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

            periodStart: {
                get() {
                    return this.$store.getters.PERIOD_START;
                },
                set(value) {
                    this.$store.commit('SET_PERIOD_START', value);
                }
            },
            periodEnd: {
                get() {
                    return this.$store.getters.PERIOD_END;
                },
                set(value) {
                    this.$store.commit('SET_PERIOD_END', value);
                }
            },
        },

        created: function () {

            if (!!this.initAttributes) {
                let initAttributes = JSON.parse(this.initAttributes);
                let jsonDataField = JSON.parse(initAttributes.json_data);

                this.touchFieldsInJsonData(jsonDataField);

                this.$store.commit('SET_ID', initAttributes.id);
                this.$store.commit('SET_OPERATION_ID', initAttributes.operation_id);
                this.$store.commit('SET_AGENT_BANK', jsonDataField.bank_account_id);
                this.$store.commit('SET_AGENT_ACCOUNT', jsonDataField.agent_account);
                this.$store.commit('SET_AMOUNT', jsonDataField.amount);
                this.$store.commit('SET_CREATED_DATE', jsonDataField.created);
                this.$store.commit('SET_ACCOUNTING_DATE', jsonDataField.management_date);
                this.$store.commit('SET_COMMENT', jsonDataField.comment);
                this.$store.commit('SET_PERIOD_START', jsonDataField.period_start);
                this.$store.commit('SET_PERIOD_END', jsonDataField.period_end);

                this.webmaster_id = jsonDataField.affiliate_id;
            }
        },

        methods: {
            disabledDatesPeriodStart(date) {
                if (!!this.periodEnd) {

                    let to = this.periodEnd;

                    if (typeof (this.periodEnd) == "string") {
                        let toParts = this.periodEnd.split(".");
                        to = new Date(toParts[2], toParts[1] - 1, +toParts[0] + 1);

                    }

                    return date > to || date - to === 0;
                }

                return false;
            },
            disabledDatesPeriodEnd(date) {
                if (!!this.periodStart) {

                    let from = this.periodStart;
                    if (typeof (this.periodStart) == "string") {
                        let fromParts = this.periodStart.split(".");
                        from = new Date(fromParts[2], fromParts[1] - 1, fromParts[0]);
                    }

                    return date < from;
                }

                return false;
            },

            save(event, saveAndExecute) {

                this.$store.commit('SET_PROCESSING', true);

                let formData = new FormData();
                formData.append(this.saveParams.formName + '[amount]', this.amount);
                formData.append(this.saveParams.formName + '[agent_account]', this.agentAccount);
                formData.append(this.saveParams.formName + '[affiliate_id]', this.webmaster_id);
                formData.append(this.saveParams.formName + '[bank_account_id]', this.agentBank);
                formData.append(this.saveParams.formName + '[created]', this.created);
                formData.append(this.saveParams.formName + '[management_date]', this.accountingDate);
                formData.append(this.saveParams.formName + '[comment]', this.comment);
                formData.append(this.saveParams.formName + '[period_start]', this.periodStart);
                formData.append(this.saveParams.formName + '[period_end]', this.periodEnd);

                this.saveFormData(this.urlSave(this.id), formData, saveAndExecute);
            },
        },
        validations: {
            webmaster_id: {
                required,
            },
            agentAccount: {
                required,
            },
            agentBank: {
                required,
            },
            amount: {
                required,
                decimal,
                minValue: minValue(1),
            },
        }
    }
</script>
