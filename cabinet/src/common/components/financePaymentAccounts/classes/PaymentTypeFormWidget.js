import Loader from "./Loader";
import validateHelper from "./validators/validateHelper";
import validatorAbstract from "./validators/validatorAbstract";


export default class PaymentTypeFormWidget {

    /**
     * @param {String} key
     * @param {String} type
     * @param {Object} config
     */
    constructor(key, type, config) {
        this.key = key;
        this.type = type;
        this.model = null;
        this.config = config;
        this.error = null;
        this.ready = false;
        this.component = null;
    }

    setComponent(component) {
        this.component = component;
    }

    getVueType() {
        let expr = /([a-z])([A-Z])/g;
        if (!expr.test(this.type)) {
            return this.type;
        }

        return this.type.replace(expr, '$1-$2').toLowerCase();
    }
    setReady(boolean) {
        this.ready = boolean;
        this.setComponentProperty('ready', boolean);
    }

    setModel(model) {
        this.model = model;
        this.setComponentProperty('model', model);
    }

    getModel() {
        return this.model;
    }

    getKey() {
        return this.key;
    }

    getError() {
        return this.error;
    }

    getConfig() {
        return this.config;
    }

    setError(value) {
        this.error = value;
        this.setComponentProperty('error', value);
    }

    setComponentProperty(key, value) {
        if(this.component !== undefined && this.component[key] !== undefined) {
            this.component[key]= value;
        }
    }

    validate() {
        if(this.component) {
            return this.component.validate();
        }
    }

}
