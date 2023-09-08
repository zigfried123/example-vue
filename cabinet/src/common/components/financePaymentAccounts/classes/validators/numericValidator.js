import validatorAbstract from "./validatorAbstract";

var validate = require("validate.js");

export default class numericValidator extends validatorAbstract {
    constructor() {
        super();
        this.numericError = "Неправильный формат числа"
    }

    validate(currentValue, validatorParams) {
        let validateEmpty = super.validate(currentValue, validatorParams)
        if(validateEmpty){
            return true;
        }else if(validateEmpty === false) {
            this.errorMessage = this.notAllowEmpty;
            return false;
        }

        if(currentValue === undefined) {
            return true;
        }

        let patternString = "^-?[\\d]+([.,]\\d{1,2})?$"
        if(validatorParams.integerOnly){
            patternString = "^-?[\\d]+?$";
        }
        
        let pattern = new RegExp(patternString);
        currentValue = currentValue.toString();
        this.errorMessage = this.numericError;
        return pattern.test(currentValue);
    }
}