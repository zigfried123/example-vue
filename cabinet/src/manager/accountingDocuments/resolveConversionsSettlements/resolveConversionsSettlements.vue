<template>
    <div>

        <!--Filter Dialog-->
        <md-dialog :md-active.sync="showFilterDialog">

            <dialog-data-selection v-if="!isViewMode" :showFilterDialog.sync="showFilterDialog"
                                   :showFilterDialog="showFilterDialog"
                                   :baseUrl="baseUrl"
                                   @closeDataSelection="showFilterDialog = false"></dialog-data-selection>
        </md-dialog>
        <!--Filter Dialog End-->
        <header-doc
                title="Управление взаиморасчетами по спорным конверсиям"
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

                <strategy-select
                        :isViewMode="isViewMode"
                        :validationClass="getValidationClass('strategy')"
                >

                </strategy-select>

                <div class="md-layout-item md-size-100 md-small-size-100 md-xsmall-size-100">
                    <md-field>
                        <label>Комментарий</label>
                        <md-textarea v-model="comment" :disabled="isViewMode"></md-textarea>
                    </md-field>
                </div>

                <div class="md-layout-item md-size-50 md-small-size-100 md-xsmall-size-100">
                    <md-checkbox v-model="needNotifyAccounting" value="1" v-if="!isViewMode">Создать обращение в
                        бухгалтерию
                    </md-checkbox>
                </div>

                <div class="md-layout-item md-size-50 md-small-size-100 md-xsmall-size-100" v-if="!!internalCudId">
                    <span>ID файла внесения статистики</span>
                    <md-field>
                        <md-input v-model="internalCudId" disabled></md-input>
                    </md-field>
                </div>

                <div class="md-layout-item doc-ml--8" v-if="!isViewMode">
                    <md-button class="md-raised" @click="loadData" :disabled="showProgressBar">Загрузить данные
                    </md-button>


                    <md-button class="md-raised" @click="prefillData" :disabled="showProgressBar"
                               v-if="!!internalCudId">
                        Перезаполнить по файлу с ID={{ internalCudId }}
                    </md-button>
                </div>

                <md-card v-show="showProgressBar">
                    <md-progress-bar md-mode="query"></md-progress-bar>
                </md-card>

                <br>

                <grid2v
                        :titles="titles"
                        :isViewMode="isViewMode"
                        :urlPreRenderRow="urlPreRenderRow()"
                        :urlImport="urlImport()"
                        :urlExport="urlExport()">
                    <md-button class="md-raised md-primary" @click="showFilterDialog = true">
                        Подбор данных
                    </md-button>
                </grid2v>

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
                        :isValidData="isValidData && hasRenderData"
            />
        </md-card>
    </div>

</template>

