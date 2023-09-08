<template>
    <div>
        <h5>Тип выплаты</h5>

        <div class="pa__wrap md-card md-theme-default">
            <div class="pa__work-area-head">
                <h2 class="pa__header"> {{ paymentType.title }}</h2>
                <transition>
                    <md-content class="__description md-scrollbar"
                                v-bind:class="{'collapsed' : descriptionCollapsed , 'hovered' : descriptionOver}"
                                v-html="paymentType.description"
                    ></md-content>
                </transition>
                <div class="pa__head-help-panel">
                    <a
                            v-on:click="actionToggleDescriptionCollapsed"
                            v-on:mouseout="actionMouseOverDescriptionCollapsed"
                            v-on:mouseover="actionMouseOverDescriptionCollapsed"
                    >
                        {{ descriptionCollapsed ? 'Свернуть' : 'Развернуть' }}
                    </a>
                </div>
            </div>
            <div class="pa__head-bottom-panel">
                <div class="pa__head-panel-btn"
                     data-md-tooltip="Добавить новый"
                     v-bind:class="{'__close': (state === 'new')}"
                     v-on:click="actionAdding"
                ></div>
            </div>

            <div class="pa__work-area-body">
                <transition
                        name="scale"
                        v-on:after-leave="workAreaState = 'new'"
                >
                    <pa_account_list v-if="state === 'list' && workAreaState === 'list'">

                    </pa_account_list>
                </transition>

                <transition
                        name="scale"
                        v-on:after-leave="workAreaState = 'list'"
                >
                    <pa_account_form v-if="state === 'new' && workAreaState === 'new'">

                    </pa_account_form>
                </transition>
            </div>
        </div>
    </div>
</template>

<script>
    import Pa_account_list from "./pa_account_list.vue";
    import PaymentAccount from "../../classes/PaymentAccount";
    import Pa_account_form from "./pa_account_form.vue";
    import Pa_load_stub from "../common/pa_load_stub.vue";

    export default {
        name: "pa_type",
        components: {Pa_load_stub, Pa_account_form, Pa_account_list},
        computed: {
            /**
             * @return PaymentAccount
             */
            paymentType() {
                return this.$store.getters.getActivePaymentType;
            },
        },
        data() {
            return {
                descriptionCollapsed: false,
                descriptionOver: false,
                state: 'list',
                workAreaState: 'list'
            }
        },
        methods: {
            actionToggleDescriptionCollapsed() {
                this.descriptionCollapsed = !this.descriptionCollapsed;
            },
            actionMouseOverDescriptionCollapsed() {
                this.descriptionOver = !this.descriptionOver;
            },
            actionAdding(paymentTypeCode) {
                if (this.state === 'new') {

                }
                this.state = this.state === 'new' ? 'list' : 'new';
            }
        }
    }
</script>

<style scoped>
    .pa__work-area-head {
        background: #cbcbcb;
        padding: 40px;
    }

    .pa__work-area-head > .__description {
        background: none !important;
        text-overflow: ellipsis;
        height: 10vh;
        overflow: hidden;
        transition: height 0.3s ease-in-out;
        margin: 0px -40px 0 -40px;
        padding: 0 40px 0 40px;
        -webkit-box-shadow: var(--pa-shadow-description);
        -moz-box-shadow: var(--pa-shadow-description);
        box-shadow: var(--pa-shadow-description);
    }

    .pa__work-area-head > .__description.hovered {
        -webkit-box-shadow: var(--pa-shadow-description-hovered);
        -moz-box-shadow: var(--pa-shadow-description-hovered);
        box-shadow: var(--pa-shadow-description-hovered);
    }

    .pa__work-area-head > .__description.collapsed {
        height: 71vh;
        transition: height 0.3s ease-in-out;
        box-shadow: none;
        -webkit-box-shadow: none;
        -moz-box-shadow: none;
        overflow-y: auto;
    }

    .pa__work-area-body {
        padding: 40px;
        background: white;
        overflow: hidden;
    }

    .pa__work-area-head, .pa__work-area-body > h1, h2, h3, h4, h5 {
        margin-top: 0;
    }


</style>