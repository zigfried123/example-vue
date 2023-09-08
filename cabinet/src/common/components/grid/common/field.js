/**
 *
 */
import State from "./state";
import ValidateHelper from "../validators/validateHelper";

export default class Field {

    /**
     * Field constructor
     * @param name
     * @param {String} title
     * @param {String} type
     * @param {boolean} editable
     * @param {boolean} enabled
     * @param {boolean} visible
     * @param {Array} validators
     * @param {bool} isUnique
     */
    constructor(name, title, type, editable = true, enabled = true, visible = true, validators = [], isUnique = false, selectConfig = {}) {
        this.isUnique = isUnique;
        this.name = name;
        this.title = title;
        this.type = type;
        this.validators = validators;
        this.state = new State();
        this.editable = editable;
        this.enabled = enabled;
        this.visible = visible;
        this.alias = this.value = null;
        this.selectConfig = selectConfig;
        this.selectConfig.selectedValue = this.selectConfig.multiple ? [] : '';
        this.selectConfig.isLoading = false;
        this.selectConfig.options = [];
    }


    hide() {
        this.visible = false;
    }

    setSelectOptions(options) {
        this.selectConfig.options = options;
        let counter = 0;
        for (let optionKey in options) {
            this.selectConfig.options[counter] = options[optionKey].title;
            counter++;
        }
    }

    switchVisible() {
        return this.visible = !this.visible;
    }

    clearState() {
        this.state.clear();
    }

    validate(value) {
        for (let validatorName in this.validators) {
            let validatorParams = this.validators[validatorName];
            let validator = ValidateHelper.get(validatorName);
            if (validator === undefined) {
                return true;
            }
            if (!validator.validate(value, validatorParams)) {
                this.state.setError(validator.errorMessage);
                return false;
            } else {
                this.state.setSuccess('SUCCESS');
            }
        }
        return true;
    }
}