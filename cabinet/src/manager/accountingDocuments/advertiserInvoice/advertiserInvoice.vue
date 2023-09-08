<template>
    <div>

        <md-dialog :md-active.sync="showDialogLoadData">
            <dialog-load-data
                    v-if="!isViewMode"
                    :baseUrl="baseUrl"
                    :urlLoadData="urlLoadData()"
                    @closeDataSelection="showDialogLoadData = false"/>
        </md-dialog>

        <md-dialog :md-active.sync="showDialogRowTable">
            <dialog-row-table
                    v-if="!isViewMode"
                    :editIndexRow="editIndexRow"
                    :baseUrl="baseUrl"
                    @close="showDialogRowTable = false"/>
        </md-dialog>

        <header-doc
                title="Счет для рекламодателя"
                :status="status"
                :url-templates="urlTemplates(id)"
                :operation-id="operationId"
                :isViewMode="isViewMode"
                :isShowPrint="isViewMode"
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

                    <our-organization
                        :baseUrl="baseUrl"
                        :isViewMode="isViewMode"
                        :organizationId.sync="organizationId"
                        :organizationAccount.sync="organizationAccount"/>

                    <advertiser-organization
                            :baseUrl="baseUrl"
                            :isViewMode="isViewMode"
                            :advertiserId.sync="advertiserId"
                            :advertiserOrganizationId.sync="advertiserOrganizationId"/>

                    <div class="md-layout-item md-size-50 md-small-size-100 md-xsmall-size-100">
                        <span>НДС</span>
                        <md-field>
                            <md-select v-model="nds"
                                       name="nds"
                                       required
                                       :disabled="isViewMode"
                                       placeholder="НДС">
                                <md-option v-for="(item, index) in ndsAvailable" :key="index" :value="index">
                                    {{item}}
                                </md-option>
                            </md-select>
                        </md-field>
                    </div>

                    <div class="md-layout-item md-size-100 md-small-size-100 md-xsmall-size-100">
                        <md-field>
                            <label>Комментарий</label>
                            <md-textarea v-model="comment" :disabled="isViewMode"></md-textarea>
                        </md-field>
                    </div>
                </div>

                <div class="md-layout-item doc-ml--8" v-if="!isViewMode">
                    <md-button class="md-raised" @click="loadData" :disabled="showProgressBar">
                        Загрузить данные за месяц
                    </md-button>
                </div>

                <md-card v-show="showProgressBar">
                    <md-progress-bar md-mode="query"></md-progress-bar>
                </md-card>

                <br>

                <grid2v
                        :rawData="rawData"
                        :titles="titles"
                        :isViewMode="isViewMode"
                        :urlPreRenderRow="urlPreRenderRow()"
                        :urlImport="urlImport()"
                        :urlExport="urlExport()"
                        is-edit-row-button
                        @editRow="showDialogRowOnEdit">
                    <md-button class="md-raised md-primary" @click="showDialogLoadData = true">
                        Подобрать данные
                    </md-button>
                    <md-button class="md-raised md-primary" @click="showDialogRowAdd">
                        <i class="icon-plus" aria-hidden="true"></i>
                    </md-button>
                </grid2v>

                <div class="sum">Сумма: {{ totalSum }} в том числе НДС: {{ totalNds }}</div>

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
                        :disabled="showProgressBar"/>
        </md-card>
    </div>

</template>


