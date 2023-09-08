<template>
    <div>
        <breadcrumbs :breadcrumbs="[
                {url: '/', title: 'Главная'},
                {url: '/accountingDocuments', title: 'Документы'},
                {url: '/financeAccountingDocuments/affiliateBalanceUnFreezing/list', title: 'Разморозка баланса вебмастера'},
                {title: isViewMode ? 'Просмотр'
                    : isEditMode ? 'Редактирование' : 'Новый'}
            ]"/>
        <header-doc
                title="Разморозка баланса вебмастера"
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

                <md-card v-show="showProgressBar">
                    <md-progress-bar md-mode="query"></md-progress-bar>
                </md-card>

                <date-create-and-management
                        :created-date="createdDate"
                        :accounting-date.sync="accountingDate"
                        :isViewMode="isViewMode"/>

                <div class="md-layout md-gutter">
                    <div class="md-layout-item md-size-50 md-small-size-100 md-xsmall-size-100">
                        <select2 :disabled="isViewMode"
                                 :value.sync="webmasterId"
                                 is-load-data-on-init
                                 ref="webmasterId"
                                 :searchingUrl="urlAffiliate()"
                                 title="Вебмастер"></select2>
                    </div>

                    <div class="md-layout-item md-size-50 md-small-size-100 md-xsmall-size-100">
                        <select2 :disabled="isViewMode"
                                 :value.sync="advertiserId"
                                 is-load-data-on-init
                                 ref="advertiserId"
                                 :searchingUrl="urlAdvertiser()"
                                 title="Рекламодатель"></select2>
                    </div>
                </div>

                <div class="md-layout md-gutter">
                    <div class="md-layout-item md-size-50 md-small-size-100 md-xsmall-size-100">
                        <select2 :disabled="isViewMode"
                                 :value.sync="offerId"
                                 is-load-data-on-init
                                 ref="offerId"
                                 :searchingUrl="urlAdvertiserOffer()"
                                 title="Оффер"></select2>
                    </div>
                </div>

                    <div class="md-layout md-gutter  md-size-100 md-small-size-100 md-xsmall-size-100">
                        <div class="md-layout-item md-size-50 md-small-size-100 md-xsmall-size-100" >
                                <span>Период "с"</span>

                                <datepicker :modelDate.sync="periodStart"
                                            :disabled="isViewMode"
                                            :disabledDates="disabledDatesPeriodStart"
                                            :class="getValidationClass('periodStart')"/>
                            <span class="md-error" v-if="!$v.periodStart.required">Обязательное поле</span>
                        </div>

                        <div class="md-layout-item md-size-50 md-small-size-100 md-xsmall-size-100">
                            <span>Период "по"</span>
                            <datepicker :modelDate.sync="periodEnd"
                                        :disabled="isViewMode"
                                        :disabledDates="disabledDatesPeriodEnd"
                                        :class="getValidationClass('periodEnd')"/>
                            <span class="md-error" v-if="!$v.periodEnd.required">Обязательное поле</span>
                        </div>
                    </div>
                <div class="md-layout md-gutter">
                    <div class="md-layout-item md-size-100  md-small-size-100 md-xsmall-size-100">
                        <span>Комментарий</span>
                        <md-field>
                            <md-textarea v-model="comment" :disabled="isViewMode"></md-textarea>
                        </md-field>
                    </div>
                </div>

                <br>
                <grid2v
                        v-if="isExecutedStatus(status)"
                    :rawData="slices"
                    :titles="slicesTitle"
                    :isViewMode="true"
                    @editRow="false">
                </grid2v>


            </md-card-content>

            <footer-doc @clickOnSave="save"
                        :isViewMode="isViewMode"
                        :status="status"
                        :canEdit="canEdit"
                        :canExecute="canExecute"
                        :canUnexecute="false"
                        :urlEdit="urlEdit(id)"
                        :urlUnExecute="urlUnExecute(id)"
                        :urlDelete="urlDelete(id)"
                        :urlRestore="urlRestore(id)"
                        :urlView="urlView(id)"
                        :disabled="showProgressBar"
                        :isValidData="isValidData && isRequeredFieldSet"
            />
        </md-card>
        <md-snackbar md-position="center" :md-duration="8000" :md-active.sync="isShowError" md-persistent>
            <div v-html="textError" class="wrap-errors"></div>
        </md-snackbar>
    </div>
</template>

