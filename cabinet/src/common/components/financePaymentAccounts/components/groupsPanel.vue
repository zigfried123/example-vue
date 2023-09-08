<template>
    <div id="groupsPanel" class="pa__wrap">
        <h5>Типы выплат</h5>

        <div class="pa__panel_wrap md-card md-theme-default" v-if="groups.length !== 0">


            <div class="pa__group__button pa__flex h-stretch v-items-center" v-on:click="actionToDefault()">
                <div class="pa__group__button__icon ripple pa__flex v-center h-start">
                    <pa__icon :icon="'recommend'">

                    </pa__icon>
                </div>
                <div class="pa__group__button__block_text v-center h-end">
                        <span>
                            <b>Рекомендуемые</b>
                        </span><br>
                    <span>
                            Лучшие варианты для вас!
                        </span>
                </div>
                <i v-if="stateRecommended" class="fa fa-circle pa__lamp"></i>
            </div>

            <div v-for="(group, k) in groups">
                <div
                        class="pa__group__button pa__flex h-stretch v-items-center"
                        v-on:click="actionSelectGroup(group)"
                        v-bind:class="{'pa__collapsed': group.collapsed }"
                        v-if="!!group.paymentTypes"
                >
                    <div class="pa__group__button__icon ripple pa__flex v-center h-start">
                        <!--<i class="fa fa-cc-amex h-center" style="font-size: 50px"></i>-->
                        <pa__icon :icon="group.code">

                        </pa__icon>
                    </div>
                    <div class="pa__group__button__block_text v-center h-end">
                        <span>
                            <b>{{ group.title }}</b>
                        </span><br>
                        <span>
                            {{ group.shortDescription }}
                        </span>
                    </div>
                    <i v-if="group.collapsed" class="fa fa-circle pa__lamp"></i>
                </div>

                <div class="pa__group__list" v-show="group.collapsed">
                    <ul>
                        <li v-for="(paymentType, paymentTypeCode) in group.paymentTypes"
                            v-on:click="actionSelectPaymentType(paymentType)"
                            v-bind:class="{'pa__account-collapsed' : !!(paymentType.state === 'edit')}"
                        >
                            <i class="fa fa-credit-card"></i>&nbsp;
                            <span>{{ paymentType.title }}</span>
                            <span v-if="paymentType.badge" class="pa__badge" v-html="paymentType.badge"></span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    import Pa_empty_stub_basic from "./common/pa_empty_stub_basic.vue";
    import Pa__icon from "./common/pa__icon.vue";

    export default {
        name: "groupPanel",
        data() {
            return {
                stateRecommended: false
            }
        },
        computed: {
            groups() {
                return this.$store.getters.getGroups;
            }
        },
        methods: {
            actionSelectGroup(targetGroup) {
                let to = !targetGroup.collapsed;
                for (let group of this.groups) {
                    this.$set(group, 'collapsed', false);
                }
                this.$set(targetGroup, 'collapsed', to);
            },
            /**
             *
             * @param {PaymentType} paymentType
             */
            actionSelectPaymentType(paymentType) {
                let activePaymentType = this.$store.getters.getActivePaymentType;
                if (activePaymentType) {
                    activePaymentType.stateNone();
                }

                paymentType.stateEdit();
            },
            actionToDefault() {
                for (let group of this.groups) {
                    this.$set(group, 'collapsed', false);
                }
                let activePaymentType = this.$store.getters.getActivePaymentType;

                if(activePaymentType) {
                    activePaymentType.stateNone();
                    this.$set(this, 'stateRecommended', activePaymentType.state === 'none');
                }
            }
        },
        components: {
            Pa__icon,
            Pa_empty_stub_basic
        }
    }
</script>

<style scoped>
    /**
        Accent: #ffbf00
        Light: #fff5a3
     */
    .pa__group__button {
        margin: 10px 0 10px 0;
        padding: 0px 20px 0px 20px;
        min-height: 70px;
        cursor: pointer;
        transition: 0.3s;
        color: black;
        box-sizing: border-box;
    }

    .pa__collapsed {
        -webkit-box-shadow: var(--pa-shadow);
        -moz-box-shadow: var(--pa-shadow);
        box-shadow: var(--pa-shadow);
    }

    .pa__group__button:hover {
        -webkit-box-shadow: var(--pa-shadow);
        -moz-box-shadow: var(--pa-shadow);
        box-shadow: var(--pa-shadow);
    }

    .pa__group__list {
        margin: 10px;
        padding: 10px;
    }

    .pa__group__list > ul {
        margin: 0 !important;
    }

    .pa__group__list > ul > li {
        list-style-type: none !important;
        cursor: pointer;
        padding: 15px 5px 15px 5px !important;
    }

    .pa__group__list > ul > li.pa__account-collapsed > i {
        transition: 0.3s;
        background: var(--pa-accent-color) !important;
        color: white !important;
    }

    .pa__group__list > ul > li > i {
        padding: 15px;
        border-radius: 30px !important;
    }


    .pa__group__list > ul > li:hover > i {
        transition: 0.3s;
        background: var(--pa-accent-dark-color);
        color: white;
    }

    .pa__group__button__block_text {
        margin: 0 0 0 15px;
        padding: 5px;
    }

    .pa__group__button__icon {
        width: 32px;
        height: 32px;
        overflow: hidden;
        margin: 5px;
    }

</style>