<script>
    import grid2v from '../components/grid2v.vue';
    import Select2 from '../../../common/components/select2/select2.vue';
    import HeaderDoc from '../components/HeaderDoc.vue';
    import DateCreateAndManagement from '../components/DateCreateAndManagement.vue';
    import DialogRowTable from './components/DialogRowTable.vue';
    import FooterDoc from '../components/FooterDoc.vue';
    import docDataMixin from '../mixins/docDataMixin';
    import docUrlsMixin from '../mixins/docUrlsMixin';
    import accessRulesMixin from '../mixins/accessRulesMixin';
    import OurOrganization from './components/OurOrganization.vue';
    import AdvertiserOrganization from './components/AdvertiserOrganization.vue';
    import DialogLoadData from './components/DialogLoadData.vue';

    var titles = [{
        prop: "item",
        label: "ID конверсии"
    }, {
        prop: "advertiser_id",
        label: "Рекламодатель"
    }, {
        prop: "description",
        label: "Описание"
    }, {
        prop: "amountBase",
        label: "Сумма (учет)"
    }, {
        prop: "ndsBase",
        label: "НДС (учет)"
    }, {
        prop: "amount",
        label: "Сумма (факт)"
    }, {
        prop: "nds",
        label: "НДС (факт)"
    }, {
        prop: "totalAmount",
        label: "Всего"
    }];

    export default {
        mixins: [docDataMixin, docUrlsMixin, accessRulesMixin],
        components: {
            grid2v: grid2v,
            headerDoc: HeaderDoc,
            dateCreateAndManagement: DateCreateAndManagement,
            footerDoc: FooterDoc,
            ourOrganization: OurOrganization,
            advertiserOrganization: AdvertiserOrganization,
            select2: Select2,
            dialogLoadData: DialogLoadData,
            dialogRowTable: DialogRowTable,
        },
        props: {
            isViewMode: Boolean,
            isEditMode: Boolean,
            baseUrl: String,
            gridInstanceName: String,
            ndsJson: String,
            initAttributes: String,
            status: String,
        },
        data: () => ({
            titles: titles,
            importFile: '',
            organizationId: '',
            organizationAccount: '',
            advertiserId: '',
            advertiserOrganizationId: '',
            showDialogRowTable: false,
            editIndexRow: null,
            showDialogLoadData: false,
            saveParams: {
                formName: 'common_modules_accounting_documents_models_AdvertiserInvoiceForm'
            },
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
            nds: {
                get() {
                    return this.$store.getters.NDS;
                },
                set(value) {
                    this.$store.dispatch('CHANGE_NDS', value)
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
            ndsAvailable(){
                return JSON.parse(this.ndsJson);
            },
            showProgressBar() {
                return this.$store.getters.GET_PROCESSING;
            },
            totalSum() {
                return this.$store.getters.SUM_TOTAL_AMOUNT;
            },
            totalNds() {
                return this.$store.getters.SUM_TOTAL_NDS;
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
                this.$store.commit('SET_NDS', jsonDataField.nds);
                this.$store.dispatch('PUT_RAW_DATA', JSON.parse(jsonDataField.grid));
                this.$store.commit('SET_CREATED_DATE', jsonDataField.created);
                this.$store.commit('SET_ACCOUNTING_DATE', jsonDataField.management_date);
                this.$store.commit('SET_COMMENT', jsonDataField.comment);


                this.organizationId = jsonDataField.organization;
                this.organizationAccount = jsonDataField.organizationAccount;
                this.advertiserId = jsonDataField.advertiser_id;
                this.advertiserOrganizationId = jsonDataField.advertiser_legal_id;
            }
        },
        methods: {
            showDialogRowAdd() {
                this.showDialogRowTable = true;
                this.editIndexRow = null;
            },
            showDialogRowOnEdit(index) {
                this.showDialogRowTable = true;
                this.editIndexRow = index;
            },
            loadData() {

                if (!!this.advertiserId === false) {
                    notify('Выберите рекламодателя', 'danger');
                    return;
                }

                this.$store.commit('SET_PROCESSING', true);
                axios.post(this.urlLoadData() + '?advertiser_id=' +  this.advertiserId)
                    .then((response) => {
                        this.$store.dispatch('PUT_RAW_DATA', response.data);
                        this.$store.commit('SET_PROCESSING', false);
                    })
                    .catch((e) => {
                        notify(e.response.data.error, 'danger');
                        this.$store.commit('SET_PROCESSING', false);
                    });
            },
            save(event, saveAndExecute) {
                this.$store.commit('SET_PROCESSING', true);

                let formData = new FormData();

                formData.append(this.saveParams.formName + '[management_date]', this.accountingDate);
                formData.append(this.saveParams.formName + '[organization]', this.organizationId);
                formData.append(this.saveParams.formName + '[organizationAccount]', this.organizationAccount);
                formData.append(this.saveParams.formName + '[advertiser_id]', this.advertiserId);
                formData.append(this.saveParams.formName + '[advertiser_legal_id]', this.advertiserOrganizationId);
                formData.append(this.saveParams.formName + '[nds]', this.nds);
                formData.append(this.saveParams.formName + '[comment]', this.comment);
                formData.append(this.saveParams.formName + '[grid]', JSON.stringify(this.rawData));

                this.saveFormData(this.urlSave(this.id), formData, saveAndExecute);
            },
        }
    }
</script>