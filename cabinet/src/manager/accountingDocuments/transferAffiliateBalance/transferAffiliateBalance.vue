<template>
<div>

  <md-dialog :md-active.sync="showConversionDialog">
      <dialog-conversion v-if="!isViewMode"
                         :editIndexRow="editIndexRow"
                       @close="showConversionDialog = false"/>
  </md-dialog>

  <header-doc
        title="Перенос баланса между аккаунтами Вебмастера"
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
                   :value.sync="affiliateIdSender"
                   :searchingUrl="urlAffiliate()"
                   is-load-data-on-init
                   title="Вебмастер-отправитель"></select2>
        </div>

        <div class="md-layout-item md-size-50 md-small-size-100 md-xsmall-size-100">
          <select2 :disabled="isViewMode"
                   :value.sync="affiliateIdRecipient"
                   :searchingUrl="urlAffiliate()"
                   is-load-data-on-init
                   title="Вебмастер-получатель"></select2>
        </div>
      </div>

      <div class="md-layout-item md-size-100 md-small-size-100 md-xsmall-size-100">
        <md-field>
          <label>Комментарий</label>
          <md-textarea v-model="comment" :disabled="isViewMode"></md-textarea>
        </md-field>
      </div>

      <div class="md-layout-item doc-ml--8" v-if="!isViewMode">
        <md-button class="md-raised" @click="loadData" :disabled="showProgressBar">Заполнить по остаткам</md-button>
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
        @editRow="showDialogConversionOnEdit">
        <md-button class="md-raised md-primary" @click="showDialogConversionOnAdd">
            <i class="icon-plus" aria-hidden="true"></i>
        </md-button>
      </grid2v>

      <div class="sum">Сумма: {{ totalSum }}</div>

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
    import DialogConversion from './components/DialogConversion.vue';
    import FooterDoc from '../components/FooterDoc.vue';
    import docDataMixin from '../mixins/docDataMixin';
    import docUrlsMixin from '../mixins/docUrlsMixin';
    import accessRulesMixin from '../mixins/accessRulesMixin';

    var titles = [{
        prop: "conversion_id",
        label: "ID конверсии"
    }, {
        prop: "amount",
        label: "Сумма"
    }, ];

    export default {
        mixins:[docDataMixin, docUrlsMixin, accessRulesMixin],
        components: {
            grid2v: grid2v,
            headerDoc: HeaderDoc,
            dateCreateAndManagement: DateCreateAndManagement,
            footerDoc: FooterDoc,
            dialogConversion: DialogConversion,
            select2: Select2,
        },
        props: {
            isViewMode: Boolean,
            isEditMode: Boolean,
            baseUrl: String,
            gridInstanceName: String,
            initAttributes: String,
            status: String,
        },
        data: () => ({
            titles: titles,
            importFile: '',
            affiliateIdSender: '',
            affiliateIdRecipient: '',
            showConversionDialog: false,
            editIndexRow: null,
            saveParams: {
                formName: 'common_modules_accounting_documents_models_TransferAffiliateBalanceForm'
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
            totalSum() {
              let total = this.$store.getters.RAW_DATA.reduce((total, item) => total + parseFloat(item.amount), 0)

              return total.toFixed(2);
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
                this.$store.commit('SET_CREATED_DATE', jsonDataField.created);
                this.$store.commit('SET_ACCOUNTING_DATE', jsonDataField.management_date);
                this.$store.commit('SET_COMMENT', jsonDataField.comment);

                this.affiliateIdSender = jsonDataField.affiliate_id_sender;
                this.affiliateIdRecipient = jsonDataField.affiliate_id_recipient;
            }
        },
        methods: {
            showDialogConversionOnAdd() {
                this.showConversionDialog = true;
                this.editIndexRow = null;
            },
            showDialogConversionOnEdit(index) {
                this.showConversionDialog = true;
                this.editIndexRow = index;
            },
            loadData() {

              if (!!this.affiliateIdSender === false) {
                  notify('Выберите вебмастера', 'danger');
                  return;
              }
              this.loadDataForGrid(this.urlLoadData() + '?affiliate_id=' +  this.affiliateIdSender);

            },
            save(event, saveAndExecute) {
                this.$store.commit('SET_PROCESSING', true);

                let formData = new FormData();

                formData.append(this.saveParams.formName + '[management_date]', this.accountingDate);
                formData.append(this.saveParams.formName + '[affiliate_id_sender]', this.affiliateIdSender);
                formData.append(this.saveParams.formName + '[affiliate_id_recipient]', this.affiliateIdRecipient);
                formData.append(this.saveParams.formName + '[comment]', this.comment);
                formData.append(this.saveParams.formName + '[grid]', JSON.stringify(this.rawData));

                this.saveFormData(this.urlSave(this.id), formData, saveAndExecute);
            },
        }
    }
</script>
