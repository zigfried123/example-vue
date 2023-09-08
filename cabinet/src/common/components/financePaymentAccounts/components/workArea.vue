<template>
    <transition>
        <div id="work_area">
            <div class="pa__wrap" v-if="!paymentType">
                <pa_recommended>

                </pa_recommended>
            </div>

            <div v-if="!!paymentType">
                <pa_type v-bind:paymentType="paymentType">

                </pa_type>
            </div>
            </div>
        </div>
    </transition>
</template>

<script>

    import pa_default from './workArea/pa_default.vue';
    import pa_type from './workArea/pa_type.vue';
    import Pa_recommended from "./workArea/pa_recommended.vue";

    export default {
        name: "workArea",
        data() {
            return {
                state: 'list'
            }
        },
        computed: {
            paymentType() {
                return this.$store.getters.getActivePaymentType;
            }
        },
        components: {
            Pa_recommended,
            pa_default,
            pa_type
        }
    }
</script>

<style scoped>
    #work_area {
        transition: 0.3s;

    }
</style>