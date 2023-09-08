<template>
    <div>
        <header-doc
                title="Начисление бонусов от рекламодателя"
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
                                 field="advertiser_id"
                                 :validationClass="getValidationClass('advertiser_id')"
                                 :value.sync="advertiser_id"
                                 :searchingUrl="urlAdvertiser()"
                                 is-load-data-on-init
                                 title="Рекламодатель">
                        </select2>
                    </div>
                    <div class="md-layout-item md-size-50 md-small-size-100 md-xsmall-size-100">
                        <md-field>
                            <md-select v-model="offer_id"
                                       name="offer_id"
                                       required
                                       :disabled="isViewMode || disabledOffer"
                                       placeholder="Оффер">
                                <md-option v-for="(item, index) in availableOffers"
                                           :key="item.value" :value="item.value">
                                    {{item.label}}
                                </md-option>
                            </md-select>
                        </md-field>
                    </div>
                </div>
                <div class="md-layout md-gutter">
                    <div class="md-layout-item md-size-50 md-small-size-100 md-xsmall-size-100">
                        <span>Сумма бонуса</span>
                        <md-field :class="getValidationClass('bonusSum')">
                            <label>Введите сумму бонуса</label>
                            <md-input v-model="bonusSum"
                                      @keyup="onFieldChanged(bonusSum, 'bonusSum')" type="number" :disabled="isViewMode"></md-input>
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
                    <div class="md-layout-item md-size-50 md-small-size-100 md-xsmall-size-100">
                        <span>Статья учета</span>
                        <md-field>
                            <md-select v-model="balance"
                                       name="balance"
                                       required
                                       :disabled="isViewMode"
                                       placeholder="Выберите статью учета">
                                <md-option v-for="(item, index) in balanceAvailable" :key="index" :value="index">
                                    {{item}}
                                </md-option>
                            </md-select>
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
    import Datepicker from '../components/Datepicker.vue';
    import FooterDoc from '../components/FooterDoc.vue';
    import docDataMixin from '../mixins/docDataMixin';
    import docUrlsMixin from '../mixins/docUrlsMixin';
    import accessRulesMixin from '../mixins/accessRulesMixin';

    import {validationMixin} from 'vuelidate';
    import {required, minValue, decimal} from 'vuelidate/lib/validators';
    import customValidationMixin from "../mixins/customValidationMixin";

    export default {
        name: "app-advertiser-bonus",
        mixins: [customValidationMixin, validationMixin, docDataMixin, docUrlsMixin, accessRulesMixin],
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
            baseUrl: String,
            gridInstanceName: String,
            initAttributes: String,
            balanceJson: String,
            status: String,
        },
        data: () => ({
            data: [],
            importFile: '',
            showFilterDialog: false,
            saveParams: {
                formName: 'common_modules_accounting_documents_models_AdvertiserBonusForm',
            },
            advertiser_id: '',
            offer_id: '',
            availableOffers: [],
        }),
        computed: {
            id() {
                return this.$store.getters.ID;
            },
            balanceAvailable() {
                return JSON.parse(this.balanceJson);
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
            balance: {
                get() {
                    return this.$store.getters.BALANCE;
                },
                set(value) {
                    this.$store.commit('SET_BALANCE', value);
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
            disabledOffer() {
                return this.availableOffers.length === 0;
            }

        },
        watch: {
            advertiser_id: function (value) {
                if (this.isViewMode) {
                    return;
                }
                if (!!this.initAttributes) {
                    let initAttributes = JSON.parse(this.initAttributes);
                    let jsonDataField = JSON.parse(initAttributes.json_data);

                    if (value === jsonDataField.advertiser_id) {
                        return
                    }
                }

                this.availableOffers = [];
                this.offer_id = '';

                if (!!value === false) {
                    return;
                }

                this.updateAvailableOffers();
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
                this.$store.commit('SET_BALANCE', jsonDataField.balance_item_id);
                this.$store.commit('SET_BONUS_SUM', jsonDataField.amount);
                this.$store.commit('SET_COMMENT', jsonDataField.comment);

                this.advertiser_id = jsonDataField.advertiser_id;
                this.offer_id = jsonDataField.offer_id;
            }
            if (!!this.advertiser_id) {
                this.updateAvailableOffers();
            }
        },
        methods: {
            updateAvailableOffers() {
                axios.get(this.urlAdvertiserOffer(this.advertiser_id))
                    .then((response) => {
                        this.availableOffers = response.data.map(item => {
                            return {value: item.id, label: item.title.replace(/&quot;/g, '\"')};
                        });
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            },
            save(event, saveAndExecute) {

                this.$store.commit('SET_PROCESSING', true);
                let formData = new FormData();
                formData.append(this.saveParams.formName + '[management_date]', this.accountingDate);
                formData.append(this.saveParams.formName + '[advertiser_id]', this.advertiser_id);
                formData.append(this.saveParams.formName + '[offer_id]', this.offer_id);
                formData.append(this.saveParams.formName + '[balance_item_id]', this.balance);
                formData.append(this.saveParams.formName + '[amount]', this.bonusSum);
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
            advertiser_id: {
                required,
            },
            offer_id: {
              required,
            },
            balance: {
              required,
            }
        }

    }
</script>