<script>

    import grid2v from '../components/grid2v.vue';
    import Datepicker from '../components/Datepicker.vue';
    import breadcrumbs from '../../../common/components/breadcrumbs/breadcrumbs.vue';
    import HeaderDoc from '../components/HeaderDoc.vue';
    import Select2 from '../../../common/components/select2/select2.vue';
    import DateCreateAndManagement from '../components/DateCreateAndManagement.vue';
    import FooterDoc from '../components/newFooterDoc.vue';
    import docDataMixin from '../mixins/newDocDataMixin';
    import docUrlsMixin from '../mixins/newDocUrlsMixin';
    import docStatusMixin from '../mixins/docStatusMixin';
    import accessRulesMixin from '../mixins/accessRulesMixin';
    import {mapState, mapMutations, mapActions} from 'vuex';

    import {validationMixin} from 'vuelidate';
    import {
        required,
    } from 'vuelidate/lib/validators';
    import customValidationMixin from "../mixins/customValidationMixin";

    export default {
        name: "affiliateBalanceUnFreezing",
        mixins: [customValidationMixin, validationMixin, docDataMixin, docUrlsMixin, accessRulesMixin, docStatusMixin],
        components: {
            breadcrumbs: breadcrumbs,
            headerDoc: HeaderDoc,
            datepicker: Datepicker,
            dateCreateAndManagement: DateCreateAndManagement,
            footerDoc: FooterDoc,
            select2: Select2,
            grid2v
        },
        validations: {
            periodStart: {
                required,
            },
            periodEnd: {
                required,
            },
        },
        data: () =>({
            availableOffers: [],
            slicesTitle:
                [{
                    prop: "affiliateId",
                    label: "ID Вебмастера"
                },
                    {
                        prop: "affiliateReferralId",
                        label: "ID реферала"
                    },
                    {
                        prop: "amount",
                        label: "Сумма"
                    },
                    {
                        prop: "conversionId",
                        label: "Конверсия"
                    },
                    {
                        prop: "managementDate",
                        label: "Дата учета"
                    }]

        }),
        props: {
            baseUrl: String,
            isViewMode: Boolean,
            isEditMode: Boolean,
        },
        computed: {
            slices() {
                return this.$store.getters.SLICES;
            },
            createdDate() {
                return this.$store.getters.CREATED_DATE;
            },
            showProgressBar() {
                return this.$store.getters.GET_PROCESSING;
            },
            disabledOffer() {
                return this.availableOffers.length === 0;
            },
            ...mapState([
                'id',
                'status',
                'operationId',
                'processing',
                'isProgress',
                'textError',
            ]),

            webmasterId: {
                get() {
                    return this.$store.getters.WEBMASTER_ID;
                },
                set(value) {
                    this.$store.commit('SET_WEBMASTER_ID', value)
                }
            },
            advertiserId: {
                get() {
                    return this.$store.getters.ADVERTISER_ID;
                },
                set(value) {
                    this.$store.commit('SET_ADVERTISER_ID', value)
                }
            },
            offerId: {
                get() {
                    return this.$store.getters.OFFER_ID;
                },
                set(value) {
                    this.$store.commit('SET_OFFER_ID', value)
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
            isShowError: {
                get() {
                    return this.$store.state.isShowError;
                },
                set(value) {
                    this.setShowError(value);
                },
            },
            isRequeredFieldSet() {
                return this.webmasterId !== '' || this.advertiserId !== '' || this.offerId !== '';
            },
        },

        watch: {
            advertiserId: function (value) {
                if (this.isViewMode || this.isEditMode) {
                    this.$refs.advertiserId.initWithValue(value);
                }
            },
            webmasterId: function (val) {
                if (this.isViewMode || this.isEditMode) {
                    this.$refs.webmasterId.initWithValue(val);
                }
            },
            offerId: function (val) {
                if (this.isViewMode || this.isEditMode) {
                    this.$refs.offerId.initWithValue(val);
                }
            },
        },

        created: function () {
            if (this.isViewMode || this.isEditMode) {
                this.appendDocument({'url': this.urlDocument(this.extractDocumentId()), 'form': this.$v});
            }
        },
        methods: {
            ...mapMutations({
                setShowError: 'SET_SHOW_ERROR',
            }),
            ...mapActions({
                appendDocument: 'APPEND_DOCUMENT',
            }),
            extractDocumentId: () => {
                return window.location.pathname.split("/")[4];
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
            disabledDatesPeriodStart(date) {
                if (!!this.periodEnd) {

                    let to = this.periodEnd;

                    if (typeof (this.periodEnd) == "string") {
                        let toParts = this.periodEnd.split(".");
                        to = new Date(toParts[2], toParts[1] - 1, toParts[0]);
                    }

                    return date > to;
                }

                return false;
            },

            save(event, saveAndExecute) {

                this.$v.$touch();

                if (this.$v.$invalid) {
                    return;
                }
                if (!this.isRequeredFieldSet) {
                    notify('Заполните хотя бы 1 поле: Вебмастер, Оффер, Рекламодатель', 'warning');
                    return;
                }

                this.$store.commit('SET_PROCESSING', true);

                let data = {
                    document_id: this.id,
                    affiliate_id: this.webmasterId,
                    management_date: this.accountingDate,
                    comment: this.comment,
                    advertiser_id: this.advertiserId,
                    offer_id: this.offerId,
                    period_start_date: this.periodStart,
                    period_end_date: this.periodEnd
                }

                let urlSave = this.isEditMode ? this.urlUpdate(this.id) : this.urlSave();

                this.saveFormData(urlSave, data, saveAndExecute);
            },
        }
    }
</script>
<style>
    .md-error {
        color: #ff1744;
        margin-top: -20px;
        display: block;
    }

    .md-invalid .md-field.md-theme-default:after {
        background-color: #ff1744 !important;
    }

    .md-invalid .md-icon.md-theme-default.md-icon-image svg {
        fill: #ff1744 !important;
    }
</style>

