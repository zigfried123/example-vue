<template>
    <div v-if="paymentType && widgets">
        <div v-for="(widget, widgetName) in widgets">
            <component
                    :is="widget.getVueType()"
                    :key="widget.getKey() + '_' + paymentType.code"
                    :ref="widget.getKey()"
                    :widget="widget"
            ></component>
        </div>

        <div class="pa__btn pa__btn-inline pa__btn__yellow pull-right" v-on:click="sendForm">
            <span>Сохранить</span>
        </div>
        <div class="pa__btn pa__btn-inline pull-right" v-on:click="cancelClose">
            <span>Отмена</span>
        </div>


    </div>
    <div v-else>
        <pa_load_stub message="Загрузка"></pa_load_stub>
    </div>
</template>

<script>
    import SolarCard from "../widgets/solarCard.vue";
    import InputField from "../widgets/inputField.vue";
    import AutocompleteField from "../widgets/autocompleteField.vue";
    import CheckboxField from "../widgets/checkboxField.vue";
    import SelectField from "../widgets/selectField.vue";
    import SmsConfirm from "../widgets/smsConfirm.vue";
    import Pa_load_stub from "../common/pa_load_stub.vue";
    import Pa_empty_stub from "../common/pa_empty_stub.vue";
    import Pa_empty_stub_basic from "../common/pa_empty_stub_basic.vue";

    import PaymentType from '../../classes/PaymentType';
    import Loader from "../../classes/Loader";

    export default {
        name: "pa_account_form",
        data() {
            return {
                isLoading: false,
                errors: [],
            }
        },
        computed: {
            /**
             *
             * @return {PaymentType}
             */
            paymentType() {
                return this.$store.getters.getActivePaymentType
            },

            formModel() {
                return this.paymentType.getForm().getFormModel();
            },

            formNotEmpty() {
                return Object.keys(this.formModel).length !== 0;
            },
            widgets() {
                this.paymentType.getForm().loadWidgets(this.$store.getters.getBaseUrl + 'getFormConfig');

                return this.paymentType.getForm().getWidgets();
            },
        },
        components: {
            Pa_empty_stub_basic,
            Pa_empty_stub,
            Pa_load_stub,
            SmsConfirm,
            InputField,
            SolarCard,
            CheckboxField,
            SelectField,
            AutocompleteField
        },
        methods: {
            cancelClose() {

            },
            successClose() {
                this.dropForm();
                /**
                 * TODO: Переделать на $emit
                 * @type {string}
                 */
                this.$parent.state = 'list';
                this.paymentType.paymentAccounts = [];
            },
            sendForm() {
                if (this.validateForm() === false) {
                    if (this.errors.length !== 0) {
                        notify('Пожалуйста, проверьте правильность введенных данных...', 'error');
                    }
                    return false;
                }

                let formData = this.getForm().getFormModel();
                console.log(formData);
                let _close = this.successClose;
                let loader = new Loader();
                loader
                    .setMethod('POST')
                    .setUrl(this.$store.getters.getBaseUrl + 'save')
                    .setData({
                        'label': this.paymentType.code,
                        'formData': formData
                    })
                    .run()
                    .then(function (response) {
                        if (response.data.success === true) {
                            _close();
                        }
                    });

            },
            validateForm() {
                return this.getForm().validate();
            },
            getForm() {
                return this.paymentType.getForm();
            },
            dropForm() {
                return this.$store.commit('setEmptyForm');
            },
            getKebabCase(string) {
                let expr = /([a-z])([A-Z])/g;
                if (!expr.test(string)) {
                    return string;
                }
                return string.replace(expr, '$1-$2').toLowerCase();
            },
            getChild(key) {
                return this.$refs[key] ? this.$refs[key][0] : undefined;
            },
        },
    }
</script>

<style scoped>
    .pa__work-area-help-panel {
        background: var(--pa-accent-light);
        position: relative;
        margin: 40px -40px -40px -40px;
        padding: 10px 40px 10px 40px;
    }

    .pa__widget-wrapper {
        padding: 15px 0 15px 0;
    }

    .pa__btn {
        position: relative;

        display: block;
        margin: 7px;
        padding: 0;

        overflow: hidden;

        border-width: 0;
        outline: none;
        border-radius: 2px !important;
        box-shadow: 0 1px 4px rgba(0, 0, 0, .6);

        background-color: #515151;
        color: white;

        transition: background-color .3s;

        cursor: pointer;
    }

    .pa__btn:hover {
        background-color: #000000;
        color: white;
    }

    .pa__btn.pa__btn-inline {
        display: inline-block;
    }

    .pa__btn > * {
        position: relative;
    }

    .pa__btn span {
        display: block;
        padding: 12px 24px;
    }

    .pa__btn:before {
        content: "";

        position: absolute;
        top: 50%;
        left: 50%;

        display: block;
        width: 0;
        padding-top: 0;

        border-radius: 100%;

        background-color: rgba(236, 240, 241, .3);

        -webkit-transform: translate(-50%, -50%);
        -moz-transform: translate(-50%, -50%);
        -ms-transform: translate(-50%, -50%);
        -o-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
    }

    .pa__btn:active:before {
        width: 120%;
        padding-top: 120%;
        transition: width .2s ease-out, padding-top .2s ease-out;
    }

    .pa__btn.pa__btn__red {
        background-color: #ff4a5f;
        color: white;
    }

    .pa__btn.pa__btn__red:hover {
        background-color: #de4457;
        color: white;
    }

    .pa__btn.pa__btn__yellow {
        background-color: var(--pa-accent-color);
        color: black;
    }

    .pa__btn.pa__btn__yellow:hover {
        background-color: var(--pa-accent-dark-color);
        color: black;
    }

    .pa__btn.pa__btn__green {
        background-color: #17c58d;
        color: white;
    }

    .pa__btn.pa__btn__green:hover {
        background-color: #17a373;
        color: white;
    }

</style>