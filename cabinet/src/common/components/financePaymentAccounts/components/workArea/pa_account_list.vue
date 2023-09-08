<template>

    <div v-if="isLoading" style="height: 200px">
        <pa_load_stub :message="'Загружаем список аккаунтов...'"></pa_load_stub>
    </div>

    <div v-else-if="this.paymentAccounts.length === 0 ">
        <pa_empty_stub_basic :message="'У вас нет ни одного реквизита ' + this.paymentType.title" :label="''" :icon="'layers_clear'"></pa_empty_stub_basic>
    </div>

    <div v-else>

        <transition name="fade">
            <div v-if="getActiveList().length !== 0">
                <h3 class="pa__header">Активные</h3>
                <div v-for="paymentAccount in getActiveList()">
                    <pa_account :payment-account="paymentAccount"></pa_account>
                </div>
            </div>
        </transition>
        <transition name="fade">
            <div v-if="getDisabledList().length !== 0">
                <h3 class="pa__header">Отключены</h3>
                <div v-for="paymentAccount in getDisabledList()">
                    <pa_account :payment-account="paymentAccount"></pa_account>
                </div>
            </div>
        </transition>

    </div>
</template>

<script>
    import Pa_load_stub from "../common/pa_load_stub.vue";
    import Pa_empty_stub from "../common/pa_empty_stub.vue";
    import Pa_account from "./pa_account.vue";
    import PaymentAccount from "../../classes/PaymentAccount"
    import PaymentType from "../../classes/PaymentType"
    import Loader from "../../classes/Loader";
    import Pa_empty_stub_basic from "../common/pa_empty_stub_basic.vue";

    export default {
        name: "pa_account_list",
        components: {Pa_empty_stub_basic, Pa_account, Pa_load_stub},
        data() {
            return {
                isLoading: false
            }
        },
        computed: {
            paymentAccounts() {
                let pt = this.$store.getters.getActivePaymentType;
                if(pt.paymentAccounts.length !== 0) {
                    return pt.paymentAccounts;
                }

                this.isLoading = true;
                let loader = new Loader()
                    .setMethod('GET')
                    .setUrl(this.$store.getters.getBaseUrl + 'getConnected')
                    .setData({label: pt.code});

                let context = this;

                loader.run().then(function (response) {
                   let data  = response.data.data;
                   for(let item of data) {
                       pt.paymentAccounts.push(
                           new PaymentAccount()
                               .setId(item.id)
                               .setState(item.state)
                               .setTitle(item.title)
                               .setIsDefault(item.is_default)
                               .setDetails(item.details)
                       )
                   }

                }).finally(function () {
                    context.isLoading = false;
                });

                return pt.paymentAccounts;
            },
            /**
             *
             * @return {PaymentType}
             */
            paymentType() {
                return this.$store.getters.getActivePaymentType;
            }
        },
        methods: {
            getActiveList() {
                let list = [];
                for (let paymentAccount of this.paymentAccounts) {
                    if (paymentAccount.state === PaymentAccount.STATE_ACTIVE) {
                        list.push(paymentAccount);
                    }
                }
                return list;
            },
            getDisabledList() {
                let list = [];
                for (let paymentAccount of this.paymentAccounts) {
                    if (paymentAccount.state === PaymentAccount.STATE_DISABLED) {
                        list.push(paymentAccount);
                    }
                }
                return list;
            }
        }
    }
</script>

<style scoped>

</style>