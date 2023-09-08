import minValValidator from './minValValidator';
import regExpValidator from './regExpValidator';
import numericValidator from './numericValidator';
import requiredValidator from './requiredValidator';
import validatorAbstract from "./validatorAbstract";
import maxLengthValidator from "./maxLengthValidator";

/**
 * @property {Array} validators
 */
export default class ValidateHelper {

    /**
     *
     * @param name
     * @returns {validatorAbstract}
     */
    static get(name) {
        if(this.validators === undefined) {
            this.init();
        }

        return this.validators[name];
    }

    static init() {
        this.validators = {
            'required': new requiredValidator(),
            'numeric': new numericValidator(),
            'regExp': new regExpValidator(),
            'minVal': new minValValidator(),
            'maxLength': new maxLengthValidator(),
        };
    }
}