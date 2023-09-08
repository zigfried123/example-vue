<template>


    <div id="paymentAccounts"
         v-if="this.$store.getters.getGroups !== undefined && this.$store.getters.getGroups.length !== 0">
        <div class="row-fluid">
            <div class="span4">
                <default-payment-account>

                </default-payment-account>

                <groups-panel>

                </groups-panel>
            </div>
            <div class="span8">
                <work-area :description="activeGroup ? activeGroup.title : ''">

                </work-area>
            </div>
        </div>
    </div>
    <div v-else-if="loading">
        <div class="pa__wrap">
            <pa__hloader></pa__hloader>
        </div>
    </div>
    <div v-else>
        <div class="pa__wrap">
            <pa_empty_stub_basic
                    :label="'Упс...'"
                    :message="'Пока нет доступных типов выплат'"
            >
            </pa_empty_stub_basic>
        </div>
    </div>

</template>

<script>

    import groupsPanel from './components/groupsPanel.vue';
    import workArea from './components/workArea.vue';
    import PaymentGroup from "./classes/PaymentGroup";
    import PaymentType from "./classes/PaymentType";
    import Loader from "./classes/Loader";
    import Pa_empty_stub_basic from "./components/common/pa_empty_stub_basic.vue";
    import DefaultPaymentAccount from "./components/defaultPaymentAccount.vue";
    import Pa__hloader from "./components/common/pa__hloader.vue";

    export default {
        name: "Common",
        computed: {
            activeGroup() {
                return this.$store.getters.getActiveGroup;
            }
        },
        data() {
            return {
                country: "RUS",
                loading: true,
            }
        },
        methods: {
            setConfigData(configData) {
                this.$store.commit('setConfig', configData);
            },

            initData() {
                let result = [];
                let setPaymentTypes = this.setPaymentTypes;
                let setGroups = this.setGroups;
                let _context = this;
                new Loader()
                    .setData()
                    .setUrl(this.$store.getters.getConfig.baseUrl + 'getConfig')
                    .setMethod('GET')
                    .run()
                    .then(function (response) {
                        setPaymentTypes(response.data.data.paymentTypes);
                        setGroups(response.data.data.paymentGroups);
                    })
                    .finally(function () {
                        _context.loading = false;
                    });
            },
            /**
             * Установка типов выплаты (Object)
             * @param paymentTypeList
             * @returns {{PaymentType}}
             */
            setPaymentTypes(paymentTypeList) {
                let paymentTypes = {};

                for (let paymentTypeCode in paymentTypeList) {
                    if (paymentTypeList.hasOwnProperty(paymentTypeCode)) {
                        let paymentType = paymentTypeList[paymentTypeCode];
                        paymentTypes[paymentTypeCode] = new PaymentType(paymentTypeCode)
                            .setTitle(paymentType.title)
                            .setBadge(paymentType.badge)
                            .setDescription(paymentType.description)
                            .setShortDescription(paymentType.shortDescription)
                            .setIsRecommended(paymentType.isRecommended)
                            .setCanBeDefault(paymentType.isAvailableForAutoRequest)
                            .setAffiliateCommission((paymentType.affiliateCommission))
                            .setRequestPayoutDays(paymentType.requestPayoutDays);
                    }
                }
                this.$store.commit('setPaymentTypes', paymentTypes)
            },
            /**
             * Установка групп
             * @param groups
             * @returns {PaymentGroup[]}
             */
            setGroups(groups) {
                let groupObjects = [];

                for (let groupDataKey in groups) {
                    if (!groups.hasOwnProperty(groupDataKey)) {
                        continue;
                    }
                    let groupData = groups[groupDataKey];
                    let group = new PaymentGroup(
                        groupDataKey,
                        groupData.title,
                        groupData.shortDescription,
                        groupData.paymentTypes
                    );

                    for (let paymentTypeCode of group.paymentTypeCodes) {
                        group.setPaymentType(paymentTypeCode, this.$store.getters.getPaymentType(paymentTypeCode))
                    }

                    groupObjects.push(group);

                }
                this.$store.commit('setGroups', groupObjects)
            },

        },
        components: {
            Pa__hloader,
            DefaultPaymentAccount,
            Pa_empty_stub_basic,
            groupsPanel,
            workArea
        },
    }
</script>

<style scoped>

</style>