<script>
    import grid2v from '../components/grid2v.vue';
    import DialogDataSelection from '../components/DialogDataSelection.vue';
    import StrategySelect from '../components/StrategySelect.vue';
    import HeaderDoc from '../components/HeaderDoc.vue';
    import DateCreateAndManagement from '../components/DateCreateAndManagement.vue';
    import FooterDoc from '../components/FooterDoc.vue';
    import docDataMixin from '../mixins/docDataMixin';
    import docUrlsMixin from '../mixins/docUrlsMixin';
    import accessRulesMixin from '../mixins/accessRulesMixin';

    import {validationMixin} from 'vuelidate';
    import {required} from 'vuelidate/lib/validators';
    import customValidationMixin from "../mixins/customValidationMixin";

    var titles = [{
        prop: "conversion_id",
        label: "ID конверсии"
    }, {
        prop: "offer_id",
        label: "Оффер"
    }, {
        prop: "employee_offer_id",
        label: "Менеджер оффера"
    }, {
        prop: "employee_affiliate_id",
        label: "Менеджер вебмастера"
    }, {
        prop: "goal_id",
        label: "Цель"
    }, {
        prop: "adv_sub",
        label: "ADV SUB"
    }, {
        prop: "affiliate_id",
        label: "Вебмастер"
    }, {
        prop: "advertiser_id",
        label: "Рекламодатель"
    }, {
        prop: "status_detail",
        label: "Ожидаемый детальный статус"
    }, {
        prop: "status_advertiser",
        label: "Ожидаемый статус РД"
    }, {
        prop: "status_affiliate",
        label: "Ожидаемый статус ВМ"
    }, {
        prop: "payout",
        label: "Стоимость для вебмастера"
    }, {
        prop: "revenue",
        label: "Стоимость для рекламодателя"
    }, {
        prop: "conversion_created",
        label: "Дата создания конверсии"
    }];

    export default {
        mixins: [customValidationMixin, validationMixin, docDataMixin, docUrlsMixin, accessRulesMixin],
        components: {
            grid2v: grid2v,
            dialogDataSelection: DialogDataSelection,
            strategySelect: StrategySelect,
            headerDoc: HeaderDoc,
            dateCreateAndManagement: DateCreateAndManagement,
            footerDoc: FooterDoc
        },
        props: {
            isViewMode: Boolean,
            isEditMode: Boolean,
            baseUrl: String,
            gridInstanceName: String,
            initAttributes: String,
            cudId: String,
            status: String,
        },
        data: () => ({
            data: [],
            internalCudId: '',
            titles: titles,
            importFile: '',
            showFilterDialog: false,
            saveParams: {
                formName: 'common_modules_accounting_documents_models_ResolveConversionsSettlementsForm'
            },
            needNotifyAccounting: false,
        }),
        computed: {
            id() {
                return this.$store.getters.ID;
            },
            operationId() {
                return this.$store.getters.OPERATION_ID;
            },
            rawData() {
                return this.$store.getters.RAW_DATA;
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
            strategy: {
                get() {
                    return this.$store.getters.STRATEGY;
                },
                set(value) {
                    this.$store.commit('SET_STRATEGY', value)
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
            hasRenderData() {
                return Boolean(this.$store.getters.RENDER_DATA.length);
            }
        },
        created: function () {
            this.$store.commit('SET_URL_RENDER', this.urlPreRenderRow());
            this.$store.commit('SET_GRID_INSTANCE_NAME', this.gridInstanceName);

            if (!!this.initAttributes) {
                let initAttributes = JSON.parse(this.initAttributes);
                let jsonDataField = JSON.parse(initAttributes.json_data);

                this.$store.commit('SET_ID', initAttributes.id);
                this.$store.commit('SET_OPERATION_ID', initAttributes.operation_id);
                this.$store.dispatch('PUT_RAW_DATA', JSON.parse(jsonDataField.grid));
                this.$store.commit('SET_STRATEGY', jsonDataField.strategy);
                this.$store.commit('SET_CREATED_DATE', jsonDataField.created);
                this.$store.commit('SET_ACCOUNTING_DATE', jsonDataField.management_date);
                this.$store.commit('SET_COMMENT', jsonDataField.comment);

                if (!!jsonDataField.cud_id) {
                    this.internalCudId = jsonDataField.cud_id;
                }
            }

            if (!!this.cudId) {
                this.internalCudId = this.cudId;
                this.prefillData();
            }
        },
        methods: {
            loadData() {
                this.loadDataForGrid(this.urlLoadData());
            },
            save(event, saveAndExecute) {
                this.$store.commit('SET_PROCESSING', true);

                let formData = new FormData();

                formData.append(this.saveParams.formName + '[strategy]', this.strategy);
                formData.append(this.saveParams.formName + '[needNotify]', Number(this.needNotifyAccounting));
                formData.append(this.saveParams.formName + '[grid]', JSON.stringify(this.rawData));
                formData.append(this.saveParams.formName + '[management_date]', this.accountingDate);
                formData.append(this.saveParams.formName + '[comment]', this.comment);

                if (!!this.internalCudId) {
                    formData.append(this.saveParams.formName + '[cud_id]', this.internalCudId);
                }

                this.saveFormData(this.urlSave(this.id), formData, saveAndExecute);
            },
            prefillData() {
                this.$store.commit('SET_PROCESSING', true);
                axios.get(this.urlPrefill(), {
                    params: {
                        cud_id: this.internalCudId
                    }
                })
                    .then((response) => {
                        if (response.data.length === 0) {
                            notify('Для файла внесения статистики ' + this.internalCudId + ' данный документ не актуален', 'warning');
                        }
                        this.$store.dispatch('CLEAR_RAW_DATA');
                        this.$store.dispatch('PUT_RAW_DATA', response.data);
                        this.$store.commit('SET_PROCESSING', false);
                    }).catch((e) => {
                    this.$store.commit('SET_PROCESSING', false);
                    notify(e.response.data.error, 'danger');
                });
            }
        },
        validations: {
            strategy: {
                required,
            },
        }
    }
</script>
