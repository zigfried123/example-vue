import validatorAbstract from "./validatorAbstract";

var validate = require("validate.js");

export default class maxLengthValidator extends validatorAbstract {
    constructor() {
        super();
        this.maxLengthError = "Слишком большое колличество знаков"
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

        this.errorMessage = '';
        let numberLength = currentValue.toString().length;
        if (numberLength <= validatorParams) {
            return true;
        }else{
            this.errorMessage = this.maxLengthError;
            return false;
        }


    }
}