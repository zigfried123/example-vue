<template>
    <div>
        <h5>Рекомендуем <i class="fa fa-star" style="color: var(--pa-accent-color)"></i></h5>
        <div v-if="Object.keys(paymentTypes).length !== 0">
            <carousel
                    :autoplay="true"
                    :scroll-per-page="true"
                    :perPageCustom="[[480, 1], [768, 3]]"
                    id="carusel-recommended"
                    class="md-layout md-gutter md-theme-default md-medium-size-30 md-small-size-50 md-xsmall-size-100">
                <slide v-for="paymentTypeName of getChunks()"
                       :key="paymentTypeName"
                       class="r-payment-item md-layout-item md-medium-size-33 md-small-size-100 md-xsmall-size-100">

                    <pa_type_card :paymentType="getPaymentType(paymentTypeName)">
                    </pa_type_card>

                </slide>
            </carousel>
        </div>
        <div v-else>
            <pa_default>

            </pa_default>
        </div>

        <div>
            <h5>Типы выплат</h5>
            <div class="md-card pa__pt_table__wrap">
                <md-table v-model="tablePaymentTypes">
                    <md-table-toolbar>
                        <h1 class="md-title">Сравнение условий по типам выплат</h1>
                    </md-table-toolbar>

                    <md-table-row slot="md-table-row" slot-scope="{ item }">
                        <md-table-cell md-label="Способ выплаты">{{ item.title }}</md-table-cell>
                        <md-table-cell md-label="Срок выплаты">В течение {{ item.requestPayoutDays }} рабочих дней
                        </md-table-cell>
                        <md-table-cell md-label="Размер комиссии">{{ item.affiliateCommission }}%</md-table-cell>
                    </md-table-row>
                </md-table>
            </div>
        </div>
    </div>
</template>

<script>
    import Pa_type_card from "./pa_type_card.vue";
    import Pa_default from "./pa_default.vue";

    export default {
        name: "pa_recommended",
        props: {
            paymentTypeNames: {type: Array},
        },
        data() {
            return {
                onRowCount: 3,
            }
        },
        computed: {
            paymentTypes() {
                return this.$store.getters.getRecommendedPaymentTypes;
            },
            tablePaymentTypes() {
                let list = [];
                for (let paymentTypeItem in this.$store.getters.getPaymentTypes) {
                    let typeObject = this.$store.getters.getPaymentType(paymentTypeItem);
                    list.push({
                        title: typeObject.title,
                        requestPayoutDays: typeObject.requestPayoutDays,
                        affiliateCommission: typeObject.affiliateCommission
                    });
                }

                return list;
            }
        },
        components: {
            Pa_default,
            Pa_type_card,
        },
        methods: {
            getChunks() {
                let names = Object.keys(this.paymentTypes);
                let chunks = [];
                let i, j, chunk;
                for (i = 0, j = names.length; i < j; i += this.onRowCount) {
                    chunk = names.slice(i, i + this.onRowCount);
                    chunks.push(chunk);
                }
                let paymentsList = [];
                for (let chunkKey in chunks) {
                    let chunk = chunks[chunkKey];
                    for (let chunkItemKey in chunk) {
                        paymentsList.push(chunk[chunkItemKey]);
                    }
                }

                return paymentsList;
            },
            getPaymentType(name) {
                return this.$store.getters.getPaymentType(name);
            }
        }
    }
</script>

<style>
    .r-payment-item {
        padding-left: 10px;
        padding-right: 10px;
    }

    @media (min-width: 1290px) {
        .pa__pt_table__wrap {
            margin: 0 -10px 0 -10px;
        }
    }

    .VueCarousel-dot {
        border-radius: 100% !important;
        background-color: rgb(192, 192, 192) !important;
    }

    .VueCarousel-dot--active {
        background-color: black !important;
    }
</style>