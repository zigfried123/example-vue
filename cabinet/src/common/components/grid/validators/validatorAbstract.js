var validate = require("validate.js");

export default class validatorAbstract {

    constructor() {
        this.errorMessage = '';
        this.notAllowEmpty = "В данном поле не допускаются пустые значения";
    }

    /**
     *
     * @param currentValue
     * @param validatorParams
     * @returns {boolean}
     */
    validate(currentValue, validatorParams) {
        if (validate.isEmpty(currentValue) && validatorParams.allowEmpty) {
            return true;
        } else if (validate.isEmpty(currentValue) && !validatorParams.allowEmpty) {
            return false;
        }else{
           return null;
        }
    }
}