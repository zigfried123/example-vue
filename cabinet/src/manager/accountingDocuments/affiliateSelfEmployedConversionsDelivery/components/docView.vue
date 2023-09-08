<template>
    <md-card-content>
        <date-create-and-management
                :created-date="created"
                :accounting-date.sync="managementDate"
                :isViewMode="true"/>

        <div class="md-layout md-gutter">

            <div class="md-layout-item md-size-50 md-small-size-100 md-xsmall-size-100">
                <select2 :disabled="true"
                         :value.sync="ourOrganizationId"
                         :searchingUrl="urlOurOrganization()"
                         ref="ourOrganization"
                         title="Наша организация"/>
            </div>

            <div class="md-layout-item md-size-50 md-small-size-100 md-xsmall-size-100">
                <select2 :disabled="true"
                         :value.sync="affiliateSelfEmployedId"
                         :searchingUrl="urlAffiliateSelfEmployed()"
                         ref="affiliateSelfEmployed"
                         title="Самозанятый"/>
            </div>

            <div class="md-layout-item md-size-100 md-small-size-100 md-xsmall-size-100">
                <span>Запросы на выплату</span>

                <div class="md-layout md-gutter payout-request-container">
                    <div class="md-layout-item">
                        <md-chip v-for="(id, index) in payoutRequestIds" :key="index"
                                 class="md-primary"
                                 md-clickable>
                            <a :href="'/financeAccounting/affiliate/payoutRequests/list?id=' + id"
                               target="_blank">
                                Запрос ID:{{ id }}
                            </a>
                        </md-chip>
                    </div>

            </div>

        </div>
        </div>
        <div class="md-layout-item md-size-100 md-small-size-100 md-xsmall-size-100">
            <md-field>
                <label>Комментарий</label>
                <md-textarea v-model="comment" :disabled="true"></md-textarea>
            </md-field>
        </div>
        <md-card v-show="isProgress">
            <md-progress-bar md-mode="query"></md-progress-bar>
        </md-card>

        <br>

        <grid2v :titles="titles"
                :isViewMode="true"
                :urlPreRenderRow="urlPreRenderRow()">
        </grid2v>

        <div class="sum">Сумма: {{ totalSum }}</div>

    </md-card-content>
</template>

<script>

    import grid2v from '../../components/grid2v.vue';
    import HeaderDoc from '../../components/HeaderDoc.vue';
    import Select2 from '../../../../common/components/select2/select2.vue';
    import DateCreateAndManagement from '../../components/DateCreateAndManagement.vue';
    import Datepicker from '../../components/Datepicker.vue';
    import docDataMixin from '../../mixins/docDataMixin';
    import docUrlsMixin from '../../mixins/newDocUrlsMixin';
    import { mapActions, mapState, mapGetters } from 'vuex';

    let titles = [{
        prop: "id",
        label: "ID конверсии"
    }, {
        prop: "amount",
        label: "Сумма"
    }, ];

    export default {
        name: "app-affiliate-bonus",
        mixins:[docDataMixin, docUrlsMixin],
        components: {
            grid2v: grid2v,
            headerDoc: HeaderDoc,
            dateCreateAndManagement: DateCreateAndManagement,
            datepicker: Datepicker,
            select2: Select2,
        },
        props: {
            baseUrl: String,
        },
        data: () => ({
            titles: titles,
        }),
        computed : {
            ...mapState([
                'id',
                'status',
                'operationId',
                'processing',
                'created',
                'ourOrganizationId',
                'affiliateSelfEmployedId',
                'payoutRequestIds',
                'conversions',
                'isProgress',
            ]),
            ...mapGetters({
                totalSum: 'SUM_TOTAL_AMOUNT',
            }),
            managementDate: {
                get() {
                    return this.$store.state.managementDate;
                },
                set(value) {
                    this.$store.commit('SET_MANAGEMENT_DATE', value)
                }
            },
            comment: {
                get() {
                    return this.$store.state.comment;
                },
                set(value) {
                    this.$store.commit('SET_COMMENT', value)
                }
            },
        },
        watch: {
            ourOrganizationId: function (val) {
                this.$refs.ourOrganization.initWithValue(val);
            },
            affiliateSelfEmployedId: function (val) {
                this.$refs.affiliateSelfEmployed.initWithValue(val);
            },
        },
        methods: {

        }
    }
</script>
