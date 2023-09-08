<template>
    <div>
        <header-doc
                title="Начисление бонусов от рекламной системы"
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
                        <md-field>
                            <label for="agentCabinet">Рекламная система</label>
                            <md-select v-model="agentCabinet" name="agentCabinet" id="agentCabinet"
                                       :disabled="isViewMode">
                                <md-option v-for="(item, index) in agentCabinets"
                                           :key="index"
                                           :value="index">
                                    {{item}}
                                </md-option>

                            </md-select>
                        </md-field>
                    </div>

                    <div class="md-layout-item md-size-50 md-small-size-100 md-xsmall-size-100">
                        <md-field>
                            <label for="bank">Банк</label>
                            <md-select v-model="bank" name="bank" id="bank" :disabled="isViewMode">
                                <md-option v-for="(item, index) in banks" :key="index" :value="index">
                                    {{item}}
                                </md-option>
                            </md-select>
                        </md-field>
                    </div>
                </div>
                <div class="md-layout md-gutter">
                    <div class="md-layout-item md-size-100 md-small-size-100 md-xsmall-size-100">
                        <md-field :class="getValidationClass('bonusSum')">
                            <label>Сумма бонуса</label>
                            <md-input v-model="bonusSum" type="number" :disabled="isViewMode"
                                      @keyup="onFieldChanged($event.target.value, 'bonusSum')"></md-input>
                            <span class="md-error" v-if="!$v.bonusSum.required">
                                Необходимо ввести Сумма
                             </span>
                            <span class="md-error" v-if="!$v.bonusSum.minValue">
                                Сумма может быть только положительным значением
                             </span>
                            <span class="md-error" v-else-if="!$v.bonusSum.decimal">
                                Сумма может быть только числом
                            </span>
                        </md-field>
                    </div>
                </div>
                <div class="md-layout md-gutter">
                    <div class="md-layout-item md-size-50 md-small-size-100 md-xsmall-size-100">
              <span>
                Период "с"
              </span>
                        <datepicker :modelDate.sync="periodStart" :disabled="isViewMode"
                                    :disabledDates="disabledDatesPeriodStart"/>
                    </div>
                    <div class="md-layout-item md-size-50 md-small-size-100 md-xsmall-size-100">
              <span>
                Период "по"
              </span>
                        <datepicker :modelDate.sync="periodEnd" :disabled="isViewMode"
                                    :disabledDates="disabledDatesPeriodEnd"/>
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
    import DateCreateAndManagement from '../components/DateCreateAndManagement.vue';
    import Datepicker from '../components/Datepicker.vue';
    import FooterDoc from '../components/FooterDoc.vue';
    import docDataMixin from '../mixins/docDataMixin';
    import docUrlsMixin from '../mixins/docUrlsMixin';
    import accessRulesMixin from '../mixins/accessRulesMixin';

    import {validationMixin} from 'vuelidate';
    import {required, minValue, decimal} from 'vuelidate/lib/validators';
    import customValidationMixin from "../mixins/customValidationMixin";

    export default {
        name: "app-agent-bonus",
        mixins: [customValidationMixin, validationMixin, docDataMixin, docUrlsMixin, accessRulesMixin],
        components: {
            headerDoc: HeaderDoc,
            dateCreateAndManagement: DateCreateAndManagement,
            datepicker: Datepicker,
            footerDoc: FooterDoc
        },
        props: {
            isViewMode: Boolean,
            isEditMode: Boolean,
            baseUrl: String,
            gridInstanceName: String,
            initAttributes: String,
            agentCabinetsJson: String,
            banksJson: String,
            status: String,
        },
        data: () => ({
            data: [],
            importFile: '',
            showFilterDialog: false,
            saveParams: {
                formName: 'common_modules_accounting_documents_models_AgentBonusForm',
            },
        }),
        computed: {
            id() {
                return this.$store.getters.ID;
            },
            agentCabinets() {
                return JSON.parse(this.agentCabinetsJson);
            },
            banks() {
                return JSON.parse(this.banksJson);
            },
            operationId() {
                return this.$store.getters.OPERATION_ID;
            },
            createdDate() {
                return this.$store.getters.CREATED_DATE;
            },
            accountingDate: {
                get() {
                    return this.$store.getters.ACCOUNTING_DATE;
                },
                set(value) {
                    this.$store.commit('SET_ACCOUNTING_DATE', value)
                }
            },
            bonusSum: {
                get() {
                    return this.$store.getters.BONUS_SUM;
                },
                set(value) {
                    this.$store.commit('SET_BONUS_SUM', value)
                }
            },
            bank: {
                get() {
                    return this.$store.getters.BANK;
                },
                set(value) {
                    this.$store.commit('SET_BANK', value);
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
            comment: {
                get() {
                    return this.$store.getters.COMMENT;
                },
                set(value) {
                    this.$store.commit('SET_COMMENT', value)
                }
            },
            showProgressBar() {
                return this.$store.getters.GET_PROCESSING;
            },
            agentCabinet: {
                get() {
                    return this.$store.getters.AGENT_CABINET;
                },
                set(value) {
                    this.$store.commit('SET_AGENT_CABINET', value)
                }

            }
        },
        created: function () {
            if (!!this.initAttributes) {
                let initAttributes = JSON.parse(this.initAttributes);
                let jsonDataField = JSON.parse(initAttributes.json_data);
                this.$store.commit('SET_ID', initAttributes.id);
                this.$store.commit('SET_OPERATION_ID', initAttributes.operation_id);
                this.$store.commit('SET_CREATED_DATE', jsonDataField.created);
                this.$store.commit('SET_ACCOUNTING_DATE', jsonDataField.management_date);
                this.$store.commit('SET_AGENT_CABINET', jsonDataField.agent_account);
                this.$store.commit('SET_BANK', jsonDataField.bank_account_id);
                this.$store.commit('SET_BONUS_SUM', jsonDataField.amount);
                this.$store.commit('SET_PERIOD_START', jsonDataField.period_start);
                this.$store.commit('SET_PERIOD_END', jsonDataField.period_end);
                this.$store.commit('SET_COMMENT', jsonDataField.comment);
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
                formData.append(this.saveParams.formName + '[management_date]', this.accountingDate);
                formData.append(this.saveParams.formName + '[agent_account]', this.agentCabinet);
                formData.append(this.saveParams.formName + '[bank_account_id]', this.bank);
                formData.append(this.saveParams.formName + '[amount]', this.bonusSum);
                formData.append(this.saveParams.formName + '[period_start]', this.periodStart);
                formData.append(this.saveParams.formName + '[period_end]', this.periodEnd);
                formData.append(this.saveParams.formName + '[comment]', this.comment);
                this.saveFormData(this.urlSave(this.id), formData, saveAndExecute);
            }

        },
        validations: {
            bonusSum: {
                required,
                decimal,
                minValue: minValue(1),
            },
            agentCabinet: {
                required,
            },
            bank: {
                required,
            }
        }

    }
</script>
