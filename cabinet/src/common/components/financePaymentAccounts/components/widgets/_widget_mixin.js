import PaymentTypeFormWidget from "../../classes/PaymentTypeFormWidget";
import validatorAbstract from "../../classes/validators/validatorAbstract";
import validateHelper from "../../classes/validators/validateHelper";

export default {
    name: "inputField",
    props: {
        /**
         * @property {PaymentTypeFormWidget}
         */
        widget: {
            type: PaymentTypeFormWidget
        },
    },
    data() {
        return {
            model: null,
            ready: false,
            error: null,
            initialized: false
        }
    },
    mounted() {
        if (this.config.defaultValue !== undefined) {
            this.$set(this, 'model', this.config.defaultValue);
        }
        this.widget.component = this;
    },
    updated() {
        this.$set(this, 'initialized', true);
    },
    computed: {
        messageClass() {
            return {
                'md-invalid': !!this.error
            }
        },
        config() {
            return this.widget.config;
        }
    },
    methods: {
        setModel(value, key = null) {
            if (key && this.model[key] !== undefined && this.error[key] !== undefined) {
                this.$set(this.error, key, null);
                this.$set(this.model, key, value);
            } else {
                this.$set(this, 'error', null);
                this.$set(this, 'model', value);
            }
        },
        setReady(bool) {
            this.$set(this, 'ready', !!bool);
        },
        setError(message, key = null) {
            if (!key) {
                this.$set(this, 'error', message);
            } else {
                this.$set(this.error, key, message);
            }
        },
        validate(fields = []) {
            let validators = this.config.validators;
            if (validators === undefined) {
                return true;
            }

            for (let validatorName in validators) {
                if (!validators.hasOwnProperty(validatorName)) {
                    continue;
                }

                let validator = validateHelper.get(validatorName);
                let validatorParams = validators[validatorName];


                if (!(validator instanceof validatorAbstract)) {
                    continue;
                }

                if (typeof this.model === 'object' && this.model.constructor.name !== 'Array') {
                    let isValid = true;
                    for (let fieldName in this.model) {
                        if (!this.model.hasOwnProperty(fieldName)) {
                            continue;
                        }

                        if(fields.length !== 0 && fields.indexOf(fieldName) === null) {
                            continue;
                        }

                        if (!validator.validate(this.model[fieldName], validatorParams)) {
                            this.setError(validator.errorMessage, fieldName);
                            isValid = false;
                        } else {
                            this.setError(null, fieldName);
                        }
                    }
                    if (!isValid) {
                        return false;
                    }
                } else {
                    if (!validator.validate(this.model, validatorParams)) {
                        this.setError(validator.errorMessage);
                        return false;
                    } else {
                        this.setError(null);
                    }
                }
            }

            return true;


        },
        internalValidate() {
            return true;
        },
    },
    watch: {
        model: {
            handler(newData, oldData) {
                this.widget.model = newData;
                this.setReady(true);
                if (this.ready && this.initialized) {
                    this.validate();
                    this.internalValidate();
                }
            },
            deep: true,
        },
        ready(newData, oldData) {
            this.widget.setReady(newData);
            if (this.ready && this.initialized) {
                this.validate();
                this.internalValidate();
            }
        },
        error(newData, oldData) {
            this.widget.error = newData;
        },
    }
};